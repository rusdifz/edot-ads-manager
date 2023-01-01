package http

import (
	"ads-manager/db"
	"ads-manager/db/enum"
	"ads-manager/db/modeldb"
	"ads-manager/service"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

/*
function to sync ads account when ads service started, get all personal account and business account from
sso api and compare to ads account data on ads account table, if there are any personal account and business account
that don't have an ads account, the function will create the ads account along with its ads wallet
*/
func SyncAdsAccount() {
	db := db.DB
	fmt.Println("syncing ads account with user acccount data and business account data from sso...")
	resUserAccounts, errFetch1 := service.FetchAllUserAccounts()
	if errFetch1 != nil {
		fmt.Println(errFetch1.Error())
		return
	}
	resBusinessAccounts, errFetch2 := service.FetchAllBusinessAccounts()
	if errFetch2 != nil {
		fmt.Println(errFetch2.Error())
		return
	}
	var adsAccounts = []modeldb.AdsAccount{}
	err := db.Find(&adsAccounts).Error
	if err != nil {
		fmt.Println("error in query ads account data", err.Error())
		return
	}
	var userAccountsToCreate = []service.UserAccountData{}
	for _, userAccount := range resUserAccounts.Data {
		indexFound := -1
		for i, adsAccount := range adsAccounts {
			if adsAccount.AccountType == string(enum.PERSONAL) && adsAccount.UserId == uint64(userAccount.ID) {
				indexFound = i
				break
			}
		}
		if indexFound == -1 {
			userAccountsToCreate = append(userAccountsToCreate, userAccount)
		} else {
			adsAccounts[indexFound] = adsAccounts[len(adsAccounts)-1]
			adsAccounts[len(adsAccounts)-1] = modeldb.AdsAccount{}
			adsAccounts = adsAccounts[:len(adsAccounts)-1]
		}
	}
	var businessAccountsToCreate = []service.BusinessAccountData{}
	for _, businessAccount := range resBusinessAccounts.Data.BusinessesNoAuth {
		indexFound := -1
		for i, adsAccount := range adsAccounts {
			if adsAccount.AccountType == string(enum.BUSINESS) &&
				fmt.Sprint(adsAccount.BusinessId) == businessAccount.ID {
				indexFound = i
				break
			}
		}
		if indexFound == -1 {
			businessAccountsToCreate = append(businessAccountsToCreate, businessAccount)
		} else {
			adsAccounts[indexFound] = adsAccounts[len(adsAccounts)-1]
			adsAccounts[len(adsAccounts)-1] = modeldb.AdsAccount{}
			adsAccounts = adsAccounts[:len(adsAccounts)-1]
		}
	}

	var (
		adsAccountInsert []modeldb.AdsAccount
		adsAccountData   modeldb.AdsAccount
		walletAdsData    modeldb.WalletAd
		walletAdsInsert  []modeldb.WalletAd
		adsMemberInsert  []modeldb.AdsAccountMember
		adsMemberData    modeldb.AdsAccountMember
	)

	if len(userAccountsToCreate)+len(businessAccountsToCreate) < 1 {
		fmt.Println("data already updated")
		return
	}

	for _, userAccountData := range userAccountsToCreate {
		adsAccountData.UserId = uint64(userAccountData.ID)
		adsAccountData.AdsAccountName = "Ads " + userAccountData.Username
		adsAccountData.AccountType = string(enum.PERSONAL)
		walletAdsData.Balance = 0
		adsMemberData.IsApprover = false
		adsMemberData.Role = string(enum.OWNER)
		adsAccountInsert = append(adsAccountInsert, adsAccountData)
		walletAdsInsert = append(walletAdsInsert, walletAdsData)
		adsMemberInsert = append(adsMemberInsert, adsMemberData)
	}

	for _, businessAccountData := range businessAccountsToCreate {
		adsAccountData.UserId = uint64(businessAccountData.Owner)
		adsAccountData.AdsAccountName = "Ads " + businessAccountData.Name
		adsAccountData.AccountType = string(enum.BUSINESS)
		adsAccountData.BusinessId, err = strconv.ParseUint(businessAccountData.ID, 10, 64)
		if err != nil {
			fmt.Println("error parse id business account to uint64", err)
			return
		}
		walletAdsData.Balance = 0
		adsMemberData.IsApprover = false
		adsMemberData.Role = string(enum.OWNER)
		adsAccountInsert = append(adsAccountInsert, adsAccountData)
		walletAdsInsert = append(walletAdsInsert, walletAdsData)
		adsMemberInsert = append(adsMemberInsert, adsMemberData)
	}

	db.Transaction(func(tx *gorm.DB) error {

		if err := tx.Create(&walletAdsInsert).Error; err != nil {
			return err
		}

		for i, data := range adsAccountInsert {
			adsAccountData = data
			adsAccountData.WalletAdID = walletAdsInsert[i].ID
			adsAccountInsert[i] = adsAccountData
		}

		if err := tx.Create(&adsAccountInsert).Error; err != nil {
			return err
		}

		for i, data := range adsMemberInsert {
			adsMemberData = data
			adsMemberData.AdsAccountID = adsAccountInsert[i].ID
			adsMemberData.UserId = adsAccountInsert[i].UserId
			adsMemberInsert[i] = adsMemberData
		}

		if err := tx.Create(&adsMemberInsert).Error; err != nil {
			return err
		}

		return nil
	})
}
