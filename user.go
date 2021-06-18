package main

// UserStruct defines the user object type.
type UserStruct struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	IsAdmin  bool   `json:"is_admin"`
	user     *User  `json:"-"`
}

// SetUser sets the user object (from the db) on the object.
func (u *UserStruct) SetUser(user *User) {
	u.user = user
}
