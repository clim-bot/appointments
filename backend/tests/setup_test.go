package tests

import (
    "os"
    "testing"

    "github.com/gin-gonic/gin"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "myapp/config"
    "myapp/controllers"
    "myapp/models"
    "golang.org/x/crypto/bcrypt"
)

func setupRouter() *gin.Engine {
    router := gin.Default()
    config.DB, _ = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
    config.DB.AutoMigrate(&models.User{})

    populateTestData()

    protected := router.Group("/")
    protected.Use(AuthMiddleware())

    protected.GET("/settings", controllers.Profile)
    protected.POST("/settings/change-password", controllers.ChangePassword)

    protected.GET("/clients", controllers.GetClients)
    protected.POST("/clients", controllers.CreateClient)
    protected.PUT("/clients/:id", controllers.UpdateClient)
    protected.DELETE("/clients/:id", controllers.DeleteClient)

    protected.GET("/appointments", controllers.GetAppointments)
    protected.POST("/appointments", controllers.CreateAppointment)
    protected.DELETE("/appointments/:id", controllers.DeleteAppointment)

    protected.GET("/services", controllers.GetServices)

    protected.GET("/download-report", controllers.DownloadReport)

    return router
}

func populateTestData() {
    password, _ := bcrypt.GenerateFromPassword([]byte("oldpassword"), bcrypt.DefaultCost)
    user := models.User{
        Name:     "Test User",
        Email:    "testuser@example.com",
        Password: string(password),
    }
    config.DB.Create(&user)
}

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Set("user_id", 1)
        c.Next()
    }
}

func TestMain(m *testing.M) {
    setupRouter()
    code := m.Run()
    os.Exit(code)
}
