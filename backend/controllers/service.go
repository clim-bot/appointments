package controllers

import (
    "net/http"
    "myapp/config"
    "myapp/models"
    "github.com/gin-gonic/gin"
)

func GetServices(c *gin.Context) {
    var services []models.Service
    if err := config.DB.Find(&services).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"services": services})
}
