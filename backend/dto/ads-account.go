package dto

import (
	"gorm.io/datatypes"
)

type AdsAccountMember struct {
	ID           uint64 `json:"id"`
	Role         string `json:"role"`
	AdsAccountID uint64 `json:"ads_account_id"`
	IsApprover   bool   `json:"is_approver"`
	UserID       uint64 `json:"user_id"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
}

type AdsAccount struct {
	ID                uint64 `json:"id"`
	AdsAccountName    string `json:"ads_account_name"`
	AccountType       string `json:"account_type"`
	WalletAdID        uint64 `json:"wallet_ad_id"`
	UserId            uint64 `json:"user_id"`
	BusinessId        uint64 `json:"business_id"`
	CreatedAt         string `json:"created_at"`
	UpdatedAt         string `json:"updated_at"`
	ApproverMode      bool   `json:"approver_mode"`
	AdsAccountMembers JSONB  `json:"ads_account_members"`
}

type AdsInvitation struct {
	ID                  uint64         `json:"id"`
	AdsAccount          datatypes.JSON `json:"ads_account"`
	Role                string         `json:"role"`
	AdsInvitationStatus string         `json:"ads_invitation_status"`
	UserIdInviter       uint64         `json:"user_id_inviter"`
	CreatedAt           string         `json:"created_at"`
	UpdatedAt           string         `json:"updated_at"`
}

type AdsRequest struct {
	ID                  uint64         `json:"id"`
	AdsAccount          datatypes.JSON `json:"ads_account"`
	Role                string         `json:"role"`
	AdsInvitationStatus string         `json:"ads_invitation_status"`
	UserIdInvited       uint64         `json:"user_id_invited"`
	CreatedAt           string         `json:"created_at"`
	UpdatedAt           string         `json:"updated_at"`
}

type AdsContentReview struct {
	AdsAccountID        int
	AdsContentID        uint64
	AdsContentName      string
	AdsPlacementID      int
	AdsPlacementName    string
	CampaignPlacementID int
	Content             datatypes.JSON
}
