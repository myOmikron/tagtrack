package models

import (
	"time"

	"github.com/myOmikron/echotools/utilitymodels"
)

type AccountInfo struct {
	utilitymodels.CommonID
	IsCustomer  bool `gorm:"not null"`
	LocalUserID uint
	LocalUser   utilitymodels.LocalUser
}

type OrderState struct {
	utilitymodels.CommonID
	Step        uint    `json:"step"`
	Description *string `json:"description"`
}

type Order struct {
	utilitymodels.CommonID
	CreatedAt       time.Time               `json:"created"`
	UpdatedAt       time.Time               `json:"updated"`
	OrderID         string                  `json:"orderID"` // Invoice Number
	CustomerID      uint                    `json:"customerID"`
	Customer        utilitymodels.LocalUser `json:"-"`
	Description     string                  `json:"description"`
	ProcessingSteps []ProcessingStep        `json:"steps"`
	OrderStateID    uint                    `json:"-"`
	OrderState      OrderState              `json:"orderState"`
	Tags            []Tag                   `json:"tags"`
}

type ProcessingStep struct {
	utilitymodels.CommonID
	Description      string    `json:"description"`
	OrderID          uint      `json:"-"`
	Finished         bool      `json:"finished"`
	RequiredMachines []Machine `json:"requiredMachines"`
}

type Machine struct {
	utilitymodels.CommonID
	Name             string `json:"name"`
	CurrentlyUsed    bool   `json:"currentlyUsed"`
	ProcessingStepID uint   `json:"-"`
	TagID            uint   `json:"tagID"`
	Tag              Tag    `json:"-"`
}

type Tag struct {
	utilitymodels.Common
	OrderID *uint `gorm:"null" json:"-"`
}

type Device struct {
	utilitymodels.Common
	Description     *string
	PreSharedSecret string
}

type LocationPing struct {
	utilitymodels.CommonID
	TagID     uint      `json:"tagID"`
	DeviceID  uint      `json:"deviceID"`
	CreatedAt time.Time `json:"created"`
}

type MachineLog struct {
	utilitymodels.CommonID
	MachineID  uint      `json:"machineID"`
	Machine    Machine   `json:"-"`
	HasStarted bool      `json:"hasStarted"`
	CreatedAt  time.Time `json:"created"`
}
