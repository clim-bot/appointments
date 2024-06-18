package main

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"myapp/config"
	"myapp/models"
	"myapp/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Adjust the port if your frontend is running on a different port
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Connect to the database
	config.ConnectDB()

	// Populate mock data if enabled
	if os.Getenv("USE_MOCK_DATA") == "true" {
		populateMockData()
	}

	// Setup routes
	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}

func populateMockData() {
	var data struct {
		Clients     []models.Client     `json:"clients"`
		Services    []models.Service    `json:"services"`
		Appointments []models.Appointment `json:"appointments"`
	}

	file, err := os.ReadFile("data/db.json")
	if err != nil {
		log.Fatal("Error reading mock data file:", err)
	}

	if err := json.Unmarshal(file, &data); err != nil {
		log.Fatal("Error unmarshalling mock data:", err)
	}

	for _, client := range data.Clients {
		config.DB.FirstOrCreate(&client, models.Client{Name: client.Name})
	}

	for _, service := range data.Services {
		config.DB.FirstOrCreate(&service, models.Service{Name: service.Name})
	}

	for _, appointment := range data.Appointments {
		config.DB.FirstOrCreate(&appointment, models.Appointment{ScheduleName: appointment.ScheduleName})
	}
}
