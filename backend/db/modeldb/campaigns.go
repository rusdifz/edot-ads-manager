package modeldb

import (
	"ads-manager/dto"
	"time"

	"gorm.io/datatypes"
)

type AdsContentPropertiesType struct {
	ID        uint
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type AdsPlacement struct {
	ID                             uint
	AdsPlacementName               string
	BaseDurationCost               float64
	BaseViewCost                   float64
	ViewCostIncrement              float64
	BaseClickCost                  float64
	ClickCostIncrement             float64
	BaseConversionCost             float64
	ConversionCostIncrement        float64
	DiscountPercentage             float32
	IsDiscountAll                  bool
	Description                    string
	IsActive                       bool
	ContentProperties              dto.JSONB
	HtmlView                       string
	SpecialFilterProperties        dto.JSONB
	IsRestricted                   bool
	RestrictedType                 *string `sql:"type:account_type"`
	IsClicked                      bool
	IsConversion                   bool
	CreatedAt                      time.Time
	UpdatedAt                      time.Time
	AdsAccountReceivingDiscounts   []AdsAccountReceivingDiscount
	AdsAccountRestrictedPlacements []AdsAccountRestrictedPlacement
	PlacementContents              []PlacementContent
}

type Campaign struct {
	ID                       uint64
	AdsAccountID             uint64
	AudienceID               *uint64
	AdsContentID             *uint64
	CampaignName             string
	CampaignObjective        string `sql:"type:campaign_objective"`
	Description              string
	EndDate                  *time.Time
	BudgetLimit              float64
	CampaignStatus           string `sql:"type:campaign_status"`
	CreatedAt                time.Time
	UpdatedAt                time.Time
	CampaignHistories        []CampaignHistory
	CampaignLiveInteractions []CampaignLiveInteraction
}

type Audience struct {
	ID           uint64
	AdsAccountID uint64
	AudienceName string
	Location     *string
	Gender       *string `sql:"type:gender"`
	Age          *datatypes.JSON
	Interest     *datatypes.JSON
	Address      *datatypes.JSON
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Campaigns    []Campaign
}

type AdsContent struct {
	ID                uint64
	AdsAccountID      uint64
	AdsContentName    string
	CreatedAt         time.Time
	UpdatedAt         time.Time
	Campaigns         []Campaign
	PlacementContents []PlacementContent
}

type PlacementContent struct {
	ID                uint64
	AdsContentID      uint64
	AdsContent        AdsContent
	AdsPlacementID    uint64
	AdsPlacement      AdsPlacement
	Content           *datatypes.JSON
	SpecialFilter     *datatypes.JSON
	CostDurationBid   *float64
	CostViewBid       *float64
	CostClickBid      *float64
	CostConversionBid *float64
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

type CampaignHistory struct {
	ID             uint64
	CampaignID     uint64
	UserIdActor    uint64
	UserActorType  string `sql:"type:user_actor_type"`
	RecordedStatus string `sql:"type:campaign_status"`
	Reason         string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type CampaignLiveInteraction struct {
	ID               uint64
	CampaignID       uint64
	UserIdConsumer   uint64
	InteractionType  string `sql:"type:campaign_interaction_type"`
	TotalCompetition uint64
	BillCharged      float64
	PlacementID      uint64
	IsCalculated     bool
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
