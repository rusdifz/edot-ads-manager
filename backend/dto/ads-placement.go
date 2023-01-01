package dto

import (
	customtype "ads-manager/db/type"
	"time"
)

type AdsPlacementCoreApi struct {
	ID                      uint                                    `json:"id"`
	AdsPlacementName        string                                  `json:"ads_placement_name"`
	Description             string                                  `json:"description"`
	ContentProperties       []customtype.AdsContentProperties       `json:"content_properties"`
	HtmlView                string                                  `json:"html_view"`
	SpecialFilterProperties []customtype.AdsSpecialFilterProperties `json:"special_filter_properties"`
	IsClicked               bool                                    `json:"is_clicked"`
	IsConversion            bool                                    `json:"is_conversion"`
}

type AdsPlacement struct {
	ID                             uint      `json:"id"`
	AdsPlacementName               string    `json:"ads_placement_name"`
	BaseDurationCost               float64   `json:"base_duration_cost"`
	BaseViewCost                   float64   `json:"base_view_cost"`
	ViewCostIncrement              float64   `json:"view_cost_increment"`
	BaseClickCost                  float64   `json:"base_click_cost"`
	ClickCostIncrement             float64   `json:"click_cost_increment"`
	BaseConversionCost             float64   `json:"base_conversion_cost"`
	ConversionCostIncrement        float64   `json:"conversion_cost_increment"`
	DiscountPercentage             float64   `json:"discount_percentage"`
	IsDiscountAll                  bool      `json:"is_discount_all"`
	Description                    string    `json:"description"`
	IsActive                       bool      `json:"is_active"`
	ContentProperties              JSONB     `json:"content_properties"`
	HTMLView                       string    `json:"html_view"`
	SpecialFilterProperties        JSONB     `json:"special_filter_properties"`
	IsRestricted                   bool      `json:"is_restricted"`
	RestrictedType                 string    `json:"restricted_type"`
	IsClicked                      bool      `json:"is_clicked"`
	IsConversion                   bool      `json:"is_conversion"`
	CreatedAt                      time.Time `json:"created_at"`
	UpdatedAt                      time.Time `json:"updated_at"`
	AdsAccountReceivingDiscounts   JSONB     `json:"ads_account_receiving_discounts"`
	AdsAccountRestrictedPlacements JSONB     `json:"ads_account_restricted_placements"`
}
