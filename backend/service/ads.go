package service

import (
	"ads-manager/db"
	"ads-manager/db/modeldb"
	"errors"
	"fmt"
)

func GetSsoToken() (string, error) {
	// get cache token from db
	var cacheToken modeldb.CacheToken
	if err := db.DB.First(&cacheToken, 1).Error; err != nil {
		fmt.Println("error read cache token", err.Error())
	}
	var returnToken string
	if cacheToken.ID == 0 {
		// no token provided, fetch sso token instead
		var errFetch error
		returnToken, errFetch = FetchSSOToken()
		fmt.Println(returnToken)
		if errFetch != nil {
			fmt.Println(errFetch.Error())
			return "", errors.New(errFetch.Error())
		}
		// write new sso token to the db
		if err := db.DB.Create(&modeldb.CacheToken{ID: 1, Token: returnToken}).Error; err != nil {
			fmt.Println("error create new record token", err.Error())
			return "", errors.New("error create new record token " + err.Error())
		}
	} else {
		// check if cache token valid
		isValid := CheckSSOToken(cacheToken.Token)
		if isValid {
			returnToken = cacheToken.Token
		} else {
			// cache token not valid, fetch new token
			var errFetch error
			returnToken, errFetch = FetchSSOToken()
			if errFetch != nil {
				fmt.Println(errFetch.Error())
				return "", errors.New(errFetch.Error())
			}
			// replace outdated token
			if err := db.DB.Save(&modeldb.CacheToken{ID: 1, Token: returnToken}).Error; err != nil {
				fmt.Println("error update record token", err.Error())
				return "", errors.New("error update record token " + err.Error())
			}
		}
	}
	if returnToken == "" { // handling error if token is not provided
		return returnToken, errors.New("no return token provided")
	}
	return returnToken, nil // return token
}
