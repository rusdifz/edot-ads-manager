package rest

import (
	cl "ads-manager/controller/core-api"
	controller "ads-manager/controller/media-api"

	"github.com/gin-gonic/gin"
)

func ServeRestForMedia(router *gin.RouterGroup) {
	/* image */
	router.POST("/image/upload", controller.UploadImage)
	router.GET("/image/list", controller.ReadAllObjectImage)
	router.DELETE("/image/delete", controller.DeleteObjectImage)

	/* video */
	router.POST("/video/upload", controller.UploadVideo)
	router.GET("/video/list", controller.ReadAllObjectVideo)
	router.DELETE("/video/delete", controller.DeleteObjectVideo)

	/* content moderation */
	router.GET("/image/content-moderation", cl.GetModerationObjectImage)
	router.GET("/video/content-moderation", cl.GetModerationObjectVideo)
}
