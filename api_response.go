package main

type ApiResponse struct {
	Data    interface{} `json:"data"`
	Success bool        `json:"success"`
	Error   string      `json:"error"`
}
