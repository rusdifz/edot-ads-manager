package graph

import (
	"ads-manager/graph/model"
)

//go:generate go get github.com/99designs/gqlgen@v0.17.2
//go:generate go get github.com/99designs/gqlgen/internal/imports@v0.17.2
//go:generate go get github.com/99designs/gqlgen/codegen/config@v0.17.2
//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.
var channelMessageUpdate map[string]chan *model.ResponseSubcribe
var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

type Resolver struct {
	MyAdsAccounts        []*model.AdsAccount
	MyAccountInvitations []*model.MyAccountInvitation
	MyAccountRequests    []*model.MyAccountRequest
	UserList             []*model.User
	PlacementList        []*model.AdsPlacement
	AdsAccountList       []*model.SimpleAdsAccount
	DataAdsCampaign      []*model.DataAdsCampaign
	PaymentMethod        []*model.PaymentMethod
}
