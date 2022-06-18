package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

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

// Logout removes a user's session.
func (uh *UserHandlers) Logout(c *gin.Context) {
	session := sessions.Default(c)

	currentUser := session.Get("user")

	if currentUser != nil {
		session.Delete("user")
		session.Save()
	}

	c.Redirect(http.StatusMovedPermanently, "/?m=Logged out!")
}

// GetLoggedInUser will return the currently logged in user.
func (uh *UserHandlers) GetLoggedInUser(c *gin.Context) {
	session := sessions.Default(c)
	apiResponse := ApiResponse{}

	currentUser := session.Get("user")
	apiResponse.Success = false

	if currentUser != nil {
		userStruct := &UserStruct{}
		user := &User{}
		err := json.Unmarshal([]byte(currentUser.(string)), userStruct)

		if err != nil {
			apiResponse.Success = false
			apiResponse.Error = err.Error()
		} else if userStruct.ID == 0 {
			apiResponse.Success = true
			apiResponse.Data = UserJSON{
				ID:        userStruct.ID,
				Username:  userStruct.Username,
				StationID: 0,
				Station:   nil,
			}
		} else {
			uh.
				DB.
				Preload("Station").
				Preload("Station.StationProducts.Product").
				Where("id = ?", userStruct.ID).
				Find(&user)

			var station *StationJSON

			if user.Station.ID > 0 {
				products := []ProductJSON{}

				for _, sp := range user.Station.StationProducts {
					products = append(products, ProductJSON{
						ID:           sp.Product.ID,
						Name:         sp.Product.Name,
						Discontinued: sp.Product.Discontinued == 1,
						Price:        sp.Product.Price,
						SoldOut:      sp.Product.SoldOut == 1,
						Type:         sp.Product.Type,
					})
				}

				station = &StationJSON{
					ID:        user.Station.ID,
					Name:      user.Station.Name,
					CreatedAt: user.Station.CreatedAt,
					UpdatedAt: user.Station.UpdatedAt,
					Products:  products,
				}
			}

			apiResponse.Success = true
			apiResponse.Data = UserJSON{
				ID:        userStruct.ID,
				Username:  userStruct.Username,
				StationID: uint64(user.StationID),
				CreatedAt: user.CreatedAt,
				UpdatedAt: user.UpdatedAt,
				Station:   station,
			}
		}
	}

	c.JSON(http.StatusOK, apiResponse)
}

// Create will handle the request to create a new user.
func (uh *UserHandlers) Create(c *gin.Context) {
	apiResponse := ApiResponse{}

	username := c.PostForm("username")
	password := c.PostForm("password")
	stationId, _ := strconv.Atoi(c.PostForm("station_id"))

	if len(username) == 0 || len(password) == 0 {
		apiResponse.Success = false
		apiResponse.Error = "The username or password is empty"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	if len(password) < 8 {
		apiResponse.Success = false
		apiResponse.Error = "The password is too short"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	hash, err := crypto.GetSHA3512Hash([]byte(password))

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = "Unknown error"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	newUser := &User{
		Username:  username,
		Password:  crypto.ByteArrayToHex(hash),
		StationID: uint8(stationId),
	}

	result := uh.DB.Save(newUser)

	if result.RowsAffected == 0 {
		apiResponse.Success = false
		apiResponse.Error = "Unable to add user to the database"
	}

	apiResponse.Success = true

	c.JSON(http.StatusOK, apiResponse)
}

// List returns a list of users.
func (uh *UserHandlers) List(c *gin.Context) {
	apiResponse := ApiResponse{}

	var users []User
	jsonUsers := []UserJSON{}

	uh.
		DB.
		Preload("Station").
		Order("id desc").
		Find(&users)

	for _, user := range users {
		var station *StationJSON

		if user.Station.ID > 0 {
			station = &StationJSON{
				ID:        user.Station.ID,
				Name:      user.Station.Name,
				CreatedAt: user.Station.CreatedAt,
				UpdatedAt: user.Station.UpdatedAt,
			}
		}

		jsonUser := UserJSON{
			ID:        user.ID,
			Username:  user.Username,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
			StationID: uint64(user.StationID),
			Station:   station,
		}

		jsonUsers = append(jsonUsers, jsonUser)
	}

	apiResponse.Success = true
	apiResponse.Data = jsonUsers

	c.JSON(http.StatusOK, apiResponse)
}

// Delete hard removes a user record from the DB.
func (uh *UserHandlers) Delete(c *gin.Context) {
	apiResponse := ApiResponse{}

	userId, err := getIDFromParams("userId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	result := uh.DB.Exec("delete from users where id = ?", userId)

	apiResponse.Success = true

	if result.RowsAffected == 0 {
		apiResponse.Success = false
		apiResponse.Error = "Unable to remove user"
	}

	c.JSON(http.StatusOK, apiResponse)
}
