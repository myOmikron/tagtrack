package main

import (
	"log"

	"server"
)

func main() {
	log.Println("Starting tagtrack server!")
	server.Start()
}
