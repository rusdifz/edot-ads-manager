package middleware

import (
	"ads-manager/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func SSOTokenAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("sso-token")
		if len(token) < 1 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		isValid := service.CheckSSOToken(token)
		if !isValid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func SSOTokenOrUserTokenAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		ssoToken := c.Request.Header.Get("sso-token")
		userId := c.Request.Header.Get("user-id")
		tempUserToken := c.Request.Header.Get("Authorization")
		isSsoAuth := len(ssoToken) > 0 && len(userId) > 0
		isUserAuth := len(tempUserToken) > 0
		var userToken string
		if isUserAuth {
			userToken = tempUserToken[7:]
		}
		if !isSsoAuth && !isUserAuth {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		userData := service.UserProperties{}
		if isUserAuth {
			var errCheck error
			userData, errCheck = service.CheckUserToken(userToken)
			if errCheck != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": errCheck.Error()})
				c.Abort()
				return
			}
		} else if isSsoAuth {
			number, err := strconv.ParseUint(userId, 10, 64)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "user ids should be integer"})
				c.Abort()
				return
			}
			ids := []uint64{number}
			userDatas, errFetch := service.GetMultipleUserProperties(ssoToken, ids)
			if errFetch != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": errFetch.Error()})
				c.Abort()
				return
			}
			if len(userDatas) > 0 {
				userData = userDatas[0]
			}
		}
		if userData.ID < 1 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		c.Set("user", userData)
		c.Next()
	}
}

func UserTokenAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tempUserToken := c.Request.Header.Get("Authorization")
		isUserAuth := len(tempUserToken) > 0
		var userToken string
		if !isUserAuth {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		if isUserAuth {
			userToken = tempUserToken[7:]
		}
		userData, errCheck := service.CheckUserToken(userToken)
		if errCheck != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": errCheck.Error()})
			c.Abort()
			return
		}
		if userData.ID < 1 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		c.Set("user", userData)
		c.Next()
	}
}
