package pipe

import (
	"ads-manager/db/modeldb"
	"ads-manager/graph/model"
	"ads-manager/utils"
	"encoding/json"
	"errors"
	"strconv"
	"time"
)

func DbToGraphAccountMember(dbmodel modeldb.AdsAccountMember, graph *model.AdsAccountMember) error {
	temp := model.AdsAccountMember{
		ID:         strconv.FormatUint(dbmodel.ID, 10),
		Role:       dbmodel.Role,
		IsApprover: dbmodel.IsApprover,
		CreatedAt:  dbmodel.CreatedAt.Format(time.RFC3339),
		UpdatedAt:  dbmodel.UpdatedAt.Format(time.RFC3339),
	}
	*graph = temp
	return nil
}

func DbToGraphNestedAdsAccount(dbmodel modeldb.AdsAccount, graph *model.NestedAdsAccount) error {
	temp := model.NestedAdsAccount{
		ID:             strconv.FormatUint(dbmodel.ID, 10),
		AdsAccountName: dbmodel.AdsAccountName,
		AccountType:    dbmodel.AccountType,
		CreatedAt:      dbmodel.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      dbmodel.UpdatedAt.Format(time.RFC3339),
	}
	*graph = temp
	return nil
}

func DbToGraphSimpleAdsAccount(dbmodel modeldb.AdsAccount, graph *model.SimpleAdsAccount) error {
	temp := model.SimpleAdsAccount{
		ID:             strconv.FormatUint(dbmodel.ID, 10),
		AdsAccountName: dbmodel.AdsAccountName,
		AccountType:    dbmodel.AccountType,
	}
	*graph = temp
	return nil
}

func DbtoGraphAdsdPlacement(ads modeldb.AdsPlacement, graph *model.AdsPlacement) error {
	byteContent, err := json.Marshal(ads.ContentProperties)
	if err != nil {
		return errors.New("error convert byte content properties" + err.Error())
	}
	contentProperties := []*model.ContentProperty{}
	json.Unmarshal(byteContent, &contentProperties)

	byteSpecialFilter, err := json.Marshal(ads.SpecialFilterProperties)
	if err != nil {
		return errors.New("error convert byte special properties" + err.Error())
	}
	specialProperties := []*model.SpecialProperty{}
	json.Unmarshal(byteSpecialFilter, &specialProperties)

	temp := model.AdsPlacement{
		ID:                      strconv.FormatUint(uint64(ads.ID), 10),
		AdsPlacementName:        ads.AdsPlacementName,
		BaseDurationCost:        ads.BaseDurationCost,
		BaseViewCost:            ads.BaseViewCost,
		ViewCostIncrement:       ads.ViewCostIncrement,
		BaseClickCost:           ads.BaseClickCost,
		ClickCostIncrement:      ads.ClickCostIncrement,
		BaseConversionCost:      ads.BaseConversionCost,
		ConversionCostIncrement: ads.ConversionCostIncrement,
		DiscountPercentage:      float64(ads.DiscountPercentage),
		IsDiscountAll:           ads.IsDiscountAll,
		Description:             ads.Description,
		IsActive:                ads.IsActive,
		ContentProperties:       contentProperties,
		HTMLView:                ads.HtmlView,
		SpecialFilterProperties: specialProperties,
		IsRestricted:            ads.IsRestricted,
		RestrictedType:          ads.RestrictedType,
		IsClicked:               ads.IsClicked,
		IsConversion:            ads.IsConversion,
	}
	*graph = temp
	return nil
}

func DbToGraphCampaign(campaign modeldb.Campaign, campaignHistory []*modeldb.CampaignHistory, graph *model.Campaign) error {

	histories := []*model.CampaignHistories{}
	temp := model.Campaign{
		ID:                strconv.FormatUint(campaign.ID, 10),
		AdsAccountID:      int(campaign.AdsAccountID),
		AudienceID:        utils.SafeUint64ToIntPointer(campaign.AudienceID),
		AdsContentID:      utils.SafeUint64ToIntPointer(campaign.AdsContentID),
		CampaignName:      campaign.CampaignName,
		CampaignObjective: &campaign.CampaignObjective,
		Description:       &campaign.Description,
		EndDate:           utils.SafeTimeToStringPointer(campaign.EndDate),
		BudgetLimit:       &campaign.BudgetLimit,
		CampaignStatus:    campaign.CampaignStatus,
		CreatedAt:         campaign.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         campaign.UpdatedAt.Format(time.RFC3339),
	}

	for _, data := range campaignHistory {
		x := model.CampaignHistories{
			ID:             strconv.FormatUint(data.ID, 10),
			Reason:         data.Reason,
			RecordedStatus: data.RecordedStatus,
			UserIDActor:    int(data.UserIdActor),
			UserType:       data.UserActorType,
			CreatedAt:      data.CreatedAt.Format(time.RFC3339),
			UpdatedAt:      data.CreatedAt.Format(time.RFC3339),
		}
		histories = append(histories, &x)
	}

	temp.CampaignHistories = histories
	*graph = temp
	return nil
}

func DbToGraphCampaignHistory(campaignHistory modeldb.CampaignHistory, graph *model.CampaignHistories) error {
	*graph = model.CampaignHistories{
		ID:             strconv.FormatUint(campaignHistory.ID, 10),
		Reason:         campaignHistory.Reason,
		RecordedStatus: campaignHistory.RecordedStatus,
		UserIDActor:    int(campaignHistory.UserIdActor),
		UserType:       campaignHistory.UserActorType,
		CreatedAt:      campaignHistory.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      campaignHistory.UpdatedAt.Format(time.RFC3339),
	}
	return nil
}

func DbToGraphCampaignSimple(campaign modeldb.Campaign, graph *model.Campaign) error {
	*graph = model.Campaign{
		ID:                strconv.FormatUint(campaign.ID, 10),
		AdsAccountID:      int(campaign.AdsAccountID),
		AudienceID:        utils.SafeUint64ToIntPointer(campaign.AudienceID),
		AdsContentID:      utils.SafeUint64ToIntPointer(campaign.AdsContentID),
		CampaignName:      campaign.CampaignName,
		CampaignObjective: &campaign.CampaignObjective,
		Description:       &campaign.Description,
		EndDate:           utils.SafeTimeToStringPointer(campaign.EndDate),
		BudgetLimit:       &campaign.BudgetLimit,
		CampaignStatus:    campaign.CampaignStatus,
		CreatedAt:         campaign.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         campaign.UpdatedAt.Format(time.RFC3339),
	}
	return nil
}

func DbToGraphAudience(db modeldb.Audience, graph *model.Audience) error {
	*graph = model.Audience{
		ID:           strconv.FormatUint(db.ID, 10),
		AdsAccountID: int(db.AdsAccountID),
		Address:      utils.SafeJsonRawMessageToStringPointer(db.Address),
		AudienceName: db.AudienceName,
		Age:          utils.SafeJsonRawMessageToStringPointer(db.Age),
		CreatedAt:    db.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    db.UpdatedAt.Format(time.RFC3339),
		Gender:       db.Gender,
		Interest:     utils.SafeJsonRawMessageToStringPointer(db.Interest),
		Locations:    db.Location,
	}
	return nil
}

func DbToGraphAdsContent(db modeldb.AdsContent, graph *model.AdsContent) error {
	*graph = model.AdsContent{
		ID:             strconv.FormatUint(db.ID, 10),
		AdsAccountID:   int(db.AdsAccountID),
		AdsContentName: db.AdsContentName,
		CreatedAt:      db.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      db.UpdatedAt.Format(time.RFC3339),
	}
	for _, placement := range db.PlacementContents {
		var adsPlacement model.AdsPlacement
		DbtoGraphAdsdPlacement(placement.AdsPlacement, &adsPlacement)
		temp := model.PlacementContent{
			ID:                strconv.FormatUint(placement.ID, 10),
			Content:           utils.SafeJsonRawMessageToStringPointer(placement.Content),
			SpecialFilter:     utils.SafeJsonRawMessageToStringPointer(placement.SpecialFilter),
			CostDurationBid:   placement.CostDurationBid,
			CostViewBid:       placement.CostViewBid,
			CostClickBid:      placement.CostClickBid,
			CostConversionBid: placement.CostConversionBid,
			AdsPlacementID:    int(placement.AdsPlacementID),
			AdsContentID:      int(placement.AdsContentID),
			AdsPlacement:      &adsPlacement,
			AdsContent:        graph,
			CreatedAt:         placement.CreatedAt.Format(time.RFC3339),
			UpdatedAt:         placement.UpdatedAt.Format(time.RFC3339),
		}
		graph.PlacementContents = append(graph.PlacementContents, &temp)
	}
	return nil
}

func DbToGraphPlacementContent(db modeldb.PlacementContent, graph *model.PlacementContent) error {
	*graph = model.PlacementContent{
		ID:                strconv.FormatUint(db.ID, 10),
		Content:           utils.SafeJsonRawMessageToStringPointer(db.Content),
		SpecialFilter:     utils.SafeJsonRawMessageToStringPointer(db.SpecialFilter),
		CostDurationBid:   db.CostDurationBid,
		CostViewBid:       db.CostViewBid,
		CostClickBid:      db.CostClickBid,
		CostConversionBid: db.CostConversionBid,
		AdsPlacementID:    int(db.AdsPlacementID),
		AdsContentID:      int(db.AdsContentID),
		CreatedAt:         db.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         db.UpdatedAt.Format(time.RFC3339),
	}
	return nil
}

func DbToGraphAdsContentSimple(db modeldb.AdsContent, graph *model.AdsContent) error {
	*graph = model.AdsContent{
		ID:             strconv.FormatUint(db.ID, 10),
		AdsAccountID:   int(db.AdsAccountID),
		AdsContentName: db.AdsContentName,
		CreatedAt:      db.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      db.UpdatedAt.Format(time.RFC3339),
	}
	return nil
}
