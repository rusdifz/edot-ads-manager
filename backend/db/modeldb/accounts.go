package modeldb

import (
	"time"
)

type AdsAccount struct {
	ID                             uint64
	AdsAccountName                 string
	AccountType                    string `sql:"type:account_type"`
	WalletAdID                     uint64
	UserId                         uint64
	BusinessId                     uint64
	WalletAd                       WalletAd
	CreatedAt                      time.Time
	UpdatedAt                      time.Time
	AdsAccountMembers              []AdsAccountMember
	AdsManagerInvitations          []AdsManagerInvitation
	AdsAccountReceivingDiscounts   []AdsAccountReceivingDiscount
	AdsAccountRestrictedPlacements []AdsAccountRestrictedPlacement
	Campaigns                      []Campaign
	Audiences                      []Audience
	AdsContents                    []AdsContent
}

type AdsAccountMember struct {
	ID           uint64
	Role         string `sql:"type:user_role"`
	AdsAccountID uint64
	IsApprover   bool
	UserId       uint64
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type AdsManagerInvitation struct {
	ID                  uint64
	AdsAccountID        uint64
	Role                string `sql:"type:user_role"`
	AdsInvitationStatus string `sql:"type:invitation_status"`
	UserIdInvited       uint64
	UserIdInviter       uint64
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

type AdsAccountReceivingDiscount struct {
	ID             uint64
	AdsPlacementID uint
	AdsAccountID   uint64
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type AdsAccountRestrictedPlacement struct {
	ID             uint64
	AdsPlacementID uint
	AdsAccountID   uint64
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type CacheToken struct {
	ID    uint
	Token string
}
