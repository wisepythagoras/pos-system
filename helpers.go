package main

import (
	"errors"
	"log"
	"net"
	"strconv"

	"github.com/gin-gonic/gin"
)

func DivMod(numerator, denominator int64) (quotient, remainder int64) {
	quotient = numerator / denominator
	remainder = numerator % denominator
	return
}

func IntToColumnString(col int64) string {
	str := ""

	for col > 0 {
		n, remainder := DivMod(col-1, 26)
		str = string(65+remainder) + str
		col = n
	}

	return str
}

func GetOutboundIP() net.IP {
	conn, err := net.Dial("udp", "1.1.1.1:53")

	if err != nil {
		log.Fatal(err)
	}

	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)

	return localAddr.IP
}

// getIntFromParams parses an id from the param string.
func getIntFromParams(name string, c *gin.Context) (int, error) {
	itemIdStr := c.Param(name)

	if len(itemIdStr) == 0 {
		return 0, errors.New("invalid numeric id")
	}

	itemId, err := strconv.Atoi(itemIdStr)

	if err != nil {
		return 0, err
	}

	return itemId, nil
}
