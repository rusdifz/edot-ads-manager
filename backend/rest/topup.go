package rest

import (
	adsBalance "ads-manager/controller/ads-balance"

	"github.com/gin-gonic/gin"
)

func ServeRestForAdsBalance(router *gin.RouterGroup) {
	router.POST("/topup", adsBalance.CreateTopupAds)
}
