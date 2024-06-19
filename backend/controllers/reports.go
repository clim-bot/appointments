package controllers

import (
	"encoding/csv"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"myapp/config"
	"myapp/models"
)

func DownloadReport(c *gin.Context) {
    clientName := c.Query("client")

    var client models.Client
    if err := config.DB.Where("name = ?", clientName).First(&client).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Client not found"})
        return
    }

    var appointments []models.Appointment
    if err := config.DB.Where("client_id = ?", client.ID).Preload("Service").Find(&appointments).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch appointments"})
        return
    }

    csvData, err := generateCSVReport(client, appointments)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate CSV report"})
        return
    }

    c.Header("Content-Type", "text/csv")
    c.Header("Content-Disposition", "attachment;filename=report.csv")
    c.String(http.StatusOK, csvData)
}

func generateCSVReport(client models.Client, appointments []models.Appointment) (string, error) {
    var b strings.Builder
    w := csv.NewWriter(&b)

    // Write the header
    if err := w.Write([]string{"Client Name", "Service", "Description", "Schedule Date", "Schedule Time"}); err != nil {
        return "", err
    }

    // Write the data
    for _, appointment := range appointments {
        if err := w.Write([]string{
            client.Name,
            appointment.Service.Name,
            appointment.Description,
            appointment.ScheduleDate, // Remove .Format("2006-01-02")
            appointment.ScheduleTime,
        }); err != nil {
            return "", err
        }
    }

    w.Flush()
    if err := w.Error(); err != nil {
        return "", err
    }

    return b.String(), nil
}

