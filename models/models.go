package models

import "github.com/myOmikron/echotools/utilitymodels"

type AccountInfo struct {
	utilitymodels.CommonID
	IsCustomer  bool `gorm:"not null;default:true"`
	LocalUserID uint
	LocalUser   utilitymodels.LocalUser
}

type State struct {
	utilitymodels.CommonID
	Step        uint
	Description *string
}

type Order struct {
	utilitymodels.Common
	OrderID          string // Invoice Number
	CustomerID       uint
	Customer         utilitymodels.LocalUser
	ShortDescription string
	Step             uint
	StepMax          uint
	StateID          uint
	State            State
}
