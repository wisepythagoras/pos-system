package main

type ServerConfig struct {
	Port int
}

type AdminUser struct {
	Username string
	Password string
	Token    string
}

type Config struct {
	Server ServerConfig
	Admin  AdminUser
	Secret string
}
