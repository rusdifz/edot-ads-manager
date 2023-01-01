package pipe

import (
	"ads-manager/dto"
	"ads-manager/graph/model"
	"ads-manager/service"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"time"
)

type SimpleAdsAccount struct {
	ID             uint64 `json:"id"`
	AdsAccountName string `json:"ads_account_name"`
	AccountType    string `json:"account_type"`
}

func DtoToGraphAccountPlacement(dto dto.AdsPlacement, graph *model.AdsPlacement) error {
	byteContent, err := json.Marshal(dto.ContentProperties)
	if err != nil {
		return errors.New("error convert byte content properties" + err.Error())
	}
	contentProperties := []*model.ContentProperty{}
	json.Unmarshal(byteContent, &contentProperties)

	byteSpecialFilter, err := json.Marshal(dto.SpecialFilterProperties)
	if err != nil {
		return errors.New("error convert byte special properties" + err.Error())
	}
	specialProperties := []*model.SpecialProperty{}
	json.Unmarshal(byteSpecialFilter, &specialProperties)

	byteDiscounts, err := json.Marshal(dto.AdsAccountReceivingDiscounts)
	if err != nil {
		return errors.New("error convert byte ads account receiving discounts" + err.Error())
	}
	receivingDiscounts := []*SimpleAdsAccount{}
	json.Unmarshal(byteDiscounts, &receivingDiscounts)

	byteRestricteds, err := json.Marshal(dto.AdsAccountRestrictedPlacements)
	if err != nil {
		return errors.New("error convert byte ads account restricted placements" + err.Error())
	}
	restrictedPlacements := []*SimpleAdsAccount{}
	json.Unmarshal(byteRestricteds, &restrictedPlacements)

	discounts := []*model.SimpleAdsAccount{}
	for _, data := range receivingDiscounts {
		x := model.SimpleAdsAccount{
			ID:             strconv.FormatUint(data.ID, 10),
			AdsAccountName: data.AdsAccountName,
			AccountType:    data.AccountType,
		}
		discounts = append(discounts, &x)
	}
	restricts := []*model.SimpleAdsAccount{}
	for _, data := range restrictedPlacements {
		x := model.SimpleAdsAccount{
			ID:             strconv.FormatUint(data.ID, 10),
			AdsAccountName: data.AdsAccountName,
			AccountType:    data.AccountType,
		}
		restricts = append(restricts, &x)
	}

	temp := model.AdsPlacement{
		ID:                             strconv.FormatUint(uint64(dto.ID), 10),
		AdsPlacementName:               dto.AdsPlacementName,
		BaseDurationCost:               dto.BaseDurationCost,
		BaseViewCost:                   dto.BaseViewCost,
		ViewCostIncrement:              dto.ViewCostIncrement,
		BaseClickCost:                  dto.BaseClickCost,
		ClickCostIncrement:             dto.ClickCostIncrement,
		BaseConversionCost:             dto.BaseConversionCost,
		ConversionCostIncrement:        dto.ConversionCostIncrement,
		DiscountPercentage:             dto.DiscountPercentage,
		IsDiscountAll:                  dto.IsDiscountAll,
		Description:                    dto.Description,
		IsActive:                       dto.IsActive,
		ContentProperties:              contentProperties,
		HTMLView:                       dto.HTMLView,
		SpecialFilterProperties:        specialProperties,
		IsRestricted:                   dto.IsRestricted,
		RestrictedType:                 &dto.RestrictedType,
		IsClicked:                      dto.IsClicked,
		IsConversion:                   dto.IsConversion,
		CreatedAt:                      dto.CreatedAt.Format(time.RFC3339),
		UpdatedAt:                      dto.UpdatedAt.Format(time.RFC3339),
		AdsAccountReceivingDiscounts:   discounts,
		AdsAccountRestrictedPlacements: restricts,
	}
	*graph = temp
	return nil
}

func DtoToGraphHistoryTopup(dto dto.WalletTopupTransaction, graph *model.HistoryTopup) error {

	temp := model.HistoryTopup{
		ID:            strconv.FormatUint(uint64(dto.ID), 10),
		WalletAdID:    strconv.FormatUint(uint64(dto.WalletAdID), 10),
		Amount:        dto.Amount,
		TopupMethodID: dto.TopupMethodID,
		CreatedAt:     dto.CreatedAt,
		UpdatedAt:     dto.UpdatedAt,
		IsSuccess:     dto.IsSuccess,
	}
	*graph = temp
	return nil
}

func DtoToGraphAdsContent(dto dto.AdsContentReview, graph *model.AdsContent) error {

	temp := model.AdsContent{
		ID:             strconv.FormatUint(uint64(dto.AdsContentID), 10),
		AdsAccountID:   dto.AdsAccountID,
		AdsContentName: dto.AdsContentName,
	}
	*graph = temp
	return nil
}

func DtoToGraphAdsBalance(dtoData dto.AdsBalanceQuery, payments []service.PaymentMethod, graph *model.DataAdsBalance) error {

	var spendings []*model.HistorySpending
	var topups []*model.HistoryTopup

	var topupRows []dto.HistoryTopupTransaction
	var spentRows []dto.WalletSpentTransaction

	fmt.Println(dtoData.TopupTransactions)
	bytes, err := json.Marshal(dtoData.TopupTransactions)
	if err != nil {
		return errors.New("error convert byte content topups" + err.Error())
	}
	json.Unmarshal(bytes, &topupRows)

	paymentIdToName := make(map[uint64]string)
	for _, payment := range payments {
		paymentIdToName[uint64(payment.ID)] = payment.Name
	}

	for _, data := range topupRows {
		topups = append(topups, &model.HistoryTopup{
			ID:              strconv.FormatUint(data.ID, 10),
			WalletAdID:      strconv.FormatUint(data.WalletAdID, 10),
			Amount:          data.Amount,
			UserID:          strconv.FormatUint(data.UserId, 10),
			AdminFee:        float64(data.UserId),
			TopupMethodID:   int(data.TopupMethodId),
			TopupMethodName: paymentIdToName[data.TopupMethodId],
			ExpiredAt:       data.ExpiredAt.Format(time.RFC3339),
			CreatedAt:       data.CreatedAt.Format(time.RFC3339),
			UpdatedAt:       data.UpdatedAt.Format(time.RFC3339),
			IsSuccess:       data.IsSuccess,
		})
	}

	byteContentSpends, err := json.Marshal(dtoData.SpentTransactions)
	if err != nil {
		return errors.New("error convert byte content spends" + err.Error())
	}
	json.Unmarshal(byteContentSpends, &spentRows)

	for _, data := range spentRows {
		spendings = append(spendings, &model.HistorySpending{
			ID:                strconv.FormatUint(data.ID, 10),
			WalletAdID:        strconv.FormatUint(data.WalletAdID, 10),
			Amount:            data.Amount,
			CreatedAt:         data.CreatedAt.Format(time.RFC3339),
			UpdatedAt:         data.UpdatedAt.Format(time.RFC3339),
			CampaignID:        strconv.FormatUint(data.CampaignID, 10),
			CampaignName:      data.CampaignName,
			CampaignObjective: data.CampaignObjective,
		})
	}

	temp := model.DataAdsBalance{
		ID:              strconv.FormatUint(dtoData.Id, 10),
		AdsAccountID:    strconv.FormatUint(dtoData.AdsAccountId, 10),
		CurrentBalance:  dtoData.Balance,
		HistoryTopup:    topups,
		HistorySpending: spendings,
	}
	*graph = temp
	return nil
}
