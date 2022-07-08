package main

import (
	"log"

	"github.com/myOmikron/tagtrack/server"
)

func main() {
	log.Println("Starting tagtrack server!")
	server.Start()
}
