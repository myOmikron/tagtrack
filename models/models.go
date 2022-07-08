package models

import (
	"time"

	"github.com/myOmikron/echotools/utilitymodels"
)

type AccountInfo struct {
	utilitymodels.CommonID
	IsCustomer  bool `gorm:"not null;default:true"`
	LocalUserID uint
	LocalUser   utilitymodels.LocalUser
}

type OrderState struct {
	utilitymodels.CommonID
	Step        uint
	Description *string
}

type Order struct {
	utilitymodels.CommonID
	CreatedAt       time.Time               `json:"created"`
	UpdatedAt       time.Time               `json:"updated"`
	OrderID         string                  `json:"orderID"` // Invoice Number
	CustomerID      uint                    `json:"customerID"`
	Customer        utilitymodels.LocalUser `json:"customer"`
	Description     string                  `json:"description"`
	ProcessingSteps []ProcessingStep        `json:"steps"`
	Steps           uint
	StepMax         uint
	OrderStateID    uint
	OrderState      OrderState
	Tags            []Tag
}

type ProcessingStep struct {
	utilitymodels.CommonID
	Description      string `json:"description"`
	OrderID          uint
	RequiredMachines []Machine `json:"requiredMachines"`
}

type Machine struct {
	utilitymodels.CommonID
	Name             string `json:"name"`
	CurrentlyUsed    bool   `json:"currentlyUsed"`
	ProcessingStepID uint
	TagID            uint `json:"tagID"`
	Tag              Tag
}

type Tag struct {
	utilitymodels.Common
	OrderID uint
}

type Device struct {
	utilitymodels.CommonID
	Description *string
}

type LocationPing struct {
	utilitymodels.CommonID
	TagID     uint      `json:"tagID"`
	DeviceID  uint      `json:"deviceID"`
	CreatedAt time.Time `json:"created"`
}
