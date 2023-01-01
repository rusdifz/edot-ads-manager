package modeldb

import "time"

type WalletAd struct {
	ID                      uint64
	Balance                 float64
	CreatedAt               time.Time
	UpdatedAt               time.Time
	WalletTopupTransactions []WalletTopupTransaction
	WalletSpentTransactions []WalletSpentTransaction
}

type WalletTopupTransaction struct {
	ID            uint64
	WalletAdID    uint64
	Amount        float64
	AdminFee      float64
	UserId        uint64
	TopupMethodId uint64
	IsSuccess     bool
	ExpiredAt     time.Time
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type WalletSpentTransaction struct {
	ID         uint64
	WalletAdID uint64
	Amount     float64
	CampaignId uint64
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
