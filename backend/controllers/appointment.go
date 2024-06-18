package controllers

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "myapp/config"
    "myapp/models"
)

func GetAppointments(c *gin.Context) {
    var appointments []models.Appointment
    if err := config.DB.Preload("Client").Preload("Service").Find(&appointments).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"appointments": appointments})
}

func CreateAppointment(c *gin.Context) {
	var appointment models.Appointment
	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parsing date and time to ensure they are valid
	if _, err := time.Parse("2006-01-02", appointment.ScheduleDate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid schedule date"})
		return
	}

	if _, err := time.Parse("15:04", appointment.ScheduleTime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid schedule time"})
		return
	}

	if err := config.DB.Create(&appointment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"appointment": appointment})
}

func DeleteAppointment(c *gin.Context) {
    id := c.Param("id")
    if err := config.DB.Delete(&models.Appointment{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Appointment deleted"})
}
