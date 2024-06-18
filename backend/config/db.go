package config

import (
    "log"
    "myapp/models"

    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    var err error
    DB, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // Migrate the schema
    DB.AutoMigrate(&models.Client{}, &models.User{}, &models.Service{}, &models.Appointment{})

    // Populate services
    populateServices()
}

func populateServices() {
    services := []models.Service{
        {Name: "Oil Change"},
        {Name: "Brake Inspection"},
        {Name: "Tire Rotation"},
        {Name: "Engine Diagnostic"},
        {Name: "Battery Replacement"},
        {Name: "Transmission Repair"},
        {Name: "Wheel Alignment"},
        {Name: "Suspension Repair"},
        {Name: "AC Service"},
    }

    for _, service := range services {
        DB.FirstOrCreate(&service, models.Service{Name: service.Name})
    }
}

