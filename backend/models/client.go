package models

type Client struct {
	ID          uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string `gorm:"not null" json:"name"`
	Address     string `json:"address"`
	State       string `json:"state"`
	ZipCode     string `json:"zip_code"`
	PhoneNumber string `json:"phone_number"`
}

