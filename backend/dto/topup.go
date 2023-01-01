package dto

import (
	"time"
)

type InputTopup struct {
	Amount        float64 `json:"amount"`
	PaymentMethod int     `json:"payment_method"`
	WalletAdId    uint64  `json:"wallet_ad_id"`
}

type CreatePayment struct {
	PartnerTransactionId string
	PaymentMethodId      int
	UserId               uint64
	Name                 string
	Phone                string
	Price                float64
	Preview              bool
}

type CreatePaymentPreview struct {
	Address              string `json:"address"`
	Card                 card   `json:"card"`
	City                 string `json:"city"`
	Country              string `json:"country"`
	Email                string `json:"email"`
	Name                 string `json:"name"`
	NoAdminFee           bool   `json:"no_admin_fee"`
	PartnerTransactionId string `json:"partner_transaction_id"`
	PaymentMethodId      int    `json:"payment_method_id"`
	Phone                string `json:"phone"`
	Price                int    `json:"price"`
	Preview              bool   `json:"preview"`
	PostalCode           string `json:"postal_code"`
	UserId               int    `json:"user_id"`
}

type card struct {
	Number       int `json:"number"`
	ExpiredMonth int `json:"expired_month"`
	ExpiredYear  int `json:"expired_year"`
}

type WalletTopupTransaction struct {
	ID            uint64
	WalletAdID    uint64
	Amount        float64
	TopupMethodID int
	OrderID       uint64
	IsSuccess     bool
	CreatedAt     string
	UpdatedAt     string
}

type EmptyResp struct {
	WalletTopupID int
	WalletAdsId   int
	Amount        int
	OrderId       int
	IsSuccess     bool
	CreatedAt     string
	UpdatedAt     string
}

type WalletSpentTransaction struct {
	ID                uint64    `json:"id"`
	WalletAdID        uint64    `json:"wallet_ad_id"`
	Amount            float64   `json:"amount"`
	CampaignID        uint64    `json:"campaign_id"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	CampaignName      string    `json:"campaign_name"`
	CampaignObjective string    `json:"campaign_objective"`
}

type HistoryTopupTransaction struct {
	ID            uint64    `json:"id"`
	WalletAdID    uint64    `json:"wallet_ad_id"`
	Amount        float64   `json:"amount"`
	AdminFee      float64   `json:"admin_fee"`
	UserId        uint64    `json:"user_id"`
	TopupMethodId uint64    `json:"topup_method_id"`
	IsSuccess     bool      `json:"is_success"`
	ExpiredAt     time.Time `json:"expired_at"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type AdsBalanceQuery struct {
	Id                uint64    `json:"id"`
	AdsAccountId      uint64    `json:"ads_account_id"`
	Balance           float64   `json:"balance"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	SpentTransactions JSONB     `json:"spent_transactions"`
	TopupTransactions JSONB     `json:"topup_transactions"`
}

type Interaction struct {
	ID               uint64    `json:"id"`
	CampaignID       uint64    `json:"campaign_id"`
	UserIdConsumer   uint64    `json:"user_id_consumer"`
	InteractionType  string    `json:"interaction_type"`
	TotalCompetition uint64    `json:"total_competiton"`
	BillCharged      float64   `json:"bill_charged"`
	PlacementID      uint64    `json:"placement_id"`
	IsCalculated     bool      `json:"is_calculated"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type UnbillableAds struct {
	Id           uint64 `json:"id"`
	WalletAdId   uint64 `json:"wallet_ad_id"`
	Interactions JSONB  `json:"interactions"`
}
