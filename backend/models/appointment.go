package models

import (
	"time"
)

type Appointment struct {
	ID          uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	ScheduleName  string    `json:"schedule_name"`
	Description   string    `json:"description"`
	ClientID      uint      `json:"client_id"`
	Client        Client    `json:"client"`
	ServiceID     uint      `json:"service_id"`
	Service       Service   `json:"service"`
	ScheduleDate  time.Time `json:"schedule_date"`
	ScheduleTime  string    `json:"schedule_time"`
}
