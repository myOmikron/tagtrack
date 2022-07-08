package endpoints

import "gorm.io/gorm"

type Wrapper struct {
	Database *gorm.DB
}
