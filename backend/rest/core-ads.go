package rest

import (
	coreapi "ads-manager/controller/core-api"
	"ads-manager/middleware"

	"github.com/gin-gonic/gin"
)

func ServeRestCoreAdsSso(router *gin.RouterGroup) {
	router.GET("/placement", coreapi.GetAdsPlacement).Use(middleware.SSOTokenAuth())
}

func ServeRestCoreAdsUserSso(router *gin.RouterGroup) {
	router.GET("/content", coreapi.GetCoreAdsContent).Use(middleware.SSOTokenOrUserTokenAuth())
	router.GET("/track/:event/:campaign_id", coreapi.PushEventAds).Use(middleware.SSOTokenOrUserTokenAuth())
}
