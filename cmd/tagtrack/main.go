package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
	"os"

	"github.com/hellflame/argparse"
	"github.com/myOmikron/echotools/database"
	"github.com/myOmikron/echotools/utilitymodels"
	"github.com/myOmikron/tagtrack/models"
	"github.com/myOmikron/tagtrack/server"
)

func assertAvailablePRNG() {
	buf := make([]byte, 1)
	_, err := io.ReadFull(rand.Reader, buf)
	if err != nil {
		panic(fmt.Sprintf("crypto/rand is unavailable: Read() error %#v", err))
	}
}

func generateRandomBytes(n int) ([]byte, error) {
	assertAvailablePRNG()
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func generateRandomBase64String(n int) (string, error) {
	b, err := generateRandomBytes(n)
	return base64.URLEncoding.EncodeToString(b), err
}

func main() {
	parser := argparse.NewParser("tagtrack", "TagTrack server", nil)

	parserRun := parser.AddCommand("run", "Execute the backend server process", &argparse.ParserConfig{
		DisableDefaultShowHelp: true,
	})
	port := parserRun.Int("p", "port", &argparse.Option{Default: "8080"})

	parserDevice := parser.AddCommand("device", "Create a new device for deployment", nil)
	deviceDescription := parserDevice.String("d", "description", nil)

	parserAddUser := parser.AddCommand("add", "Create a new local user", nil)
	userUsername := parserAddUser.String("u", "username", &argparse.Option{Required: true})
	userPassword := parserAddUser.String("p", "password", &argparse.Option{Required: true})

	parserAddCustomer := parser.AddCommand("customer", "Create a new customer user", nil)
	customerUsername := parserAddCustomer.String("u", "username", &argparse.Option{Required: true})
	customerPassword := parserAddCustomer.String("p", "password", &argparse.Option{Required: true})

	if e := parser.Parse(nil); e != nil {
		fmt.Println(e.Error())
		return
	}

	switch {
	case parserRun.Invoked:
		server.Start(*port)

	case parserDevice.Invoked:
		db := server.InitDB()
		sharedSecret, err := generateRandomBase64String(24)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			os.Exit(1)
		}
		device := models.Device{
			Description:     deviceDescription,
			PreSharedSecret: sharedSecret,
		}
		db.Create(&device)
		fmt.Printf(
			"Successfully added a new device with ID %d.\nDescription:\t%s\nShared secret:\t%s\nMAKE SURE TO COPY & SAFE THIS SHARED SECRET!",
			device.ID, *device.Description, device.PreSharedSecret)

	case parserAddCustomer.Invoked:
		db := server.InitDB()
		if customerUsername == nil || customerPassword == nil {
			fmt.Println("Invalid username or password")
			os.Exit(1)
		}

		var users []utilitymodels.LocalUser
		db.Where(utilitymodels.LocalUser{Username: *customerUsername}).Find(&users)
		if len(users) > 0 {
			fmt.Println("The username has already been taken.")
			os.Exit(1)
		}

		user, err := database.CreateLocalUser(db, *customerUsername, *customerPassword, nil)
		if err != nil {
			fmt.Println("Failed to create the customer:", err)
			os.Exit(1)
		}

		account := models.AccountInfo{IsCustomer: true, LocalUserID: user.ID}
		db.Create(&account)
		fmt.Printf("Successfully created customer '%s' with ID %d", *customerUsername, user.ID)

	case parserAddUser.Invoked:
		db := server.InitDB()
		if userUsername == nil || userPassword == nil {
			fmt.Println("Invalid username or password")
			os.Exit(1)
		}

		var users []utilitymodels.LocalUser
		db.Where(utilitymodels.LocalUser{Username: *userUsername}).Find(&users)
		if len(users) > 0 {
			fmt.Println("The username has already been taken.")
			os.Exit(1)
		}

		user, err := database.CreateLocalUser(db, *userUsername, *userPassword, nil)
		if err != nil {
			fmt.Println("Failed to create the user:", err)
			os.Exit(1)
		}

		account := models.AccountInfo{IsCustomer: false, LocalUserID: user.ID}
		db.Create(&account)
		fmt.Printf("Successfully created user '%s' with ID %d", *userUsername, user.ID)
	}
}
