package routes

import (
    "myapp/controllers"
    "myapp/middleware"

    "github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
    auth := router.Group("/auth")
    {
        auth.POST("/register", controllers.Register)
        auth.POST("/login", controllers.Login)
    }

    protected := router.Group("/")
    protected.Use(middleware.Auth())
    {
        protected.GET("/dashboard", controllers.Dashboard)
        protected.GET("/profile", controllers.Profile)
        protected.GET("/settings", controllers.Settings)

        // Client routes
        protected.GET("/clients", controllers.GetClients)
        protected.POST("/clients", controllers.CreateClient)
        protected.PUT("/clients/:id", controllers.UpdateClient)
        protected.DELETE("/clients/:id", controllers.DeleteClient)

        // Appointment routes
        protected.GET("/appointments", controllers.GetAppointments)
        protected.POST("/appointments", controllers.CreateAppointment)
        protected.DELETE("/appointments/:id", controllers.DeleteAppointment)

        // Service routes
        protected.GET("/services", controllers.GetServices)
    }
}
