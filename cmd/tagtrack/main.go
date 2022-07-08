package main

import (
	"fmt"
	"os"

	"github.com/hellflame/argparse"
	"github.com/myOmikron/echotools/database"
	"github.com/myOmikron/echotools/utilitymodels"
	"github.com/myOmikron/tagtrack/server"
)

func main() {
	parser := argparse.NewParser("tagtrack", "TagTrack server", nil)

	parserRun := parser.AddCommand("run", "Execute the backend server process", &argparse.ParserConfig{
		DisableDefaultShowHelp: true,
	})
	port := parserRun.Int("p", "port", &argparse.Option{Default: "8080"})

	parserAddUser := parser.AddCommand("add", "Create a new local user", nil)
	username := parserAddUser.String("u", "username", &argparse.Option{Required: true})
	password := parserAddUser.String("p", "password", &argparse.Option{Required: true})

	if e := parser.Parse(nil); e != nil {
		fmt.Println(e.Error())
		return
	}

	switch {
	case parserRun.Invoked:
		server.Start(*port)
	case parserAddUser.Invoked:
		db := server.InitDB()
		if username == nil || password == nil {
			fmt.Println("Invalid username or password")
			os.Exit(1)
		}

		var users []utilitymodels.LocalUser
		db.Where(utilitymodels.LocalUser{Username: *username}).Find(&users)
		if len(users) > 0 {
			fmt.Println("The username has already been taken.")
			os.Exit(1)
		}

		user, err := database.CreateLocalUser(db, *username, *password, nil)
		if err != nil {
			fmt.Println("Failed to create the user:", err)
			os.Exit(1)
		}
		fmt.Printf("Successfully created user '%s' with ID %d", *username, user.ID)
	}
}
