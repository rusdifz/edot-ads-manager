package pipe

import (
	"ads-manager/db/modeldb"
	"ads-manager/dto"
	"ads-manager/graph/model"
	"encoding/json"
	"errors"
	"strconv"
)

func InputCreateDbAccountPlacement(graph model.InputAdsPlacement, dbmodel *modeldb.AdsPlacement) error {
	contentProperties, err := json.Marshal(graph.ContentProperties)
	if err != nil {
		return errors.New("error marshalling content property to json" + err.Error())
	}

	var contentProperties2 dto.JSONB
	json.Unmarshal(contentProperties, &contentProperties2)

	specialProperties, err := json.Marshal(graph.SpecialFilterProperties)
	if err != nil {
		return errors.New("error marshalling special property to json" + err.Error())
	}
	var specialProperties2 dto.JSONB
	json.Unmarshal(specialProperties, &specialProperties2)

	temp := modeldb.AdsPlacement{
		AdsPlacementName:        graph.AdsPlacementName,
		BaseDurationCost:        graph.BaseDurationCost,
		BaseViewCost:            graph.BaseViewCost,
		ViewCostIncrement:       graph.ViewCostIncrement,
		BaseClickCost:           graph.BaseClickCost,
		ClickCostIncrement:      graph.ClickCostIncrement,
		BaseConversionCost:      graph.BaseConversionCost,
		ConversionCostIncrement: graph.ConversionCostIncrement,
		DiscountPercentage:      float32(graph.DiscountPercentage),
		IsDiscountAll:           graph.IsDiscountAll,
		Description:             graph.Description,
		IsActive:                graph.IsActive,
		ContentProperties:       contentProperties2,
		HtmlView:                graph.HTMLView,
		SpecialFilterProperties: specialProperties2,
		IsRestricted:            graph.IsRestricted,
		RestrictedType:          graph.RestrictedType,
		IsClicked:               graph.IsClicked,
		IsConversion:            graph.IsConversion,
	}
	*dbmodel = temp
	return nil
}

func InputUpdateDbAccountPlacement(graph model.InputEditAdsPlacement, dbmodel *modeldb.AdsPlacement) error {
	contentProperties, err := json.Marshal(graph.ContentProperties)
	if err != nil {
		return errors.New("error marshalling content property to json" + err.Error())
	}

	var contentProperties2 dto.JSONB
	json.Unmarshal(contentProperties, &contentProperties2)

	specialProperties, err := json.Marshal(graph.SpecialFilterProperties)
	if err != nil {
		return errors.New("error marshalling special property to json" + err.Error())
	}
	var specialProperties2 dto.JSONB
	json.Unmarshal(specialProperties, &specialProperties2)

	id, err := strconv.ParseUint(graph.ID, 10, 16)
	if err != nil {
		return errors.New("error convert id uint" + err.Error())
	}

	temp := modeldb.AdsPlacement{
		ID:                      uint(id),
		AdsPlacementName:        graph.AdsPlacementName,
		BaseDurationCost:        graph.BaseDurationCost,
		BaseViewCost:            graph.BaseViewCost,
		ViewCostIncrement:       graph.ViewCostIncrement,
		BaseClickCost:           graph.BaseClickCost,
		ClickCostIncrement:      graph.ClickCostIncrement,
		BaseConversionCost:      graph.BaseConversionCost,
		ConversionCostIncrement: graph.ConversionCostIncrement,
		DiscountPercentage:      float32(graph.DiscountPercentage),
		IsDiscountAll:           graph.IsDiscountAll,
		Description:             graph.Description,
		IsActive:                graph.IsActive,
		ContentProperties:       contentProperties2,
		HtmlView:                graph.HTMLView,
		SpecialFilterProperties: specialProperties2,
		IsRestricted:            graph.IsRestricted,
		RestrictedType:          graph.RestrictedType,
		IsClicked:               graph.IsClicked,
		IsConversion:            graph.IsConversion,
	}
	*dbmodel = temp
	return nil
}
