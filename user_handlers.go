package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/wisepythagoras/pos-system/crypto"
	"gorm.io/gorm"
)

// UserHandlers defines the HTTP handlers for the user routes.
type UserHandlers struct {
	DB     *gorm.DB
	Config *Config
}

// LoginPage renders the login page.
func (uh *UserHandlers) LoginPage(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get("user")

	// Prevent anyone who is not logged in to view this page.
	if user != nil || user == "" {
		c.Redirect(http.StatusMovedPermanently, "/#")
		return
	}

	c.HTML(http.StatusOK, "login.html", gin.H{})
}

// Login will check the password and username against the DB and
// create a session for valid users.
func (uh *UserHandlers) Login(c *gin.Context) {
	// Extend this to auth users from the DB (pos users) and break
	// into its own handler.

	session := sessions.Default(c)

	username := c.PostForm("username")
	password := c.PostForm("password")

	if len(username) == 0 || len(password) == 0 {
		c.Redirect(http.StatusMovedPermanently, "/?e=Unable to log in")
		return
	}

	// Hash the password.
	hash, err := crypto.GetSHA3512Hash([]byte(password))

	if err != nil {
		c.Redirect(http.StatusMovedPermanently, "/?e=Unable to log in")
		return
	}

	passwordHash := crypto.ByteArrayToHex(hash)

	adminUsername := uh.Config.Admin.Username
	adminPassword := uh.Config.Admin.Password

	// Check for an admin user.
	if username == adminUsername && passwordHash == adminPassword {
		newUser := &UserStruct{
			ID:       0,
			Username: "admin",
			IsAdmin:  true,
		}
		newUserJSON, _ := json.Marshal(newUser)

		// Create the new session.
		session.Set("user", string(newUserJSON))
		err := session.Save()

		fmt.Println(err)

		c.Redirect(http.StatusMovedPermanently, "/?m=Logged in!")

		return
	}

	// Check here users that are stored in the DB.
	user := User{}
	uh.DB.First(&user, "username = ?", username)

	if user.ID > 0 && user.Password == passwordHash {
		newUser := &UserStruct{
			ID:       user.ID,
			Username: user.Username,
			IsAdmin:  false,
		}
		newUser.SetUser(&user)
		newUserJSON, _ := json.Marshal(newUser)

		// Create the new session.
		session.Set("user", string(newUserJSON))
		session.Save()

		c.Redirect(http.StatusMovedPermanently, "/?m=Logged in!")

		return
	}

	c.Redirect(http.StatusMovedPermanently, "/?e=Invalid username or password")
}
