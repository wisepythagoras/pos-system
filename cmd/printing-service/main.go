package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/spf13/viper"
	"github.com/wisepythagoras/pos-system/core"
)

// parseConfig parses the configuration either from the same folder, or
// from an explicit path.
func parseConfig(customConfig *string) (*core.PrintingConfig, error) {
	if customConfig == nil || len(*customConfig) == 0 {
		viper.SetConfigName("config")
		viper.SetConfigType("yaml")
		viper.AddConfigPath(".")
	} else {
		viper.SetConfigFile(*customConfig)
	}

	var config core.PrintingConfig

	// Try to read the configuration file.
	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	// Default config.
	viper.SetDefault("server.port", 8088)

	// Parse the configuration into the config object.
	err := viper.Unmarshal(&config)

	if err != nil {
		return nil, err
	}

	return &config, nil
}

func main() {
	customConfig := flag.String("config", "", "The path to a custom config file")
	flag.Parse()

	config, err := parseConfig(customConfig)

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/orders/stream", config.Listener.Host), nil)

	if err != nil {
		fmt.Println("Request error:", err)
		return
	}

	for {
		req.Header.Set("x-auth-token", config.Listener.Token)
		client := &http.Client{}
		resp, err := client.Do(req)

		if err != nil {
			log.Println("Connection error:", err)
			time.Sleep(1 * time.Second)
			continue
		}

		reader := bufio.NewReader(resp.Body)

		for {
			line, err := reader.ReadBytes('\n')

			if err != nil {
				log.Println("Read error:", err)
				continue
			}

			cleanLine := string(line)

			if strings.HasPrefix(cleanLine, "data:") {
				log.Println(cleanLine[5:])
			}
		}
	}
}
