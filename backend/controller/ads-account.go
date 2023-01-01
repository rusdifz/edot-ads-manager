package controllers

import (
	"ads-manager/db"
	"ads-manager/db/enum"
	"ads-manager/db/modeldb"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateAdsAccountInput struct {
	UserID     int    `json:"user_id" binding:"required"`
	Name       string `json:"name" binding:"required"`
	BusinessID int    `json:"business_id"`
}

func CreateAdsAccount(c *gin.Context) {
	var input CreateAdsAccountInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adsAccount := modeldb.AdsAccount{}
	wallet := modeldb.WalletAd{Balance: 0}
	adsMember := modeldb.AdsAccountMember{}
	db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&wallet).Error; err != nil {
			return err
		}

		adsAccount.UserId = uint64(input.UserID)
		adsAccount.AdsAccountName = "Ads " + input.Name
		adsAccount.WalletAdID = wallet.ID
		adsAccount.WalletAd = wallet
		if input.BusinessID == 0 { // populate param for personal account
			adsAccount.AccountType = string(enum.PERSONAL)
		} else { // populate param for business account
			adsAccount.AccountType = string(enum.BUSINESS)
			adsAccount.BusinessId = uint64(input.BusinessID)
		}

		if err := tx.Create(&adsAccount).Error; err != nil {
			return err
		}

		adsMember = modeldb.AdsAccountMember{
			UserId:       adsAccount.UserId,
			Role:         string(enum.OWNER),
			AdsAccountID: adsAccount.ID,
			IsApprover:   false,
		}
		if err := tx.Create(&adsMember).Error; err != nil {
			return err
		}
		return nil
	})

	if wallet.ID > 0 && adsAccount.ID > 0 && adsMember.ID > 0 {
		c.JSON(http.StatusCreated, gin.H{"data": adsAccount})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"error": "failed to create ads account"})
	}
}
