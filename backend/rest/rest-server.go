package rest

import (
	controllers "ads-manager/controller"

	"github.com/gin-gonic/gin"
)

func ServeRestForServer(router *gin.RouterGroup) {
	router.POST("/ads-account", controllers.CreateAdsAccount)
}
