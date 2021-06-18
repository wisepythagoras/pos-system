package main

type ServerConfig struct {
	Port int
}

type Config struct {
	Server ServerConfig
	Secret string
}
