package models

type Service struct {
    ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
    Name string `json:"name"`
}
