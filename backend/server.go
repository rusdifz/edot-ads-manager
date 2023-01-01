package main

import (
	controllers "ads-manager/controller"
	"ads-manager/cronjob"
	"ads-manager/db"
	"ads-manager/http"
	"ads-manager/middleware"
	"ads-manager/rest"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const defaultPort = ":8080"

func main() {

	server := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"https://edot.id", "http://localhost:3016", "http://localhost:3010", "http://localhost:8083", "https://edot.sg512mb.salmangalileo.com"}
	config.AllowHeaders = []string{"Authorization,Content-Type"}

	server.Use(cors.New(config))
	server.Use(middleware.Logger())

	db.Connect()

	// UNCOMMENT THIS THE FIRST TIME SETTING UP THE DB
	// db.InitDBType()

	// db.RunMigrations()

	//syncing ads account data with personal account and business account data from sso api
	// http.SyncAdsAccount()

	defer db.Close()

	port := os.Getenv("GIN_PORT")
	fmt.Println("port", port)
	if port == "" {
		port = defaultPort
	}

	// health check
	server.GET("api/v1/check", controllers.HealthCheck)

	/* graphql ads manager service */
	adsManagerRoute := server.Group("/api/v1/ads-manager")
	adsManagerRoute.GET("/", http.PlaygroundHandler())
	adsManagerRoute.Use(middleware.UserTokenAuth())
	adsManagerRoute.Use(middleware.GinContextToContextMiddleware())
	adsManagerRoute.POST("/query", http.GraphQLHandler())

	/*  service to service authenticated with sso token */
	adsForServerRoute := server.Group("/api/v1/ads-for-server")
	adsForServerRoute.Use(middleware.SSOTokenAuth())
	rest.ServeRestForServer(adsForServerRoute)

	/* core ads api service */
	coreAdsApiSsoRoute := server.Group("/api/v1/core-ads")
	coreAdsApiSsoRoute.Use(middleware.SSOTokenAuth())
	rest.ServeRestCoreAdsSso(coreAdsApiSsoRoute)
	coreAdsApiUserOrSsoRoute := server.Group("/api/v1/core-ads")
	coreAdsApiUserOrSsoRoute.Use(middleware.SSOTokenOrUserTokenAuth())
	rest.ServeRestCoreAdsUserSso(coreAdsApiUserOrSsoRoute)

	/*media service */
	mediaApiRoute := server.Group("/api/v1/media")
	mediaApiRoute.Use(middleware.UserTokenAuth())
	rest.ServeRestForMedia(mediaApiRoute)

	/*ads balance service */
	adsBalanceApiRoute := server.Group("/api/v1/ads-balance")
	adsBalanceApiRoute.Use(middleware.UserTokenAuth())
	rest.ServeRestForAdsBalance(adsBalanceApiRoute)

	/* Run Cron Jobs */
	cronjob.RunCronJobs()

	server.Run(port)
}
