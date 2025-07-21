package core

type ServerConfig struct {
	Port int
}

type AdminUser struct {
	Username string
	Password string
	Token    string
}

type Printer struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Server   string `json:"-"`
	Port     int    `json:"-"`
	Username string `json:"-"`
	Password string `json:"-"`
}

type Config struct {
	Server          ServerConfig
	Admin           AdminUser
	Printers        []Printer
	DisablePrinting bool `yaml:"disable_printing"`
	Secret          string
	Key             string
	Name            string
	Address1        string
	Address2        string
	CCSurcharge     uint
}

type PrintingConfig struct {
	Listener struct {
		Token string
		Host  string
	}
}
