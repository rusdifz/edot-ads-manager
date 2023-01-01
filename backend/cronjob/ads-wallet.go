package cronjob

import (
	"ads-manager/db"
	"ads-manager/db/modeldb"
	"ads-manager/dto"
	"ads-manager/pipe"
	"ads-manager/service"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"

	"github.com/go-co-op/gocron"
	"gorm.io/gorm"
)

func CheckAndUpdateTopup(s *gocron.Scheduler) {
	s.Every(5).Minutes().Do(func() {
		var records []modeldb.WalletTopupTransaction
		if err := db.DB.Where("is_success = ? and expired_at > NOW()", false).Find(&records).Error; err != nil {
			fmt.Println("error cron job check and update topup fetch", err.Error())
		}

		for _, data := range records {
			temp, err := service.GetPaymentDetail(strconv.FormatUint(data.ID, 10))
			if err != nil {
				fmt.Println("error fetch payment detail order id", data.ID, err.Error())
			}
			if temp.Status == 1 {
				errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
					data.IsSuccess = true
					if err := db.DB.Save(&data).Error; err != nil {
						return errors.New("error save topup" + err.Error())
					}

					var wallet modeldb.WalletAd
					if err := db.DB.First(&wallet, data.WalletAdID).Error; err != nil {
						return errors.New("error get wallet" + err.Error())
					}

					wallet.Balance = wallet.Balance + data.Amount

					if err := db.DB.Save(&wallet).Error; err != nil {
						return errors.New("error update wallet" + err.Error())
					}

					return nil
				})
				if errTransaction != nil {
					fmt.Println("error update balance, rollback transaction" + errTransaction.Error())
				}
			}
		}
	})
}

func BillAds(s *gocron.Scheduler) {
	s.Every(3).Hours().Do(func() {
		var unbillableInteractions []dto.UnbillableAds

		if err := db.DB.Raw(`
		select jsonb_agg(cli.*) interactions, aa.wallet_ad_id, c.id  from campaign_live_interactions cli 
		inner join campaigns c on c.id  = cli.campaign_id 
		inner join ads_accounts aa on aa.id = c.ads_account_id
		where cli.is_calculated = false
		group by c.id, aa.wallet_ad_id 
		`).Scan(&unbillableInteractions).Error; err != nil {
			fmt.Println("error fetch unbillable campaign interactions")
		}

		for _, data := range unbillableInteractions {
			byteInteractions, err := json.Marshal(data.Interactions)
			if err != nil {
				fmt.Println("error marshal interactions")
				continue
			}
			var currInteractions []dto.Interaction
			var updatedCurrInteractions []modeldb.CampaignLiveInteraction
			json.Unmarshal(byteInteractions, &currInteractions)
			var totalCharged float64 = 0
			for _, interaction := range currInteractions {
				totalCharged = totalCharged + interaction.BillCharged
				var temp modeldb.CampaignLiveInteraction
				pipe.CampaignInteractionDtoToDb(interaction, &temp)
				temp.IsCalculated = true
				updatedCurrInteractions = append(updatedCurrInteractions, temp)
			}
			errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
				newSpent := modeldb.WalletSpentTransaction{
					WalletAdID: data.WalletAdId,
					Amount:     totalCharged,
					CampaignId: data.Id,
				}
				if err := db.DB.Create(&newSpent).Error; err != nil {
					return errors.New("error create spent" + err.Error())
				}

				if err := db.DB.Save(&updatedCurrInteractions).Error; err != nil {
					return errors.New("error save interactions" + err.Error())
				}

				var updatedWallet modeldb.WalletAd

				if err := db.DB.First(&updatedWallet, data.WalletAdId).Error; err != nil {
					return errors.New("error get wallet" + err.Error())
				}

				updatedWallet.Balance = updatedWallet.Balance - totalCharged

				if err := db.DB.Save(&updatedWallet).Error; err != nil {
					return errors.New("error update wallet")
				}

				return nil
			})
			if errTransaction != nil {
				fmt.Println("error update spent, rollback transaction" + errTransaction.Error())
			}
		}

	})
}
