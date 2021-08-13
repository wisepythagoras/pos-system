package main

type ServerConfig struct {
	Port int
}

type AdminUser struct {
	Username string
	Password string
	Token    string
}

type Printer struct {
	ID       int
	Name     string
	Server   string
	Port     int
	Username string
	Password string
}

type Config struct {
	Server   ServerConfig
	Admin    AdminUser
	Printers []Printer
	Secret   string
	Key      string
	Name     string
	Address1 string
	Address2 string
}
