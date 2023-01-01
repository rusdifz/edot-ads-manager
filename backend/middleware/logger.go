package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("request", c.Request.URL, c.Request.UserAgent())
		t := time.Now()
		c.Next()
		latency := time.Since(t)
		log.Println("latency request", latency)
		status := c.Writer.Status()
		log.Println("status", status)
	}
}
