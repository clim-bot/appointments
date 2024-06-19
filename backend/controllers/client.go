package controllers

import (
    "net/http"
    "myapp/config"
    "myapp/models"
    "github.com/gin-gonic/gin"
	"time"
)

func GetClients(c *gin.Context) {
    var clients []models.Client
    if err := config.DB.Find(&clients).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"clients": clients})
}

func CreateClient(c *gin.Context) {
	var client models.Client
	if err := c.ShouldBindJSON(&client); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}
	if err := config.DB.Create(&client).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, client)
}

func UpdateClient(c *gin.Context) {
	var client models.Client
	id := c.Param("id")
	if err := config.DB.Where("id = ?", id).First(&client).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Client not found"})
		return
	}
	if err := c.ShouldBindJSON(&client); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}
	if err := config.DB.Save(&client).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, client)
}

func DeleteClient(c *gin.Context) {
	var client models.Client
	id := c.Param("id")
	if err := config.DB.Where("id = ?", id).First(&client).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Client not found"})
		return
	}

	// Check if client has upcoming appointments
    var appointments []models.Appointment
    if err := config.DB.Where("client_id = ? AND schedule_date >= ?", id, time.Now()).Find(&appointments).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking appointments"})
        return
    }

    if len(appointments) > 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Client has upcoming appointments"})
        return
    }

	if err := config.DB.Delete(&client).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Client deleted"})
}