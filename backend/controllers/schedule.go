package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type Event struct {
	Title string    `json:"title"`
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}

func GetSchedule(c *gin.Context) {
	// Example events
	events := []Event{
		{Title: "Meeting with John", Start: time.Date(2023, 6, 25, 10, 0, 0, 0, time.UTC), End: time.Date(2023, 6, 25, 11, 0, 0, 0, time.UTC)},
		{Title: "Dentist Appointment", Start: time.Date(2023, 6, 26, 15, 0, 0, 0, time.UTC), End: time.Date(2023, 6, 26, 16, 0, 0, 0, time.UTC)},
	}

	c.JSON(http.StatusOK, gin.H{"events": events})
}
