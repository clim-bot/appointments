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

    // Parse and validate date and time
    scheduleDate, err := time.Parse("2006-01-02", appointment.ScheduleDate)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid schedule date"})
        return
    }

    scheduleTime, err := time.Parse("15:04", appointment.ScheduleTime)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid schedule time"})
        return
    }

    // Business rules validation
    if scheduleDate.Weekday() == time.Sunday {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No work on Sundays"})
        return
    }

    if scheduleDate.Weekday() == time.Saturday {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No work on Saturdays"})
        return
    }

    businessHoursStart := time.Date(0, 1, 1, 7, 0, 0, 0, time.UTC) // 7 AM
    businessHoursEnd := time.Date(0, 1, 1, 16, 0, 0, 0, time.UTC)   // 4 PM

    if scheduleTime.Before(businessHoursStart) || scheduleTime.After(businessHoursEnd) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Appointment must be within business hours (7 AM - 4 PM)"})
        return
    }

    holidays := []string{
        "2024-01-01", // New Year's Day
        "2024-12-25", // Christmas
        "2024-11-28", // Thanksgiving
        "2024-09-02", // Labor Day
        "2024-11-11", // Veterans Day
        "2024-07-04", // 4th of July
    }

    for _, holiday := range holidays {
        holidayDate, _ := time.Parse("2006-01-02", holiday)
        if scheduleDate.Equal(holidayDate) {
            c.JSON(http.StatusBadRequest, gin.H{"error": "No work on holidays"})
            return
        }
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
