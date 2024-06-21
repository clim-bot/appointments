package models

import "time"

type User struct {
    ID               uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Name             string    `json:"name"`
    Email            string    `json:"email" gorm:"unique"`
    Password         string    `json:"-"`
    ActivationToken  string    `json:"-"`
    Activated        bool      `json:"-"`
    ResetToken       string    `json:"reset_token,omitempty"`
    ResetTokenExpiry time.Time `json:"reset_token_expiry,omitempty"`
}
