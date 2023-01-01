package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"ads-manager/db"
	"ads-manager/db/enum"
	"ads-manager/db/modeldb"
	"ads-manager/dto"
	"ads-manager/graph/generated"
	"ads-manager/graph/model"
	"ads-manager/pipe"
	"ads-manager/service"
	"ads-manager/utils"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func (r *adsContentResolver) PlacementContents(ctx context.Context, obj *model.AdsContent) ([]*model.PlacementContent, error) {
	placementContents := []*modeldb.PlacementContent{}
	adsContentId, err := strconv.ParseUint(obj.ID, 10, 0)
	if err != nil {
		return nil, nil
	}
	if dbErr := db.DB.Order("updated_at desc").Find(&placementContents, &modeldb.PlacementContent{AdsContentID: adsContentId}).Error; dbErr != nil {
		return nil, gqlerror.Errorf("error getting placement content", dbErr.Error())
	}
	var results []*model.PlacementContent
	for _, campaignHistory := range placementContents {
		var result model.PlacementContent
		pipe.DbToGraphPlacementContent(*campaignHistory, &result)
		results = append(results, &result)
	}
	return results, nil
}

func (r *adsContentResolver) Campaigns(ctx context.Context, obj *model.AdsContent) ([]*model.Campaign, error) {
	campaigns := []*modeldb.Campaign{}
	adsContentId, err := strconv.ParseUint(obj.ID, 10, 0)
	if err != nil {
		return nil, nil
	}
	if dbErr := db.DB.Order("updated_at desc").Find(&campaigns, &modeldb.Campaign{AdsContentID: &adsContentId}).Error; dbErr != nil {
		return nil, gqlerror.Errorf("error getting campaign", dbErr.Error())
	}
	var results []*model.Campaign
	for _, campaignHistory := range campaigns {
		var result model.Campaign
		pipe.DbToGraphCampaignSimple(*campaignHistory, &result)
		results = append(results, &result)
	}
	return results, nil
}

func (r *audienceResolver) Campaigns(ctx context.Context, obj *model.Audience) ([]*model.Campaign, error) {
	campaigns := []*modeldb.Campaign{}
	audienceId, err := strconv.ParseUint(obj.ID, 10, 0)
	if err != nil {
		return nil, nil
	}
	if dbErr := db.DB.Order("updated_at desc").Find(&campaigns, &modeldb.Campaign{AudienceID: &audienceId}).Error; dbErr != nil {
		return nil, gqlerror.Errorf("error getting campaign", dbErr.Error())
	}
	var results []*model.Campaign
	for _, campaignHistory := range campaigns {
		var result model.Campaign
		pipe.DbToGraphCampaignSimple(*campaignHistory, &result)
		results = append(results, &result)
	}
	return results, nil
}

func (r *campaignResolver) Audience(ctx context.Context, obj *model.Campaign) (*model.Audience, error) {
	if obj.AudienceID == nil {
		return nil, nil
	}
	audience := modeldb.Audience{}
	if err := db.DB.First(&audience, &modeldb.Audience{ID: uint64(*obj.AudienceID)}).Error; err != nil {
		return nil, gqlerror.Errorf("error getting audience for given campaign", err.Error())
	}
	result := model.Audience{}
	pipe.DbToGraphAudience(audience, &result)
	return &result, nil
}

func (r *campaignResolver) AdsContent(ctx context.Context, obj *model.Campaign) (*model.AdsContent, error) {
	if obj.AdsContentID == nil {
		return nil, nil
	}
	adsContent := modeldb.AdsContent{}
	if err := db.DB.First(&adsContent, &modeldb.AdsContent{ID: uint64(*obj.AdsContentID)}).Error; err != nil {
		return nil, gqlerror.Errorf("error getting ads content for given campaign", err.Error())
	}
	result := model.AdsContent{}
	pipe.DbToGraphAdsContent(adsContent, &result)
	return &result, nil
}

func (r *campaignResolver) CampaignHistories(ctx context.Context, obj *model.Campaign) ([]*model.CampaignHistories, error) {
	campaignHistories := []*modeldb.CampaignHistory{}
	campaignId, err := strconv.ParseUint(obj.ID, 10, 0)
	if err != nil {
		return nil, nil
	}
	if dbErr := db.DB.Order("updated_at desc").Find(&campaignHistories, &modeldb.CampaignHistory{CampaignID: campaignId}).Error; dbErr != nil {
		return nil, gqlerror.Errorf("error getting campaign", dbErr.Error())
	}
	var results []*model.CampaignHistories
	for _, campaignHistory := range campaignHistories {
		var result model.CampaignHistories
		pipe.DbToGraphCampaignHistory(*campaignHistory, &result)
		results = append(results, &result)
	}
	return results, nil
}

func (r *campaignHistoriesResolver) User(ctx context.Context, obj *model.CampaignHistories) (*model.User, error) {
	userId := obj.UserIDActor
	token, err := service.GetSsoToken()
	if err != nil {
		return nil, gqlerror.Errorf("error getting token", err.Error())
	}
	userData, err := service.GetMultipleUserProperties(token, []uint64{uint64(userId)})
	if err != nil {
		return nil, gqlerror.Errorf("error getting user data", err.Error())
	}
	if userData == nil {
		return nil, nil
	}
	var result model.User
	pipe.UserServiceToGraph(userData[0], &result)
	if result.ID == "" {
		return nil, nil
	}
	return &result, nil
}

func (r *mutationResolver) UpdateAdsAccountName(ctx context.Context, input model.InputEditAdsAccountName) (*model.NestedAdsAccount, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var result *model.NestedAdsAccount

	members := []modeldb.AdsAccountMember{}
	if err :=
		db.DB.Raw(`
	SELECT * FROM ads_account_members AS aam 
	WHERE ads_account_id = ? AND user_id = ? ;
	`, input.AdsAccountID, userData.ID).Scan(&members).Error; err != nil {
		return nil, gqlerror.Errorf("error query user role in ads account", err.Error())
	}

	if len(members) == 0 {
		return nil, gqlerror.Errorf("unauthorized, you are not the member of the ads account")
	}

	if members[0].Role != string(enum.ADMIN) && members[0].Role != string(enum.OWNER) {
		return nil, gqlerror.Errorf("unauthorized, you are not admin or owner")
	}

	if err := db.DB.Raw(`
	UPDATE ads_accounts SET ads_account_name = ? 
	WHERE id = ? 
	RETURNING id, ads_account_name, account_type, created_at, updated_at
	`, input.AdsAccountName, input.AdsAccountID).Scan(&result).Error; err != nil {
		return nil, gqlerror.Errorf("error query update name in ads account", err.Error())
	}

	return result, nil
}

func (r *mutationResolver) RemoveUserFromAdsAccount(ctx context.Context, input model.RemoveUserFromAdsAccount) (*model.AdsAccountMember, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var memberActor modeldb.AdsAccountMember
	if err := db.DB.Where("user_id = ? AND ads_account_id = ?",
		userData.ID, input.AdsAccountID).First(&memberActor).Error; err != nil {
		return nil, gqlerror.Errorf("error getting member data", err.Error())
	}

	var memberSelected modeldb.AdsAccountMember
	if err := db.DB.Where("user_id = ? AND ads_account_id = ?",
		input.UserID, input.AdsAccountID).First(&memberSelected).Error; err != nil {
		return nil, gqlerror.Errorf("error getting member data", err.Error())
	}

	if memberActor.Role == string(enum.ADVERTISER) || memberActor.Role == string(enum.ANALYST) {
		return nil, gqlerror.Errorf("unauthorized to remove user, only admin and owner is authorized")
	}

	if memberActor.Role == string(enum.OWNER) && memberSelected.Role == string(enum.OWNER) {
		return nil, gqlerror.Errorf("unauthorized to remove user, owner cannot remove owner")
	}

	if memberActor.Role == string(enum.ADMIN) &&
		(memberSelected.Role == string(enum.OWNER) || memberSelected.Role == string(enum.ADMIN)) {
		return nil, gqlerror.Errorf("unauthorized to remove user, admin can only remove advertiser or analyst")
	}

	if err := db.DB.Delete(modeldb.AdsAccountMember{}, memberSelected.ID).Error; err != nil {
		return nil, gqlerror.Errorf("error when deleting member", err.Error())
	}

	result := model.AdsAccountMember{
		ID:         strconv.FormatUint(memberSelected.ID, 10),
		Role:       memberSelected.Role,
		IsApprover: memberSelected.IsApprover,
		CreatedAt:  memberSelected.CreatedAt.Format(time.RFC3339),
		UpdatedAt:  memberSelected.UpdatedAt.Format(time.RFC3339),
	}

	return &result, nil
}

func (r *mutationResolver) SelectApprover(ctx context.Context, input model.InputSelectApprover) (*model.AdsAccount, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var member modeldb.AdsAccountMember
	var memberActor modeldb.AdsAccountMember
	if err := db.DB.First(&member, input.AdsMemberID).Error; err != nil {
		return nil, gqlerror.Errorf("error getting member data", err.Error())
	}
	if err := db.DB.Where("user_id = ? AND ads_account_id = ?", userData.ID,
		member.AdsAccountID).First(&memberActor).Error; err != nil {
		return nil, gqlerror.Errorf("error getting member actor data", err.Error())
	}

	if memberActor.Role != string(enum.OWNER) {
		return nil, gqlerror.Errorf("only owner can set approver")
	}

	if member.Role == string(enum.ANALYST) {
		return nil, gqlerror.Errorf("analyst cannot become approver")
	}

	if err := db.DB.Model(&modeldb.AdsAccountMember{}).Where("ads_account_id = ? ", member.AdsAccountID).Update("is_approver", false).Error; err != nil {
		return nil, gqlerror.Errorf("error updating member data", err.Error())
	}

	set_approve := true
	if *input.IsDisable {
		set_approve = false
	}

	member.IsApprover = set_approve

	if err := db.DB.Save(&member).Error; err != nil {
		return nil, gqlerror.Errorf("error updating member data", err.Error())
	}

	members := []modeldb.AdsAccountMember{}
	adsAccount := modeldb.AdsAccount{}

	if err := db.DB.Where("ads_account_id = ? ", member.AdsAccountID).Find(&members).Error; err != nil {
		return nil, gqlerror.Errorf("error getting members data", err.Error())
	}
	if err := db.DB.First(&adsAccount, member.AdsAccountID).Error; err != nil {
		return nil, gqlerror.Errorf("error getting ads account data", err.Error())
	}

	var uniqueUserIds []uint64
	var businessId uint64
	userIdToUser := make(map[uint64]*model.User)
	businessIdToBusiness := make(map[uint64]*model.Business)
	userIdToExist := make(map[uint64]bool)
	userIdToExist[adsAccount.UserId] = true
	uniqueUserIds = append(uniqueUserIds, adsAccount.UserId)
	if adsAccount.BusinessId != 0 {
		businessId = adsAccount.BusinessId
	}
	for _, data := range members {
		if !userIdToExist[data.UserId] {
			userIdToExist[data.UserId] = true
			uniqueUserIds = append(uniqueUserIds, data.UserId)
		}
	}

	// fetch user and business properties from sso service
	ssoToken, errToken := service.GetSsoToken()
	if errToken != nil {
		return nil, gqlerror.Errorf(errToken.Error())
	}

	users, errFetch1 := service.GetMultipleUserProperties(ssoToken, uniqueUserIds)
	if errFetch1 != nil {
		return nil, gqlerror.Errorf(errFetch1.Error())
	}

	businesses := []service.BusinessAccountData{}

	if businessId != 0 {
		var errFetch2 error
		businesses, errFetch2 = service.GetMultipleBusinessProperties(ssoToken, []uint64{businessId})
		if errFetch2 != nil {
			return nil, gqlerror.Errorf(errFetch2.Error())
		}
	}
	for _, user := range users {
		var userConverted model.User
		pipe.UserServiceToGraph(user, &userConverted)
		userIdToUser[user.ID] = &userConverted
	}
	for _, business := range businesses {
		businessConverted := &model.Business{
			ID:    business.ID,
			Name:  business.Name,
			Owner: business.Owner,
		}
		id, err := strconv.ParseUint(business.ID, 10, 64)
		if err != nil {
			return nil, gqlerror.Errorf("error map business id to business", err.Error())
		}
		businessIdToBusiness[id] = businessConverted
	}

	var resMembers []*model.AdsAccountMember

	for _, data := range members {
		isMe := false
		if data.UserId == userData.ID {
			isMe = true
		}
		temp := model.AdsAccountMember{
			ID:         strconv.FormatUint(data.ID, 10),
			Role:       data.Role,
			IsApprover: data.IsApprover,
			IsMe:       &isMe,
			User:       userIdToUser[data.UserId],
			CreatedAt:  data.CreatedAt.Format(time.RFC3339),
			UpdatedAt:  data.UpdatedAt.Format(time.RFC3339),
		}
		resMembers = append(resMembers, &temp)
	}

	result := model.AdsAccount{
		ID:                strconv.FormatUint(adsAccount.ID, 10),
		AdsAccountName:    adsAccount.AdsAccountName,
		AccountType:       adsAccount.AccountType,
		User:              userIdToUser[adsAccount.UserId],
		Business:          businessIdToBusiness[adsAccount.BusinessId],
		ApproverMode:      set_approve,
		WalletAdID:        strconv.FormatUint(adsAccount.WalletAdID, 10),
		CreatedAt:         adsAccount.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         adsAccount.UpdatedAt.Format(time.RFC3339),
		AdsAccountMembers: resMembers,
	}

	return &result, nil
}

func (r *mutationResolver) LeaveAdsAccount(ctx context.Context, input model.InputLeaveAdsAccount) (*model.AdsAccountMember, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	member := modeldb.AdsAccountMember{}
	if err := db.DB.Where("ads_account_id = ? AND user_id = ? ",
		input.AdsAccountID, userData.ID).First(&member).Error; err != nil {
		return nil, gqlerror.Errorf("error fetch data member", err.Error())
	}
	if member.Role == string(enum.OWNER) {
		return nil, gqlerror.Errorf("owner cannot leave ads account")
	}

	if err := db.DB.Delete(&modeldb.AdsAccountMember{}, member.ID).Error; err != nil {
		return nil, gqlerror.Errorf("failed deleting member row", err.Error())
	}

	result := model.AdsAccountMember{
		ID:         strconv.FormatUint(member.ID, 10),
		Role:       member.Role,
		IsApprover: member.IsApprover,
		CreatedAt:  member.CreatedAt.Format(time.RFC3339),
		UpdatedAt:  member.UpdatedAt.Format(time.RFC3339),
	}

	return &result, nil
}

func (r *mutationResolver) EditUserRole(ctx context.Context, input model.InputEditUserRole) (*model.AdsAccountMember, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var memberActor modeldb.AdsAccountMember
	if err := db.DB.Where("ads_account_id = ? AND user_id = ?",
		input.AdsAccountID, userData.ID).Find(&memberActor).Error; err != nil {
		return nil, gqlerror.Errorf("error getting member data", err.Error())
	}
	var memberSelected modeldb.AdsAccountMember
	if err := db.DB.Where("ads_account_id = ? AND user_id = ?",
		input.AdsAccountID, input.UserID).Find(&memberSelected).Error; err != nil {
		return nil, gqlerror.Errorf("error getting member data", err.Error())
	}

	if memberActor.Role == string(enum.ADVERTISER) || memberActor.Role == string(enum.ANALYST) {
		return nil, gqlerror.Errorf("unauthorized to update role, only owner and admin are authorized")
	}

	if memberActor.Role == string(enum.OWNER) &&
		(memberSelected.Role == string(enum.OWNER) || input.UserRole == string(enum.OWNER)) {
		return nil, gqlerror.Errorf("unauthorized to update role")
	}

	if memberActor.Role == string(enum.ADMIN) &&
		(memberSelected.Role == string(enum.OWNER) || input.UserRole == string(enum.OWNER) ||
			memberSelected.Role == string(enum.ADMIN) || input.UserRole == string(enum.ADMIN)) {
		return nil, gqlerror.Errorf("unauthorized to update role")
	}

	memberSelected.Role = input.UserRole
	if err := db.DB.Save(&memberSelected).Error; err != nil {
		return nil, gqlerror.Errorf("error on updating role", err.Error())
	}

	result := model.AdsAccountMember{}
	pipe.DbToGraphAccountMember(memberSelected, &result)

	return &result, nil
}

func (r *mutationResolver) InviteMember(ctx context.Context, input model.InputInviteMember) (*model.MyAccountRequest, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	members := []modeldb.AdsAccountMember{}
	if err :=
		db.DB.Raw(`
	SELECT * FROM ads_account_members AS aam 
	WHERE ads_account_id = ? AND user_id = ? ;
	`, input.AdsAccountID, userData.ID).Scan(&members).Error; err != nil {
		return nil, gqlerror.Errorf("error query user role in ads account", err.Error())
	}

	if len(members) == 0 {
		return nil, gqlerror.Errorf("unauthorized, you are not the member of the ads account")
	}

	if members[0].Role != string(enum.ADMIN) && members[0].Role != string(enum.OWNER) {
		return nil, gqlerror.Errorf("unauthorized, you are not admin or owner of the ads account")
	}

	if members[0].Role == string(enum.OWNER) &&
		(input.Role != string(enum.ADMIN) && input.Role != string(enum.ADVERTISER) &&
			input.Role != string(enum.ANALYST)) {
		return nil, gqlerror.Errorf("unauthorized, owner can only invite user as admin, advertiser, and analyst")
	}

	if members[0].Role == string(enum.ADMIN) &&
		(input.Role != string(enum.ADVERTISER) &&
			input.Role != string(enum.ANALYST)) {
		return nil, gqlerror.Errorf("unauthorized, admin can only invite user as advertiser, and analyst")
	}

	// check if user is already a member
	isMembers := []modeldb.AdsAccountMember{}
	if err := db.DB.Where("ads_account_id = ? AND user_id = ?",
		input.AdsAccountID, input.UserIDInvited).Find(&isMembers).Error; err != nil {
		return nil, gqlerror.Errorf("error when query members", err.Error())
	}
	if len(isMembers) > 0 {
		return nil, gqlerror.Errorf("user is already registered on the ads account")
	}

	var isInvited []modeldb.AdsManagerInvitation
	if err := db.DB.Where("ads_account_id = ? AND user_id_invited = ? AND ads_invitation_status = ? ",
		input.AdsAccountID, input.UserIDInvited, enum.PENDING).Find(&isInvited).Error; err != nil {
		return nil, gqlerror.Errorf("error when query invited", err.Error())
	}
	if len(isInvited) > 0 {
		return nil, gqlerror.Errorf("user is already invited")
	}

	inserted := modeldb.AdsManagerInvitation{
		AdsAccountID:        uint64(input.AdsAccountID),
		Role:                input.Role,
		AdsInvitationStatus: string(enum.PENDING),
		UserIdInvited:       uint64(input.UserIDInvited),
		UserIdInviter:       userData.ID,
	}

	if err := db.DB.Create(&inserted).Error; err != nil {
		return nil, gqlerror.Errorf("error insert row invitation", err.Error())
	}

	uniqueUserIds := []uint64{inserted.UserIdInvited}

	adsAccountQuery := modeldb.AdsAccount{}
	if err := db.DB.First(&adsAccountQuery, inserted.AdsAccountID).Error; err != nil {
		return nil, gqlerror.Errorf("error get Ads Account invitation", err.Error())
	}

	// fetch user and business properties from sso service
	ssoToken, errToken := service.GetSsoToken()
	if errToken != nil {
		return nil, gqlerror.Errorf(errToken.Error())
	}

	users, errFetch := service.GetMultipleUserProperties(ssoToken, uniqueUserIds)
	if errFetch != nil {
		return nil, gqlerror.Errorf(errToken.Error())
	}

	userIdToUser := make(map[uint64]*model.User)

	for _, user := range users {
		var userConverted model.User
		pipe.UserServiceToGraph(user, &userConverted)
		userIdToUser[user.ID] = &userConverted
	}

	result := model.MyAccountRequest{
		ID: strconv.FormatUint(inserted.ID, 10),
		AdsAccount: &model.NestedAdsAccount{
			ID:             strconv.FormatUint(adsAccountQuery.ID, 10),
			AdsAccountName: adsAccountQuery.AdsAccountName,
			AccountType:    adsAccountQuery.AccountType,
			CreatedAt:      adsAccountQuery.CreatedAt.Format(time.RFC3339),
			UpdatedAt:      adsAccountQuery.UpdatedAt.Format(time.RFC3339),
		},
		Role:                inserted.Role,
		AdsInvitationStatus: inserted.AdsInvitationStatus,
		UserInvited:         userIdToUser[inserted.UserIdInvited],
		CreatedAt:           inserted.CreatedAt.Format(time.RFC3339),
		UpdatedAt:           inserted.UpdatedAt.Format(time.RFC3339),
	}

	return &result, nil
}

func (r *mutationResolver) RespondInvitation(ctx context.Context, input model.InputRespondInvitation) (*model.ResponseRespondInvitation, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	adsInvitationQuery := modeldb.AdsManagerInvitation{}
	if err := db.DB.First(&adsInvitationQuery, input.AdsInvitationID).Error; err != nil {
		return nil, gqlerror.Errorf("error query invitation data", err.Error())
	}
	if adsInvitationQuery.ID == 0 {
		return nil, gqlerror.Errorf("no invitation found")
	}
	if adsInvitationQuery.UserIdInvited != userData.ID {
		return nil, gqlerror.Errorf("you are not the one invited")
	}
	if adsInvitationQuery.AdsInvitationStatus != string(enum.PENDING) {
		return nil, gqlerror.Errorf("the invitation is not waiting for approval anymore")
	}

	if input.IsApprove {
		adsInvitationQuery.AdsInvitationStatus = string(enum.APPROVED)
	} else {
		adsInvitationQuery.AdsInvitationStatus = string(enum.INVITATION_REJECTED)
	}

	adsMemberQuery := modeldb.AdsAccountMember{}

	errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&adsInvitationQuery).Error; err != nil {
			return err
		}

		if adsInvitationQuery.AdsInvitationStatus == string(enum.APPROVED) {
			adsMemberQuery = modeldb.AdsAccountMember{
				Role:         adsInvitationQuery.Role,
				AdsAccountID: adsInvitationQuery.AdsAccountID,
				IsApprover:   false,
				UserId:       userData.ID,
			}
			if err := tx.Create(&adsMemberQuery).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if errTransaction != nil {
		return nil, gqlerror.Errorf("updating invitation failed, rollback operation", errTransaction.Error())
	}

	adsAccountData := modeldb.AdsAccount{}
	adsMembersData := []modeldb.AdsAccountMember{}
	// get all unique user id and business id
	userIdToExist := make(map[uint64]bool)
	businessIdToExist := make(map[uint64]bool)
	// create a hashmap table that stores all user properties and business properties
	userIdToUser := make(map[uint64]*model.User)
	businessIdToBusiness := make(map[uint64]*model.Business)
	if err := db.DB.First(&adsAccountData, adsInvitationQuery.AdsAccountID).Error; err != nil {
		fmt.Println("failed getting ads account data")
	}
	result := &model.ResponseRespondInvitation{
		UpdatedInvitation: &model.AdsAccountInvitation{
			ID:                  strconv.FormatUint(adsInvitationQuery.ID, 10),
			AdsAccountID:        int(adsInvitationQuery.AdsAccountID),
			Role:                adsInvitationQuery.Role,
			AdsInvitationStatus: adsInvitationQuery.AdsInvitationStatus,
			UserInviterID:       int(adsInvitationQuery.UserIdInviter),
			CreatedAt:           adsInvitationQuery.CreatedAt.Format(time.RFC3339),
			UpdatedAt:           adsInvitationQuery.UpdatedAt.Format(time.RFC3339),
		},
	}
	if adsInvitationQuery.AdsInvitationStatus == string(enum.APPROVED) {
		if err := db.DB.Where("ads_account_id = ?", adsMemberQuery.AdsAccountID).Find(&adsMembersData).Error; err != nil {
			fmt.Println("failed getting members data")
		}
		var uniqueUserIds []uint64
		var uniqueBusinessIds []uint64
		if !businessIdToExist[adsAccountData.BusinessId] && adsAccountData.BusinessId != 0 {
			uniqueBusinessIds = append(uniqueBusinessIds, adsAccountData.BusinessId)
			businessIdToExist[adsAccountData.BusinessId] = true
		}
		if !userIdToExist[adsAccountData.UserId] {
			uniqueUserIds = append(uniqueUserIds, adsAccountData.UserId)
			userIdToExist[adsAccountData.UserId] = true
		}
		for _, adsMember := range adsMembersData {
			if !userIdToExist[adsMember.UserId] {
				uniqueUserIds = append(uniqueUserIds, adsMember.UserId)
				userIdToExist[adsMember.UserId] = true
			}
		}

		// fetch user and business properties from sso service
		ssoToken, errToken := service.GetSsoToken()
		if errToken != nil {
			return nil, gqlerror.Errorf(errToken.Error())
		}

		users, errFetch := service.GetMultipleUserProperties(ssoToken, uniqueUserIds)
		if errFetch != nil {
			return nil, gqlerror.Errorf(errFetch.Error())
		}

		businesses := []service.BusinessAccountData{}

		if len(uniqueBusinessIds) >= 1 {
			var errFetchBusiness error
			businesses, errFetchBusiness = service.GetMultipleBusinessProperties(ssoToken, uniqueBusinessIds)
			if errFetchBusiness != nil {
				return nil, gqlerror.Errorf(errFetchBusiness.Error())
			}
		}
		for _, user := range users {
			var userConverted model.User
			pipe.UserServiceToGraph(user, &userConverted)
			userIdToUser[user.ID] = &userConverted
		}
		for _, business := range businesses {
			businessConverted := &model.Business{
				ID:    business.ID,
				Name:  business.Name,
				Owner: business.Owner,
			}
			id, err := strconv.ParseUint(business.ID, 10, 64)
			if err != nil {
				return nil, gqlerror.Errorf("error map business id to business", err.Error())
			}
			businessIdToBusiness[id] = businessConverted
		}
	} else {
		return result, nil
	}
	approverMode := false
	adsMembersResponse := []*model.AdsAccountMember{}
	for _, member := range adsMembersData {
		isMe := false
		if member.IsApprover {
			approverMode = true
		}
		if userData.ID == member.UserId {
			isMe = true
		}
		adsMembersResponse = append(adsMembersResponse, &model.AdsAccountMember{
			ID:         strconv.FormatUint(member.ID, 10),
			Role:       member.Role,
			IsApprover: member.IsApprover,
			IsMe:       &isMe,
			User:       userIdToUser[member.UserId],
			CreatedAt:  member.CreatedAt.Format(time.RFC3339),
			UpdatedAt:  member.UpdatedAt.Format(time.RFC3339),
		})
	}
	newAdsAccount := model.AdsAccount{
		ID:                strconv.FormatUint(adsAccountData.ID, 10),
		AdsAccountName:    adsAccountData.AdsAccountName,
		AccountType:       adsAccountData.AccountType,
		User:              userIdToUser[adsAccountData.UserId],
		Business:          businessIdToBusiness[adsAccountData.BusinessId],
		ApproverMode:      approverMode,
		CreatedAt:         adsAccountData.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         adsAccountData.UpdatedAt.Format(time.RFC3339),
		AdsAccountMembers: adsMembersResponse,
	}

	result.NewAdsAccount = &newAdsAccount

	return result, nil
}

func (r *mutationResolver) CancelInvitation(ctx context.Context, input model.InputCancelInvitation) (*model.AdsAccountInvitation, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	invitationData := modeldb.AdsManagerInvitation{}
	if err := db.DB.Find(&invitationData, input.AdsInvitationID).Error; err != nil {
		return nil, gqlerror.Errorf("error getting invitation data", err.Error())
	}

	if invitationData.UserIdInviter != userData.ID {
		return nil, gqlerror.Errorf("you are not the inviter")
	}

	if invitationData.AdsInvitationStatus != string(enum.PENDING) {
		return nil, gqlerror.Errorf("the status is not pending anymore")
	}

	invitationData.AdsInvitationStatus = string(enum.CANCELED)

	if err := db.DB.Save(&invitationData).Error; err != nil {
		return nil, gqlerror.Errorf("error updating row data of invitatation", err.Error())
	}

	result := model.AdsAccountInvitation{
		ID:                  strconv.FormatUint(invitationData.ID, 10),
		AdsAccountID:        int(invitationData.AdsAccountID),
		Role:                invitationData.Role,
		AdsInvitationStatus: invitationData.AdsInvitationStatus,
		UserInviterID:       int(invitationData.UserIdInviter),
		UserInvitedID:       int(invitationData.UserIdInvited),
		CreatedAt:           invitationData.CreatedAt.Format(time.RFC3339),
		UpdatedAt:           invitationData.UpdatedAt.Format(time.RFC3339),
	}

	return &result, nil
}

func (r *mutationResolver) CreateAdsPlacement(ctx context.Context, input model.InputAdsPlacement) (*model.AdsPlacement, error) {
	var newAdsPlacement modeldb.AdsPlacement
	err := pipe.InputCreateDbAccountPlacement(input, &newAdsPlacement)
	if err != nil {
		return nil, gqlerror.Errorf("error pipe input graph to db ads placement", err.Error())
	}
	var newDiscounts []*modeldb.AdsAccountReceivingDiscount
	var newRestricted []*modeldb.AdsAccountRestrictedPlacement
	var result model.AdsPlacement
	errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&newAdsPlacement).Error; err != nil {
			return err
		}
		err := pipe.DbtoGraphAdsdPlacement(newAdsPlacement, &result)
		if err != nil {
			return err
		}

		if len(input.AdsAccountReceivingDiscounts) > 0 {
			for _, data := range input.AdsAccountReceivingDiscounts {
				accountId, err := strconv.ParseUint(data.ID, 10, 64)
				if err != nil {
					return err
				}
				newDiscounts = append(newDiscounts, &modeldb.AdsAccountReceivingDiscount{
					AdsPlacementID: newAdsPlacement.ID,
					AdsAccountID:   accountId,
				})
			}
			if err := tx.Create(&newDiscounts).Error; err != nil {
				return err
			}
			var accountDiscounts []modeldb.AdsAccount
			var conditions []uint64
			for _, data := range newDiscounts {
				conditions = append(conditions, data.AdsAccountID)
			}
			if err := db.DB.Where(conditions).Find(&accountDiscounts).Error; err != nil {
				return err
			}
			var graphDiscounts []*model.SimpleAdsAccount
			for _, data := range accountDiscounts {
				graphDiscounts = append(graphDiscounts, &model.SimpleAdsAccount{
					ID:             strconv.FormatUint(data.ID, 10),
					AdsAccountName: data.AdsAccountName,
					AccountType:    data.AccountType,
				})
			}
			result.AdsAccountReceivingDiscounts = graphDiscounts
		}

		if len(input.AdsAccountRestrictedPlacements) > 0 {
			for _, data := range input.AdsAccountRestrictedPlacements {
				accountId, err := strconv.ParseUint(data.ID, 10, 64)
				if err != nil {
					return err
				}
				newRestricted = append(newRestricted, &modeldb.AdsAccountRestrictedPlacement{
					AdsPlacementID: newAdsPlacement.ID,
					AdsAccountID:   accountId,
				})
			}
			if err := tx.Create(&newRestricted).Error; err != nil {
				return err
			}
			var accountRestricts []modeldb.AdsAccount
			var conditions []uint64
			for _, data := range newRestricted {
				conditions = append(conditions, data.AdsAccountID)
			}
			if err := db.DB.Where(conditions).Find(&accountRestricts).Error; err != nil {
				return err
			}
			var graphRestricts []*model.SimpleAdsAccount
			for _, data := range accountRestricts {
				graphRestricts = append(graphRestricts, &model.SimpleAdsAccount{
					ID:             strconv.FormatUint(data.ID, 10),
					AdsAccountName: data.AdsAccountName,
					AccountType:    data.AccountType,
				})
			}
			result.AdsAccountRestrictedPlacements = graphRestricts
		}
		return nil
	})
	if errTransaction != nil {
		return nil, gqlerror.Errorf("create new placement error, rollback operation", errTransaction.Error())
	}

	return &result, nil
}

func (r *mutationResolver) EditAdsPlacement(ctx context.Context, input model.InputEditAdsPlacement) (*model.AdsPlacement, error) {
	var updatePlacement modeldb.AdsPlacement
	err := pipe.InputUpdateDbAccountPlacement(input, &updatePlacement)
	if err != nil {
		return nil, gqlerror.Errorf("error pipe input graph to db ads placement", err.Error())
	}
	var updateDiscounts []*modeldb.AdsAccountReceivingDiscount
	var updateRestricted []*modeldb.AdsAccountRestrictedPlacement
	var result model.AdsPlacement
	errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&updatePlacement).Error; err != nil {
			return err
		}
		err := pipe.DbtoGraphAdsdPlacement(updatePlacement, &result)
		if err != nil {
			return err
		}

		if err := tx.Where("ads_placement_id = ?", input.ID).Delete(&modeldb.AdsAccountReceivingDiscount{}).Error; err != nil {
			return err
		}

		if len(input.AdsAccountReceivingDiscounts) > 0 {
			for _, data := range input.AdsAccountReceivingDiscounts {
				accountId, err := strconv.ParseUint(data.ID, 10, 64)
				if err != nil {
					return err
				}
				updateDiscounts = append(updateDiscounts, &modeldb.AdsAccountReceivingDiscount{
					AdsPlacementID: updatePlacement.ID,
					AdsAccountID:   accountId,
				})
			}
			if err := tx.Create(&updateDiscounts).Error; err != nil {
				return err
			}
			var accountDiscounts []modeldb.AdsAccount
			var conditions []uint64
			for _, data := range updateDiscounts {
				conditions = append(conditions, data.AdsAccountID)
			}
			if err := db.DB.Where(conditions).Find(&accountDiscounts).Error; err != nil {
				return err
			}
			var graphDiscounts []*model.SimpleAdsAccount
			for _, data := range accountDiscounts {
				graphDiscounts = append(graphDiscounts, &model.SimpleAdsAccount{
					ID:             strconv.FormatUint(data.ID, 10),
					AdsAccountName: data.AdsAccountName,
					AccountType:    data.AccountType,
				})
			}
			result.AdsAccountReceivingDiscounts = graphDiscounts
		}

		if err := tx.Where("ads_placement_id = ?", input.ID).Delete(&modeldb.AdsAccountRestrictedPlacement{}).Error; err != nil {
			return err
		}

		if len(input.AdsAccountRestrictedPlacements) > 0 {
			for _, data := range input.AdsAccountRestrictedPlacements {
				accountId, err := strconv.ParseUint(data.ID, 10, 64)
				if err != nil {
					return err
				}
				updateRestricted = append(updateRestricted, &modeldb.AdsAccountRestrictedPlacement{
					AdsPlacementID: updatePlacement.ID,
					AdsAccountID:   accountId,
				})
			}
			if err := tx.Create(&updateRestricted).Error; err != nil {
				return err
			}
			var accountRestricts []modeldb.AdsAccount
			var conditions []uint64
			for _, data := range updateRestricted {
				conditions = append(conditions, data.AdsAccountID)
			}
			if err := db.DB.Where(conditions).Find(&accountRestricts).Error; err != nil {
				return err
			}
			var graphRestricts []*model.SimpleAdsAccount
			for _, data := range accountRestricts {
				graphRestricts = append(graphRestricts, &model.SimpleAdsAccount{
					ID:             strconv.FormatUint(data.ID, 10),
					AdsAccountName: data.AdsAccountName,
					AccountType:    data.AccountType,
				})
			}
			result.AdsAccountRestrictedPlacements = graphRestricts
		}
		return nil
	})
	if errTransaction != nil {
		return nil, gqlerror.Errorf("create new placement error, rollback operation", errTransaction.Error())
	}

	return &result, nil
}

func (r *mutationResolver) ToggleAdsPlacement(ctx context.Context, input model.InputToggleAdsPlacement) (*model.ResponseToggleAdsPacement, error) {
	id, err := strconv.ParseUint(input.ID, 10, 64)
	if err != nil {
		return nil, gqlerror.Errorf("error convert id", err.Error())
	}
	updatedPlacement := modeldb.AdsPlacement{
		ID: uint(id),
	}
	if err := db.DB.Model(&updatedPlacement).Clauses(clause.Returning{}).Update("is_active", input.IsActive).Error; err != nil {
		return nil, gqlerror.Errorf("error update row ads placement", err.Error())
	}
	result := model.ResponseToggleAdsPacement{
		ID:       strconv.FormatUint(uint64(updatedPlacement.ID), 10),
		IsActive: updatedPlacement.IsActive,
	}
	return &result, nil
}

func (r *mutationResolver) EditStatusCampaignReview(ctx context.Context, input model.EventCampaignReview) (*model.ResponseEventCampaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)
	_ = userData

	var campaign modeldb.Campaign
	id, _ := strconv.ParseUint(input.ID, 10, 32)
	ID := uint64(id)
	if err := db.DB.Find(&campaign, modeldb.Campaign{ID: ID}).Error; err != nil {
		return nil, gqlerror.Errorf("error query audience" + err.Error())
	}

	if campaign.CampaignStatus != "admin approval" {
		return nil, gqlerror.Errorf("campaign can't be approved/rejected")
	}
	var campaignUpdate modeldb.Campaign
	if err := db.DB.Raw(`UPDATE campaign SET campaign_status = ? WHERE campaign_id = ?;`, input.Action, ID).Scan(&campaignUpdate).Error; err != nil {
		return nil, gqlerror.Errorf("error query get all campaign review", err.Error())
	}

	var status string

	if input.Action == "approve" {
		status = "live"
	} else {
		status = "rejected"
	}

	var result model.Campaign
	pipe.DbToGraphCampaignSimple(campaign, &result)
	return &model.ResponseEventCampaign{Result: "Successfully " + status + " Campaign", Campaign: &result}, nil
}

func (r *mutationResolver) EditStatusCampaignPublished(ctx context.Context, input model.EventCampaignPublished) (*model.ResponseEventCampaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)
	_ = userData

	var campaign modeldb.Campaign
	id, _ := strconv.ParseUint(input.ID, 10, 32)
	ID := uint64(id)
	if err := db.DB.Find(&campaign, modeldb.Campaign{ID: ID}).Error; err != nil {
		return nil, gqlerror.Errorf("error query audience" + err.Error())
	}

	if campaign.CampaignStatus == "live" {
		if input.Action == "enable" {
			return nil, gqlerror.Errorf("campaign is live")
		}

		if input.Action == "disable" && input.Reason == "" {
			return nil, gqlerror.Errorf("reasong must be exist")
		}
	} else if campaign.CampaignStatus == "admin paused" {
		if input.Action == "disable" {
			return nil, gqlerror.Errorf("campaign already disable")
		}
	} else {
		return nil, gqlerror.Errorf("campaign can't be enable/disable")
	}

	var campaignUpdate modeldb.Campaign
	if err := db.DB.Raw(`UPDATE campaign SET campaign_status = ? WHERE campaign_id = ?;`, input.Action, ID).Scan(&campaignUpdate).Error; err != nil {
		return nil, gqlerror.Errorf("error query get all campaign review", err.Error())
	}

	var status string

	if input.Action == "enable" {
		status = "live"
	} else {
		status = "admin paused"
	}

	var result model.Campaign
	pipe.DbToGraphCampaignSimple(campaign, &result)
	return &model.ResponseEventCampaign{Result: "Successfully " + status + " Campaign", Campaign: &result}, nil
}

func (r *mutationResolver) TopupPayment(ctx context.Context, input *model.InputTopup) (*model.PaymentDetail, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var paymentDetail service.PaymentDetail
	walletUint, err := strconv.ParseUint(input.WalletAdID, 10, 64)

	newRecord := modeldb.WalletTopupTransaction{
		WalletAdID:    walletUint,
		Amount:        input.Amount,
		UserId:        userData.ID,
		TopupMethodId: uint64(input.PaymentMethodID),
		IsSuccess:     false,
	}

	errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := db.DB.Create(&newRecord).Error; err != nil {
			return errors.New("error create new record" + err.Error())
		}
		var bodyPayment service.BodyPayment
		pipe.InputPaymentGraphToService(input, userData, newRecord.ID, input.PhoneNumber, &bodyPayment)
		fmt.Println("bodyPayment", bodyPayment)
		paymentDetail, err = service.CreatePayment(bodyPayment)
		if err != nil {
			return errors.New("error post new payment" + err.Error())
		}
		fmt.Println("paymentDetail", paymentDetail)

		newRecord.AdminFee = float64(paymentDetail.PriceAdmin)
		newRecord.ExpiredAt = paymentDetail.ExpiredAt

		if err := db.DB.Save(&newRecord).Error; err != nil {
			return errors.New("error save record" + err.Error())
		}

		return nil
	})
	if errTransaction != nil {
		return nil, gqlerror.Errorf("create new payment failed, rollback operation", errTransaction.Error())
	}

	var result model.PaymentDetail
	fmt.Println("paymentDetail", paymentDetail)
	pipe.PaymentDetailServiceToGraph(paymentDetail, &result)
	return &result, nil
}

func (r *mutationResolver) CheckPayment(ctx context.Context, topupID string) (*model.PaymentDetail, error) {
	var record modeldb.WalletTopupTransaction
	if err := db.DB.First(&record, topupID).Error; err != nil {
		return nil, gqlerror.Errorf("get payment failed", err.Error())
	}

	detail, err := service.GetPaymentDetail(topupID)
	if err != nil {
		return nil, gqlerror.Errorf("fetch detail payment failed", err.Error())
	}

	if !record.IsSuccess && detail.Status == 1 {
		errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
			record.IsSuccess = true
			if err := db.DB.Save(&record).Error; err != nil {
				return errors.New("error create new record" + err.Error())
			}

			var wallet modeldb.WalletAd
			if err := db.DB.First(&wallet, record.WalletAdID).Error; err != nil {
				return errors.New("error get wallet" + err.Error())
			}

			wallet.Balance = wallet.Balance + record.Amount

			if err := db.DB.Save(&wallet).Error; err != nil {
				return errors.New("error update balance" + err.Error())
			}

			return nil
		})
		if errTransaction != nil {
			return nil, gqlerror.Errorf("create new payment failed, rollback operation", errTransaction.Error())
		}
	}
	var result model.PaymentDetail
	pipe.PaymentDetailServiceToGraph(detail, &result)
	return &result, nil
}

func (r *mutationResolver) CreateCampaign(ctx context.Context, input *model.InputCampaign) (*model.Campaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData, okCastUser := temp.(service.UserProperties)
	if !okCastUser {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}
	var newCampaign modeldb.Campaign
	var newCampaignHistory modeldb.CampaignHistory

	if errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
		newCampaignEndDate := utils.SafeStringToTimePointer(input.EndDate)
		newCampaign = modeldb.Campaign{
			AdsAccountID:      uint64(input.AdsAccountID),
			AudienceID:        utils.SafeIntToUint64Pointer(input.AudienceID),
			AdsContentID:      utils.SafeIntToUint64Pointer(input.AdsContentID),
			CampaignName:      input.CampaignName,
			CampaignObjective: utils.SafeStringDereference(input.CampaignObjective),
			Description:       utils.SafeStringDereference(input.Description),
			EndDate:           newCampaignEndDate,
			BudgetLimit:       utils.SafeFloat64Dereference(input.BudgetLimit),
			CampaignStatus:    string(enum.DRAFT),
		}

		if err := tx.Create(&newCampaign).Error; err != nil {
			return gqlerror.Errorf("error insert row campaign", err.Error())
		}

		newCampaignHistory = modeldb.CampaignHistory{
			CampaignID:     newCampaign.ID,
			UserIdActor:    userData.ID,
			UserActorType:  string(enum.MEMBER),
			RecordedStatus: newCampaign.CampaignStatus,
			Reason:         "",
		}

		if err := tx.Create(&newCampaignHistory).Error; err != nil {
			return gqlerror.Errorf("error insert row campaign", err.Error())
		}

		return nil
	}); errTransaction != nil {
		return nil, errTransaction
	}

	var newCampaignGraph model.Campaign
	pipe.DbToGraphCampaign(newCampaign, []*modeldb.CampaignHistory{&newCampaignHistory}, &newCampaignGraph)
	return &newCampaignGraph, nil
}

func (r *mutationResolver) CreateAudience(ctx context.Context, input *model.InputAudience) (*model.Audience, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	newAudience := modeldb.Audience{
		AdsAccountID: uint64(input.AdsAccountID),
		AudienceName: input.AudienceName,
		Location:     input.Locations,
		Gender:       input.Gender,
		Age:          utils.SafeStringToJsonRawMessagePointer(input.Age),
		Interest:     utils.SafeStringToJsonRawMessagePointer(input.Interest),
		Address:      utils.SafeStringToJsonRawMessagePointer(input.Address),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	if err := db.DB.Create(&newAudience).Error; err != nil {
		return nil, gqlerror.Errorf("error insert row audience", err.Error())
	}
	var result model.Audience
	if err := pipe.DbToGraphAudience(newAudience, &result); err != nil {
		return nil, gqlerror.Errorf("error transform db to graph audience", err.Error())
	}
	return &result, nil
}

func (r *mutationResolver) CreateAdsContent(ctx context.Context, input *model.InputAdsContent) (*model.AdsContent, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	var newAdsContent modeldb.AdsContent
	newAdsContentPlacementContents := []*modeldb.PlacementContent{}

	if errTransaction := db.DB.Transaction(func(tx *gorm.DB) error {
		newAdsContent = modeldb.AdsContent{
			AdsAccountID:   uint64(input.AdsAccountID),
			AdsContentName: input.AdsContentName,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		}
		if err := tx.Create(&newAdsContent).Error; err != nil {
			return gqlerror.Errorf("error insert row ads content", err.Error())
		}
		if input.PlacementContents != nil {
			for _, placement := range input.PlacementContents {
				temp := modeldb.PlacementContent{
					AdsContentID:      uint64(newAdsContent.ID),
					AdsPlacementID:    uint64(placement.AdsPlacementID),
					Content:           utils.SafeStringToJsonRawMessagePointer(placement.Content),
					SpecialFilter:     utils.SafeStringToJsonRawMessagePointer(placement.SpecialFilter),
					CostDurationBid:   placement.CostDurationBid,
					CostViewBid:       placement.CostViewBid,
					CostClickBid:      placement.CostClickBid,
					CostConversionBid: placement.CostConversionBid,
					CreatedAt:         time.Now(),
					UpdatedAt:         time.Now(),
				}
				newAdsContentPlacementContents = append(newAdsContentPlacementContents, &temp)
				newAdsContent.PlacementContents = append(newAdsContent.PlacementContents, temp)
			}
		}
		if err := tx.CreateInBatches(newAdsContentPlacementContents, len(newAdsContentPlacementContents)).Error; err != nil {
			return gqlerror.Errorf("error insert row placement contents", err.Error())
		}
		return nil
	}); errTransaction != nil {
		return nil, errTransaction
	}

	var result model.AdsContent
	if err := pipe.DbToGraphAdsContent(newAdsContent, &result); err != nil {
		return nil, gqlerror.Errorf("error transform db to graph audience", err.Error())
	}
	return &result, nil
}

func (r *mutationResolver) CreatePlacementContent(ctx context.Context, input *model.InputPlacementContentDirect) (*model.PlacementContent, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	placementContent := modeldb.PlacementContent{
		AdsContentID:      uint64(input.AdsContentID),
		AdsPlacementID:    uint64(input.AdsPlacementID),
		Content:           utils.SafeStringToJsonRawMessagePointer(input.Content),
		SpecialFilter:     utils.SafeStringToJsonRawMessagePointer(input.SpecialFilter),
		CostDurationBid:   input.CostDurationBid,
		CostViewBid:       input.CostViewBid,
		CostClickBid:      input.CostClickBid,
		CostConversionBid: input.CostConversionBid,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	if err := db.DB.Create(&placementContent).Error; err != nil {
		return nil, gqlerror.Errorf("error create placement content", err.Error())
	}

	var result model.PlacementContent
	if err := pipe.DbToGraphPlacementContent(placementContent, &result); err != nil {
		return nil, gqlerror.Errorf("error transform db to graph placement content", err.Error())
	}

	return &result, nil
}

func (r *mutationResolver) UpdateCampaign(ctx context.Context, input *model.InputUpdateCampaign) (*model.Campaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	campaign := modeldb.Campaign{}
	campaignId, strConvErr := strconv.ParseUint(input.ID, 10, 0)
	if strConvErr != nil {
		return nil, gqlerror.Errorf("error parsing id", strConvErr.Error())
	}

	if err := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&campaign, &modeldb.Campaign{ID: campaignId}).Error; err != nil {
			return gqlerror.Errorf("failed to get campaign", err.Error())
		}
		campaign.AdsContentID = utils.SafeIntToUint64Pointer(input.AdsContentID)
		campaign.AudienceID = utils.SafeIntToUint64Pointer(input.AudienceID)
		campaign.BudgetLimit = input.BudgetLimit
		campaign.CampaignName = input.CampaignName
		campaign.CampaignObjective = input.CampaignObjective
		campaign.CampaignStatus = input.CampaignStatus
		campaign.Description = input.Description
		campaign.EndDate = utils.SafeStringToTimePointer(input.EndDate)

		if err := tx.Save(&campaign).Error; err != nil {
			return gqlerror.Errorf("failed to update campaign", err.Error())
		}

		newCampaignHistory := modeldb.CampaignHistory{
			CampaignID:     campaign.ID,
			UserIdActor:    userData.ID,
			UserActorType:  string(enum.MEMBER),
			RecordedStatus: campaign.CampaignStatus,
			Reason:         "",
		}

		if err := tx.Create(&newCampaignHistory).Error; err != nil {
			return gqlerror.Errorf("error insert row campaign", err.Error())
		}

		return nil
	}); err != nil {
		return nil, gqlerror.Errorf("failed to execute transaction", err.Error())
	}

	result := model.Campaign{}
	pipe.DbToGraphCampaignSimple(campaign, &result)
	return &result, nil
}

func (r *mutationResolver) UpdateAudience(ctx context.Context, input *model.InputUpdateAudience) (*model.Audience, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	audience := modeldb.Audience{}
	audienceId, strConvErr := strconv.ParseUint(input.ID, 10, 0)
	if strConvErr != nil {
		return nil, gqlerror.Errorf("error parsing id", strConvErr.Error())
	}
	if err := db.DB.First(&audience, &modeldb.Audience{ID: audienceId}).Error; err != nil {
		return nil, gqlerror.Errorf("failed to get audience", err.Error())
	}
	audience.AudienceName = utils.SafeStringDereference(input.AudienceName)
	audience.Address = utils.SafeStringToJsonRawMessagePointer(input.Address)
	audience.Age = utils.SafeStringToJsonRawMessagePointer(input.Age)
	audience.Gender = input.Gender
	audience.Interest = utils.SafeStringToJsonRawMessagePointer(input.Interest)
	audience.Location = input.Locations

	if err := db.DB.Save(&audience).Error; err != nil {
		return nil, gqlerror.Errorf("failed to get audience", err.Error())
	}

	result := model.Audience{}
	pipe.DbToGraphAudience(audience, &result)
	return &result, nil
}

func (r *mutationResolver) UpdateAdsContent(ctx context.Context, input *model.InputUpdateAdsContent) (*model.AdsContent, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	adsContent := modeldb.AdsContent{}
	adsContentId, strConvErr := strconv.ParseUint(input.ID, 10, 0)
	if strConvErr != nil {
		return nil, gqlerror.Errorf("error parsing id", strConvErr.Error())
	}
	if err := db.DB.First(&adsContent, &modeldb.AdsContent{ID: adsContentId}).Error; err != nil {
		return nil, gqlerror.Errorf("failed to get ads content", err.Error())
	}
	adsContent.AdsContentName = utils.SafeStringDereference(input.AdsContentName)

	if err := db.DB.Save(&adsContent).Error; err != nil {
		return nil, gqlerror.Errorf("failed to get ads content", err.Error())
	}

	result := model.AdsContent{}
	pipe.DbToGraphAdsContentSimple(adsContent, &result)
	return &result, nil
}

func (r *mutationResolver) UpdatePlacementContent(ctx context.Context, input *model.InputUpdatePlacementContent) (*model.PlacementContent, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	placementContent := modeldb.PlacementContent{}
	placementContentId, strConvErr := strconv.ParseUint(input.ID, 10, 0)
	if strConvErr != nil {
		return nil, gqlerror.Errorf("error parsing id", strConvErr.Error())
	}
	if err := db.DB.First(&placementContent, &modeldb.PlacementContent{ID: placementContentId}).Error; err != nil {
		return nil, gqlerror.Errorf("failed to get placement content", err.Error())
	}

	placementContent.Content = utils.SafeStringToJsonRawMessagePointer(input.Content)
	placementContent.SpecialFilter = utils.SafeStringToJsonRawMessagePointer(input.SpecialFilter)
	placementContent.CostDurationBid = input.CostDurationBid
	placementContent.CostViewBid = input.CostViewBid
	placementContent.CostClickBid = input.CostClickBid
	placementContent.CostConversionBid = input.CostConversionBid

	if err := db.DB.Save(&placementContent).Error; err != nil {
		return nil, gqlerror.Errorf("failed to get placement content", err.Error())
	}

	result := model.PlacementContent{}
	pipe.DbToGraphPlacementContent(placementContent, &result)
	return &result, nil
}

func (r *mutationResolver) DeleteCampaign(ctx context.Context, campaignID string) (*model.DeletedCampaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	var campaign modeldb.Campaign
	campaignId, _ := strconv.ParseUint(campaignID, 10, 0)

	if err := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&campaign, &modeldb.Campaign{ID: campaignId}).Error; err != nil {
			return gqlerror.Errorf("failed to get campaign", err.Error())
		}

		if campaign.CampaignStatus != string(enum.DRAFT) {
			return gqlerror.Errorf("campaign not a draft, forbidden to delete")
		}

		if err := tx.Where("campaign_id = ?", campaign.ID).Delete(&modeldb.CampaignHistory{}).Error; err != nil {
			return gqlerror.Errorf("failed to delete campaign history", err.Error())
		}

		if err := tx.Delete(&campaign).Error; err != nil {
			return gqlerror.Errorf("failed to delete campaign", err.Error())
		}
		return nil
	}); err != nil {
		return &model.DeletedCampaign{Result: err.Error(), Campaign: nil}, nil
	}

	var result model.Campaign
	pipe.DbToGraphCampaignSimple(campaign, &result)
	return &model.DeletedCampaign{Result: "Successfully Delete Campaign", Campaign: &result}, nil
}

func (r *mutationResolver) DeleteAudience(ctx context.Context, audienceID string) (*model.DeletedAudience, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	var audience modeldb.Audience
	audienceId, _ := strconv.ParseUint(audienceID, 10, 0)
	if err := db.DB.First(&audience, &modeldb.Audience{ID: audienceId}).Error; err != nil {
		return &model.DeletedAudience{Result: "audience not found", Audience: nil}, nil
	}

	var campaignCount int64
	if err := db.DB.Model(&modeldb.Campaign{}).Where("audience_id = ?", audienceId).Count(&campaignCount).Error; err != nil {
		return nil, gqlerror.Errorf("failed to count campaign related to audience", err.Error())
	}

	if campaignCount != 0 {
		return &model.DeletedAudience{Result: "audience used in campaign", Audience: nil}, nil
	}

	if err := db.DB.Delete(&audience).Error; err != nil {
		return nil, gqlerror.Errorf("failed to delete audience", err.Error())
	}

	var result model.Audience
	pipe.DbToGraphAudience(audience, &result)
	return &model.DeletedAudience{Result: "succesfully delete audience", Audience: &result}, nil
}

func (r *mutationResolver) DeleteAdsContent(ctx context.Context, adsContentID string) (*model.DeletedAdsContent, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	var adsContent modeldb.AdsContent
	adsContentId, _ := strconv.ParseUint(adsContentID, 10, 0)
	if err := db.DB.First(&adsContent, &modeldb.AdsContent{ID: adsContentId}).Error; err != nil {
		return &model.DeletedAdsContent{Result: "ads content not found", AdsContent: nil}, nil
	}

	var campaignCount int64
	if err := db.DB.Model(&modeldb.Campaign{}).Where("ads_content_id = ?", adsContentId).Count(&campaignCount).Error; err != nil {
		return nil, gqlerror.Errorf("failed count campain related to ads content", err.Error())
	}

	if campaignCount != 0 {
		return &model.DeletedAdsContent{Result: "ads content used in campaign", AdsContent: nil}, nil
	}

	if err := db.DB.Delete(&adsContent).Error; err != nil {
		return nil, gqlerror.Errorf("failed to delete ads content", err.Error())
	}

	var result model.AdsContent
	pipe.DbToGraphAdsContent(adsContent, &result)
	return &model.DeletedAdsContent{Result: "succesfully delete ads content", AdsContent: &result}, nil
}

func (r *mutationResolver) DeletePlacementContent(ctx context.Context, placementContentID string) (*model.DeletedPlacementContent, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	var placementContent modeldb.PlacementContent
	placementContentId, _ := strconv.ParseUint(placementContentID, 10, 0)
	if err := db.DB.First(&placementContent, &modeldb.PlacementContent{ID: placementContentId}).Error; err != nil {
		return &model.DeletedPlacementContent{Result: "placement content not found", PlacementContent: nil}, nil
	}

	if err := db.DB.Delete(&placementContent).Error; err != nil {
		return nil, gqlerror.Errorf("failed to delete placement content", err.Error())
	}

	var result model.PlacementContent
	pipe.DbToGraphPlacementContent(placementContent, &result)
	return &model.DeletedPlacementContent{Result: "succesfully delete placement content", PlacementContent: &result}, nil
}

func (r *mutationResolver) PublishCampaign(ctx context.Context, campaignID string) (*model.Campaign, error) {
	// TODO update campaign status based on aws rekognition and content moderator
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	_, ok := temp.(service.UserProperties)
	if !ok {
		return nil, gqlerror.Errorf("error casting user properties", err.Error())
	}

	// TODO cek is approver
	var campaign modeldb.Campaign
	campaignId, _ := strconv.ParseUint(campaignID, 10, 0)

	if err := db.DB.First(&campaign, campaignId).Error; err != nil {
		return nil, gqlerror.Errorf("campaign not found", err.Error())
	}

	var isApproverCount int64
	if err := db.DB.Model(&modeldb.AdsAccountMember{}).Where("ads_account_id = ? AND is_approver", campaign.AdsAccountID).Count(&isApproverCount).Error; err != nil {
		return nil, gqlerror.Errorf("failed to count is approver member", err.Error())
	}

	if isApproverCount > 0 {
		campaign.CampaignStatus = string(enum.TEAM_APPROVAL)
	} else {
		// Check content agains aws rekognition
		isNotFlagged := true
		if isNotFlagged {
			campaign.CampaignStatus = string(enum.LIVE)
		} else {
			campaign.CampaignStatus = string(enum.ADMIN_APPROVAL)
		}
	}

	if err := db.DB.Save(&campaign).Error; err != nil {
		return nil, gqlerror.Errorf("Failed to update campaign", err.Error())
	}

	var result model.Campaign
	pipe.DbToGraphCampaignSimple(campaign, &result)
	return &result, nil
}

func (r *paymentDetailResolver) PaymentMethod(ctx context.Context, obj *model.PaymentDetail) (*model.PaymentMethod, error) {
	idPayment := obj.Payment
	payment, err := service.GetPaymentMethodById(strconv.FormatInt(int64(idPayment), 10))
	if err != nil {
		return nil, gqlerror.Errorf("Failed to fetch payment method", err.Error())
	}
	var result model.PaymentMethod
	pipe.PaymentMethodServiceToGraph(payment, &result)
	return &result, nil
}

func (r *placementContentResolver) AdsPlacement(ctx context.Context, obj *model.PlacementContent) (*model.AdsPlacement, error) {
	adsPlacement := modeldb.AdsPlacement{}
	if err := db.DB.First(&adsPlacement, &modeldb.AdsPlacement{ID: uint(obj.AdsPlacementID)}).Error; err != nil {
		return nil, gqlerror.Errorf("error getting ads content for given placement content", err.Error())
	}
	result := model.AdsPlacement{}
	pipe.DbtoGraphAdsdPlacement(adsPlacement, &result)
	return &result, nil
}

func (r *placementContentResolver) AdsContent(ctx context.Context, obj *model.PlacementContent) (*model.AdsContent, error) {
	adsContent := modeldb.AdsContent{}
	if err := db.DB.First(&adsContent, &modeldb.AdsContent{ID: uint64(obj.AdsContentID)}).Error; err != nil {
		return nil, gqlerror.Errorf("error getting ads content for given placement content", err.Error())
	}
	result := model.AdsContent{}
	pipe.DbToGraphAdsContentSimple(adsContent, &result)
	return &result, nil
}

func (r *queryResolver) MyAdsAccount(ctx context.Context) ([]*model.AdsAccount, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	// get all ads account which user is part of the member
	adsAccountQuery := []dto.AdsAccount{}
	if err :=
		db.DB.Raw(`
		SELECT aa.*, BOOL_OR(aam.is_approver) AS approver_mode, JSON_AGG(aam) AS ads_account_members
		FROM ads_accounts AS aa 
		INNER JOIN ads_account_members AS aam ON aam.ads_account_id = aa.id
		WHERE aa.id IN (SELECT ads_account_id FROM ads_account_members WHERE user_id = ?)
		GROUP BY aa.id
		ORDER BY aa.ads_account_name ;
	`, userData.ID).Scan(&adsAccountQuery).Error; err != nil {
		return nil, gqlerror.Errorf("error query db ads account", err.Error())
	}

	// get all unique user id and business id
	userIdToExist := make(map[uint64]bool)
	businessIdToExist := make(map[uint64]bool)
	var uniqueUserIds []uint64
	var uniqueBusinessIds []uint64
	for _, adsAccount := range adsAccountQuery {
		if !businessIdToExist[adsAccount.BusinessId] && adsAccount.BusinessId != 0 {
			uniqueBusinessIds = append(uniqueBusinessIds, adsAccount.BusinessId)
			businessIdToExist[adsAccount.BusinessId] = true
		}
		if !userIdToExist[adsAccount.UserId] {
			uniqueUserIds = append(uniqueUserIds, adsAccount.UserId)
			userIdToExist[adsAccount.UserId] = true
		}
		tempByte, err := json.Marshal(adsAccount.AdsAccountMembers)
		if err != nil {
			return nil, gqlerror.Errorf("error transform jsonb to byte", err.Error())
		}
		members := []dto.AdsAccountMember{}
		json.Unmarshal(tempByte, &members)
		for _, adsMember := range members {
			if !userIdToExist[adsMember.UserID] {
				uniqueUserIds = append(uniqueUserIds, adsMember.UserID)
				userIdToExist[adsMember.UserID] = true
			}
		}
	}

	// fetch user and business properties from sso service
	ssoToken, errToken := service.GetSsoToken()
	if errToken != nil {
		return nil, gqlerror.Errorf(errToken.Error())
	}

	users, errFetch1 := service.GetMultipleUserProperties(ssoToken, uniqueUserIds)
	if errFetch1 != nil {
		return nil, gqlerror.Errorf(errFetch1.Error())
	}

	businesses := []service.BusinessAccountData{}

	if len(uniqueBusinessIds) >= 1 {
		var errFetch2 error
		businesses, errFetch2 = service.GetMultipleBusinessProperties(ssoToken, uniqueBusinessIds)
		if errFetch2 != nil {
			return nil, gqlerror.Errorf(errFetch2.Error())
		}
	}

	// create a hashmap table that stores all user properties and business properties
	userIdToUser := make(map[uint64]*model.User)
	for _, user := range users {
		var userConverted model.User
		pipe.UserServiceToGraph(user, &userConverted)
		userIdToUser[user.ID] = &userConverted
	}
	businessIdToBusiness := make(map[uint64]*model.Business)
	for _, business := range businesses {
		businessConverted := &model.Business{
			ID:    business.ID,
			Name:  business.Name,
			Owner: business.Owner,
		}
		id, err := strconv.ParseUint(business.ID, 10, 64)
		if err != nil {
			return nil, gqlerror.Errorf("error map business id to business", err.Error())
		}
		businessIdToBusiness[id] = businessConverted
	}
	result := []*model.AdsAccount{}
	for _, dataAccount := range adsAccountQuery {
		adsAccountMembers := []*model.AdsAccountMember{}
		tempByte, err := json.Marshal(dataAccount.AdsAccountMembers)
		if err != nil {
			return nil, gqlerror.Errorf("error transform jsonb to byte", err.Error())
		}
		members := []dto.AdsAccountMember{}
		json.Unmarshal(tempByte, &members)
		for _, dataMember := range members {
			isMe := false
			if userData.ID == dataMember.UserID {
				isMe = true
			}
			adsAccountMembers = append(adsAccountMembers, &model.AdsAccountMember{
				ID:         strconv.FormatUint(dataMember.ID, 10),
				Role:       dataMember.Role,
				IsApprover: dataMember.IsApprover,
				IsMe:       &isMe,
				User:       userIdToUser[dataMember.UserID],
				CreatedAt:  dataMember.CreatedAt,
				UpdatedAt:  dataMember.UpdatedAt,
			})
		}
		result = append(result, &model.AdsAccount{
			ID:                strconv.FormatUint(dataAccount.ID, 10),
			AdsAccountName:    dataAccount.AdsAccountName,
			AccountType:       dataAccount.AccountType,
			User:              userIdToUser[dataAccount.UserId],
			Business:          businessIdToBusiness[dataAccount.BusinessId],
			ApproverMode:      dataAccount.ApproverMode,
			WalletAdID:        strconv.FormatUint(dataAccount.WalletAdID, 10),
			CreatedAt:         dataAccount.CreatedAt,
			UpdatedAt:         dataAccount.UpdatedAt,
			AdsAccountMembers: adsAccountMembers,
		})
	}
	r.MyAdsAccounts = result
	return r.MyAdsAccounts, nil
}

func (r *queryResolver) MyAccountInvitation(ctx context.Context) ([]*model.MyAccountInvitation, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var result []*model.MyAccountInvitation

	invitations := []dto.AdsInvitation{}
	if err := db.DB.Raw(`
		SELECT ami.id, ami.role, ami.ads_invitation_status, ami.user_id_inviter,
		JSONB_BUILD_OBJECT('id', aa.id, 'ads_account_name', aa.ads_account_name, 'account_type', aa.account_type, 
		'created_at', aa.created_at, 'updated_at', aa.updated_at) AS ads_account, ami.created_at, ami.updated_at
		FROM ads_manager_invitations AS ami
		INNER JOIN ads_accounts AS aa ON ami.ads_account_id = aa.id
		WHERE ami.ads_invitation_status = ? AND user_id_invited = ?
		ORDER BY ami.created_at DESC ;
	`, enum.PENDING, userData.ID).Scan(&invitations).Error; err != nil {
		return nil, gqlerror.Errorf("error query db invitation", err.Error())
	}

	uniqueIds := []uint64{}
	userIdToExist := make(map[uint64]bool)
	for _, invitation := range invitations {
		if !userIdToExist[invitation.UserIdInviter] {
			uniqueIds = append(uniqueIds, invitation.UserIdInviter)
			userIdToExist[invitation.UserIdInviter] = true
		}
	}

	// fetch user and business properties from sso service
	ssoToken, errToken := service.GetSsoToken()
	if errToken != nil {
		return nil, gqlerror.Errorf(errToken.Error())
	}

	users, errFetch := service.GetMultipleUserProperties(ssoToken, uniqueIds)
	if errFetch != nil {
		return nil, gqlerror.Errorf(errFetch.Error())
	}

	// create a hashmap table that stores all user properties
	userIdToUser := make(map[uint64]*model.User)
	for _, user := range users {
		var userConverted model.User
		pipe.UserServiceToGraph(user, &userConverted)
		userIdToUser[user.ID] = &userConverted
	}

	for _, invitation := range invitations {
		idString := strconv.FormatUint(invitation.ID, 10)
		adsAccountData := model.NestedAdsAccount{}
		json.Unmarshal(invitation.AdsAccount, &adsAccountData)
		result = append(result, &model.MyAccountInvitation{
			ID:                  idString,
			AdsAccount:          &adsAccountData,
			AdsInvitationStatus: invitation.AdsInvitationStatus,
			Role:                invitation.Role,
			UserInviter:         userIdToUser[invitation.UserIdInviter],
			CreatedAt:           invitation.CreatedAt,
			UpdatedAt:           invitation.UpdatedAt,
		},
		)
	}

	r.MyAccountInvitations = result
	return r.MyAccountInvitations, nil
}

func (r *queryResolver) MyAccountRequest(ctx context.Context) ([]*model.MyAccountRequest, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var result []*model.MyAccountRequest
	requests := []dto.AdsRequest{}
	if err := db.DB.Raw(`
		SELECT ami.id, ami.role, ami.ads_invitation_status, ami.user_id_invited,
		JSONB_BUILD_OBJECT('id', aa.id, 'ads_account_name', aa.ads_account_name, 'account_type', aa.account_type, 
		'created_at', aa.created_at, 'updated_at', aa.updated_at) AS ads_account, ami.created_at, ami.updated_at
		FROM ads_manager_invitations AS ami
		INNER JOIN ads_accounts AS aa ON ami.ads_account_id = aa.id
		WHERE user_id_inviter = ?
		ORDER BY CASE WHEN ami.ads_invitation_status = 'pending' THEN 1 ELSE 2 END, ami.created_at DESC ;
	`, userData.ID).Scan(&requests).Error; err != nil {
		return nil, gqlerror.Errorf("error query db invitation", err.Error())
	}

	uniqueIds := []uint64{}
	userIdToExist := make(map[uint64]bool)
	for _, request := range requests {
		if !userIdToExist[request.UserIdInvited] {
			uniqueIds = append(uniqueIds, request.UserIdInvited)
			userIdToExist[request.UserIdInvited] = true
		}
	}

	// fetch user and business properties from sso service
	ssoToken, errToken := service.GetSsoToken()
	if errToken != nil {
		return nil, gqlerror.Errorf(errToken.Error())
	}

	users, errFetch := service.GetMultipleUserProperties(ssoToken, uniqueIds)
	if errFetch != nil {
		return nil, gqlerror.Errorf(errFetch.Error())
	}

	// create a hashmap table that stores all user properties
	userIdToUser := make(map[uint64]*model.User)
	for _, user := range users {
		var userConverted model.User
		pipe.UserServiceToGraph(user, &userConverted)
		userIdToUser[user.ID] = &userConverted
	}

	for _, request := range requests {
		idString := strconv.FormatUint(request.ID, 10)
		adsAccountData := model.NestedAdsAccount{}
		adsAccData := modeldb.AdsAccount{}
		json.Unmarshal(request.AdsAccount, &adsAccountData)
		json.Unmarshal(request.AdsAccount, &adsAccData)
		adsAccountData.ID = strconv.FormatUint(adsAccData.ID, 10)
		result = append(result, &model.MyAccountRequest{
			ID:                  idString,
			AdsAccount:          &adsAccountData,
			AdsInvitationStatus: request.AdsInvitationStatus,
			Role:                request.Role,
			UserInvited:         userIdToUser[request.UserIdInvited],
			CreatedAt:           request.CreatedAt,
			UpdatedAt:           request.UpdatedAt,
		},
		)
	}

	r.MyAccountRequests = result
	return r.MyAccountRequests, nil
}

func (r *queryResolver) ListUser(ctx context.Context) ([]*model.User, error) {
	usersRes, errFetch := service.FetchAllUserAccounts()
	if errFetch != nil {
		return nil, gqlerror.Errorf(errFetch.Error())
	}
	result := []*model.User{}
	for _, user := range usersRes.Data {
		var userConverted model.User
		pipe.UserServiceDataToGraph(user, &userConverted)
		result = append(result, &userConverted)
	}

	r.UserList = result
	return r.UserList, nil
}

func (r *queryResolver) ListAdsPlacement(ctx context.Context) ([]*model.AdsPlacement, error) {
	var adsPlacementsDto []dto.AdsPlacement
	if err := db.DB.Raw(`
	with discounts as (
		select JSON_AGG(aa) as ads_account_receiving_discounts, aard.ads_placement_id from ads_accounts aa 
		inner join ads_account_receiving_discounts aard ON aard.ads_account_id = aa.id
		group by aard.ads_placement_id 
	),
	restricts as (
		select JSON_AGG(aa) as ads_account_restricted_placements, aarp.ads_placement_id  from ads_accounts aa 
		inner join ads_account_restricted_placements aarp ON aarp.ads_account_id = aa.id
		group by aarp.ads_placement_id 
	)
	select ap.*, d.ads_account_receiving_discounts, r.ads_account_restricted_placements
	from ads_placements ap
	left join discounts as d on d.ads_placement_id = ap.id
	left join restricts as r on r.ads_placement_id = ap.id;
	`).Scan(&adsPlacementsDto).Error; err != nil {
		return nil, gqlerror.Errorf("error query ads placement" + err.Error())
	}
	var adsPlacements []*model.AdsPlacement
	for _, data := range adsPlacementsDto {
		var adsPlacement model.AdsPlacement
		err := pipe.DtoToGraphAccountPlacement(data, &adsPlacement)
		if err != nil {
			return nil, gqlerror.Errorf("error convert struct dto to graph ads placement" + err.Error())
		}
		adsPlacements = append(adsPlacements, &adsPlacement)
	}
	r.PlacementList = adsPlacements
	return r.PlacementList, nil
}

func (r *queryResolver) GetAllAdsAccount(ctx context.Context) ([]*model.SimpleAdsAccount, error) {
	var adsAccounts []modeldb.AdsAccount
	if err := db.DB.Find(&adsAccounts).Error; err != nil {
		return nil, gqlerror.Errorf("error query ads account" + err.Error())
	}
	var result []*model.SimpleAdsAccount
	for _, data := range adsAccounts {
		var adsAccount model.SimpleAdsAccount
		err := pipe.DbToGraphSimpleAdsAccount(data, &adsAccount)
		if err != nil {
			return nil, gqlerror.Errorf("error convert struct simple ads account db to graph" + err.Error())
		}
		result = append(result, &adsAccount)
	}
	r.AdsAccountList = result
	return r.AdsAccountList, nil
}

func (r *queryResolver) GetAllAdsContent(ctx context.Context, limit *int, utoken string, accountID string) ([]*model.ResponseAdsContent, error) {
	// type countStatus struct {
	// 	live      int
	// 	published int
	// 	draft     int
	// }

	var (
		// tmpAdsC     []modeldb.AdsContent
		// tmpPlac     []modeldb.AdsPlacement
		// statusCount countStatus
		// reImp       *model.ResponseAdsContent
		result []*model.ResponseAdsContent
	)

	// queryCount := `select (CASE campaign_status WHEN ? THEN COUNT(campaign_status) ELSE 0 END) as published,
	// (CASE campaign_status WHEN ? THEN COUNT(campaign_status) ELSE 0 END) as live,
	// (CASE campaign_status WHEN ? THEN COUNT(campaign_status) ELSE 0 END) as draft from campaign where ads_account_id=? and ads_contents_id=? group by campaign_status`

	// errQ1 := db.DB.Raw("select * from ads_contents where ads_account_id=?", accountID).Limit(*limit).Scan(&tmpAdsC).Error
	// if errQ1 != nil {
	// 	return nil, gqlerror.Errorf("error query find ads_contetns : " + errQ1.Error())
	// }

	// if len(tmpAdsC) == 0 {
	// 	return result, nil
	// }

	// for _, val := range tmpAdsC {
	// 	reImp.ContentName = val.AdsContentName
	// 	reImp.LastUpdated = val.UpdatedAt.Format("2022-01-01 00:00:00")
	// 	reImp.AdsContentProperties.AdsContentName = val.AdsContentName
	// 	reImp.AdsContentProperties.ID = strconv.FormatUint(val.ID, 10)
	// 	reImp.AdsContentProperties.CreatedAt = val.CreatedAt.Format("2022-01-01 00:00:00")
	// 	reImp.AdsContentProperties.UpdatedAt = val.UpdatedAt.Format("2022-01-01 00:00:00")

	// 	errPlc := db.DB.Raw("select a.* from ads_placement a right join placement_content b on a.ads_placement_id=b.ads_placement_id where b.ads_contents_id=?", val.ID).Scan(&tmpPlac).Error
	// 	if errPlc != nil {
	// 		return nil, gqlerror.Errorf("error query get placement list : " + errPlc.Error())
	// 	}

	// 	var mdPlacement model.AdsPlacement
	// 	var tmpMdPlacement []*model.AdsPlacement
	// 	for _, data := range tmpPlac {
	// 		mdPlacement.AdsPlacementName = data.AdsPlacementName
	// 		tmpMdPlacement = append(tmpMdPlacement, &mdPlacement)
	// 	}

	// 	reImp.Placements = tmpMdPlacement

	// 	// count status campaign/content
	// 	errCq := db.DB.Raw(queryCount, "published", "live", "draft", accountID, val.ID).Scan(&statusCount).Error
	// 	if errCq != nil {
	// 		return nil, gqlerror.Errorf("error query count status campaign : " + errCq.Error())
	// 	}

	// 	reImp.Live = statusCount.live
	// 	reImp.Published = statusCount.published
	// 	reImp.Draft = statusCount.draft

	// 	result = append(result, reImp)
	// }

	return result, nil
}

func (r *queryResolver) GetAllAdsAudience(ctx context.Context, limit *int, utoken string, accountID string) ([]*model.ResponseAdsAudience, error) {
	// type countStatus struct {
	// 	live      int
	// 	published int
	// 	draft     int
	// }

	var (
		// 	aud         []modeldb.Audience
		// 	statusCount countStatus
		// 	reImp       model.ResponseAdsAudience
		result []*model.ResponseAdsAudience
	)

	// errQuery1 := db.DB.Raw("select audience_id, audience_name, location, gender, age, interests, cerated_at, updated_at, address from audience where ads_account=?", accountID).Limit(*limit).Scan(&aud).Error
	// if errQuery1 != nil {
	// 	return nil, gqlerror.Errorf("error query find ads_contetns : " + errQuery1.Error())
	// }

	// if len(aud) == 0 {
	// 	return result, nil
	// }

	// for _, val := range aud {
	// 	reImp.AudienceName = val.AudienceName
	// 	reImp.Location = val.Location
	// 	reImp.Gender = val.Gender
	// 	reImp.Age = val.Age.GormDataType()
	// 	reImp.Interest = val.Interest.GormDataType()
	// 	reImp.LatestUpdate = val.UpdatedAt.Format("2022-02-01 00:00:00")
	// 	reImp.AudienceProperties.ID = strconv.FormatUint(val.ID, 10)
	// 	reImp.AudienceProperties.AudienceName = val.AudienceName
	// 	reImp.AudienceProperties.Location = val.Location
	// 	reImp.AudienceProperties.Gender = val.Gender
	// 	reImp.AudienceProperties.Age = val.Age.GormDataType()
	// 	reImp.AudienceProperties.Interests = val.Interest.GormDataType()
	// 	reImp.AudienceProperties.CreatedAt = val.CreatedAt.Format("2022-02-01 00:00:00")
	// 	reImp.AudienceProperties.UpdatedAt = val.UpdatedAt.Format("2022-02-01 00:00:00")
	// 	reImp.AudienceProperties.Address = val.Address.GormDataType()

	// 	queryCount := `select (CASE campaign_status WHEN ? THEN COUNT(campaign_status) ELSE 0 END) as published,
	// 	(CASE campaign_status WHEN ? THEN COUNT(campaign_status) ELSE 0 END) as live,
	// 	(CASE campaign_status WHEN ? THEN COUNT(campaign_status) ELSE 0 END) as draft from campaign where ads_account_id=? group by campaign_status`

	// 	// if errCamp := db.DB.Raw("select * from campaign where ads_account_id=? and audience_id=?", accountID, val.ID).Scan(&tmpCmp).Error; errCamp != nil {
	// 	// 	return nil, gqlerror.Errorf("error query find campaigns : " + errCamp.Error())
	// 	// }

	// 	// var cmp model.Campaign
	// 	// var tmpCmp []model.Campaign

	// 	errQuery2 := db.DB.Raw(queryCount, "published", "live", "draft", accountID).Scan(&statusCount).Error
	// 	if errQuery2 != nil {
	// 		return nil, gqlerror.Errorf("error query count status campaign : " + errQuery2.Error())
	// 	}
	// 	reImp.Draft = statusCount.draft
	// 	reImp.Live = statusCount.live
	// 	reImp.Published = statusCount.published

	// 	result = append(result, &reImp)
	// }
	return result, nil
}

func (r *queryResolver) GetAllAdsCamoaign(ctx context.Context, limit *int, utoken string, accountID string) ([]*model.ResponseAdsCampaign, error) {
	var (
		// cmp    []modeldb.Campaign
		// resImp model.ResponseAdsCampaign
		// tmpA   modeldb.Audience
		// tmpGA  model.Audience
		result []*model.ResponseAdsCampaign
	)

	// if errQ1 := db.DB.Raw("select campaign.*, audience.audience_name, ads_contents.ads_content_name from campaign left join audience on campaign.audience_id=audience.audience_id left join ads_contents on campaign.ads_contents_id=ads_contents_id where campaign.ads_account_id=? order by campaign.updated_at and campaign.campaign_status desc", accountID).Limit(*limit).Scan(&cmp).Error; errQ1 != nil {
	// 	return nil, gqlerror.Errorf("error query find ads_campaign : " + errQ1.Error())
	// }

	// if len(cmp) == 0 {
	// 	return result, nil
	// }

	// for _, val := range cmp {
	// 	resImp.NameCampaign = val.CampaignName
	// 	resImp.StatusCampaign = val.CampaignStatus
	// 	resImp.Objective = val.CampaignObjective
	// 	resImp.Description = val.Description
	// 	resImp.LatestUpdate = val.UpdatedAt.Format("2022-01-01 00:00:00")

	// 	resImp.CampaingProperties.ID = strconv.FormatUint(val.ID, 10)
	// 	resImp.CampaingProperties.CampaignName = val.CampaignName
	// 	resImp.CampaingProperties.CampaignObjective = val.CampaignObjective
	// 	resImp.CampaingProperties.Description = val.Description
	// 	resImp.CampaingProperties.EndDate = val.EndDate.Format("2022-01-02 00:00:00")
	// 	resImp.CampaingProperties.BudgetLimit = val.BudgetLimit
	// 	resImp.CampaingProperties.CampaignStatus = val.CampaignStatus
	// 	resImp.CampaingProperties.CretedAt = val.CreatedAt.Format("2022-01-01 00:00:00")
	// 	resImp.CampaingProperties.UpdatedAt = val.UpdatedAt.Format("2022-01-01 00:00:00")

	// 	if errQ2 := db.DB.Raw("select from audience as a left join campaign as c on a.audience_id=c.audience_id where a.ads_account_id=? and c.campaign_id=?", accountID, val.ID).Scan(&tmpA).Error; errQ2 != nil {
	// 		return nil, gqlerror.Errorf("error query find ads_campaign : " + errQ2.Error())
	// 	}

	// 	tmpGA.ID = strconv.FormatUint(tmpA.ID, 10)
	// 	tmpGA.AudienceName = tmpA.AudienceName
	// 	tmpGA.Location = tmpA.Location
	// 	tmpGA.Gender = tmpA.Gender
	// 	tmpGA.Age = tmpA.Age.GormDataType()
	// 	tmpGA.Interests = tmpA.Interest.GormDataType()
	// 	tmpGA.CreatedAt = tmpA.CreatedAt.Format("2022-01-01 00:00:00")
	// 	tmpGA.UpdatedAt = tmpA.UpdatedAt.Format("2022-02-02 00:00:00")
	// 	tmpGA.Address = tmpA.Address.GormDataType()

	// 	resImp.AudienceProperties = &tmpGA

	// 	result = append(result, &resImp)
	// }

	return result, nil
}

func (r *queryResolver) GetAdsBalance(ctx context.Context, input *model.InputQueryAdsBalance) (*model.DataAdsBalance, error) {
	var query dto.AdsBalanceQuery

	startDate := "NOW()"
	endDate := time.Now().AddDate(0, 0, -7).Format(time.RFC3339)

	if input.StartDate != nil {
		_, err := time.Parse(time.RFC3339, *input.StartDate)
		if err == nil {
			startDate = *input.StartDate
		}
	}

	if input.EndDate != nil {
		_, err := time.Parse(time.RFC3339, *input.StartDate)
		if err == nil {
			endDate = *input.StartDate
		}
	}

	if err := db.DB.Raw(`
	with ads_account as (
		select * from ads_accounts aa where id = ?
	),
	wallet_spents as (
		select wa2.id, jsonb_agg(jsonb_build_object(
		'id', wst2.id, 'wallet_ad_id', wst2.wallet_ad_id, 'amount', wst2.amount, 'campaign_id', wst2.campaign_id, 
		'campaign_name', c.campaign_name, 'campaign_objective', c."campaign_objective", 'created_at', wst2.created_at,
		'updated_at', wst2.updated_at) order by wst2.updated_at desc) spent_transactions from wallet_ads wa2 
		left join wallet_spent_transactions wst2 on wst2.wallet_ad_id = wa2.id 
		inner join campaigns c on c.id = wst2.campaign_id 
		where wa2.id = (select wallet_ad_id from ads_account)
		and wst2.updated_at < ? and wst2 .updated_at > ?
		group by wa2.id
	),
	wallet_topups as (
		select wa3.id,  jsonb_agg(wtt.* 
		  order by wtt.updated_at desc) topup_transactions from wallet_ads wa3 
		inner join wallet_topup_transactions wtt on wtt.wallet_ad_id = wa3.id and wtt.is_success = true
		and wtt.updated_at < ? and wtt.updated_at > ?
		where wa3.id = (select wallet_ad_id from ads_account)
		group by wa3.id
	)
	select 
	  wa.*, aa2.id ads_account_id, ws.spent_transactions, wt.topup_transactions
	from wallet_ads wa 
	inner join ads_account aa2 on aa2.wallet_ad_id = wa.id
	left join wallet_spents ws on ws.id = wa.id
	left join wallet_topups wt on wt.id = wa.id 
	group by wa.id, ws.spent_transactions, aa2.id, wt.topup_transactions
	`, input.AdsAccountID, startDate, endDate, startDate, endDate).Scan(&query).Error; err != nil {
		return nil, gqlerror.Errorf("error query ads balance" + err.Error())
	}

	payments, err := service.GetAllPayment()
	if err != nil {
		return nil, gqlerror.Errorf("error get all payments" + err.Error())
	}

	var result model.DataAdsBalance
	err = pipe.DtoToGraphAdsBalance(query, payments, &result)
	if err != nil {
		return nil, gqlerror.Errorf("error ads balance struct pipe" + err.Error())
	}

	return &result, nil
}

func (r *queryResolver) GetAdsCampaignReview(ctx context.Context) ([]*model.DataAdsCampaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)
	_ = userData

	//get data campaign
	var campaigns []modeldb.Campaign

	if err := db.DB.Raw(`SELECT * FROM campaign WHERE campaign_status IN ("team approval", "admin approval");`).Scan(&campaigns).Error; err != nil {
		return nil, gqlerror.Errorf("error query get all campaign review", err.Error())
	}

	var dataResult []*model.DataAdsCampaign

	for _, data := range campaigns {
		var campaignHistories []*modeldb.CampaignHistory

		if err := db.DB.Raw(`SELECT * FROM campaign_history WHERE campaign_id = ?;`, data.ID).Scan(&campaignHistories).Error; err != nil {
			return nil, gqlerror.Errorf("error query get all campaign history", err.Error())
		}

		var campaign *model.Campaign

		err1 := pipe.DbToGraphCampaign(data, campaignHistories, campaign)

		if err1 != nil {
			return nil, gqlerror.Errorf("error convert struct campaign db to graph" + err.Error())
		}

		//get data audience
		var audience modeldb.Audience

		if err := db.DB.Find(&audience, modeldb.Audience{AdsAccountID: data.AdsAccountID}).Error; err != nil {
			return nil, gqlerror.Errorf("error query audience" + err.Error())
		}

		var audienceGraph *model.Audience

		err2 := pipe.DbToGraphAudience(audience, audienceGraph)
		if err2 != nil {
			return nil, gqlerror.Errorf("error convert struct audience db to graph" + err.Error())
		}

		//get data content

		var contentDb dto.AdsContentReview

		if errC := db.DB.Raw(`
			SELECT ac.ads_content_id, ac.ads_content_name, ac.ads_account_id, pc.ads_placement_id, ap.ads_placement_name, 
			ac.campaign_placement_id, pc.content FROM ads_content ac LEFT JOIN placement_content pc ON pc.ads_content_id = ac.ads_content_id LEFT JOIN 
			ads_placement ap ON pc.ads_placement_id = ap.ads_placement_id WHERE ac.ads_account_id = ? ;`, data.AdsAccountID).Scan(&contentDb).Error; errC != nil {
			return nil, gqlerror.Errorf("error query user role in ads account", errC.Error())
		}

		var contentGraph *model.AdsContent
		err3 := pipe.DtoToGraphAdsContent(contentDb, contentGraph)
		if err3 != nil {
			return nil, gqlerror.Errorf("error convert struct audience db to graph" + err.Error())
		}

		res := model.DataAdsCampaign{
			Campaign: campaign,
			Audience: audienceGraph,
			Content:  contentGraph,
		}

		dataResult = append(dataResult, &res)
	}

	r.DataAdsCampaign = dataResult
	return r.DataAdsCampaign, nil
}

func (r *queryResolver) GetAdsCampaignPublished(ctx context.Context) ([]*model.DataAdsCampaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)
	_ = userData

	//get data campaign
	var campaigns []modeldb.Campaign

	if err := db.DB.Raw(`SELECT * FROM campaign WHERE campaign_status IN ("live", "published") ORDER BY campaign_status ASC;`).Scan(&campaigns).Error; err != nil {
		return nil, gqlerror.Errorf("error query get all campaign review", err.Error())
	}

	var dataResult []*model.DataAdsCampaign

	for _, data := range campaigns {
		var campaignHistories []*modeldb.CampaignHistory

		if err := db.DB.Raw(`SELECT * FROM campaign_history WHERE campaign_id = ?;`, data.ID).Scan(&campaignHistories).Error; err != nil {
			return nil, gqlerror.Errorf("error query get all campaign history", err.Error())
		}

		var campaign *model.Campaign

		err1 := pipe.DbToGraphCampaign(data, campaignHistories, campaign)

		if err1 != nil {
			return nil, gqlerror.Errorf("error convert struct campaign db to graph" + err.Error())
		}

		//get data audience
		var audience modeldb.Audience

		if err := db.DB.Find(&audience, modeldb.Audience{AdsAccountID: data.AdsAccountID}).Error; err != nil {
			return nil, gqlerror.Errorf("error query audience" + err.Error())
		}

		var audienceGraph *model.Audience

		err2 := pipe.DbToGraphAudience(audience, audienceGraph)
		if err2 != nil {
			return nil, gqlerror.Errorf("error convert struct audience db to graph" + err.Error())
		}

		//get data content

		var contentDb dto.AdsContentReview

		if errC := db.DB.Raw(`
			SELECT ac.ads_content_id, ac.ads_content_name, ac.ads_account_id, pc.ads_placement_id, ap.ads_placement_name, 
			ac.campaign_placement_id, pc.content FROM ads_content ac LEFT JOIN placement_content pc ON pc.ads_content_id = ac.ads_content_id LEFT JOIN 
			ads_placement ap ON pc.ads_placement_id = ap.ads_placement_id WHERE ac.ads_account_id = ? ;`, data.AdsAccountID).Scan(&contentDb).Error; errC != nil {
			return nil, gqlerror.Errorf("error query user role in ads account", errC.Error())
		}

		var contentGraph *model.AdsContent
		err3 := pipe.DtoToGraphAdsContent(contentDb, contentGraph)
		if err3 != nil {
			return nil, gqlerror.Errorf("error convert struct audience db to graph" + err.Error())
		}

		res := model.DataAdsCampaign{
			Campaign: campaign,
			Audience: audienceGraph,
			Content:  contentGraph,
		}

		dataResult = append(dataResult, &res)
	}

	r.DataAdsCampaign = dataResult
	return r.DataAdsCampaign, nil
}

func (r *queryResolver) GetAllPaymentMethod(ctx context.Context) ([]*model.PaymentMethod, error) {
	res, err := service.GetAllPayment()
	if err != nil {
		return nil, gqlerror.Errorf("error fetch all payment" + err.Error())
	}
	if len(res) == 0 {
		return nil, gqlerror.Errorf("payment method not found" + err.Error())
	}
	var result []*model.PaymentMethod
	for _, data := range res {
		var temp model.PaymentMethod
		pipe.PaymentMethodServiceToGraph(data, &temp)
		if temp.Status != 0 {
			result = append(result, &temp)
		}
	}
	r.PaymentMethod = result
	return r.PaymentMethod, nil
}

func (r *queryResolver) GetDuePayment(ctx context.Context, adsAccountID string) (*model.PaymentDetail, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)

	var adsAccount modeldb.AdsAccount
	if err := db.DB.First(&adsAccount, adsAccountID).Error; err != nil {
		return nil, nil
	}

	var queryTopup *modeldb.WalletTopupTransaction
	if err := db.DB.Where("is_success = ? and user_id = ? and expired_at > NOW() and wallet_ad_id = ?", false, userData.ID, adsAccount.WalletAdID).First(&queryTopup).Error; err != nil {
		return nil, nil
	}

	paymentDetail, err := service.GetPaymentDetail(strconv.FormatUint(queryTopup.ID, 10))
	if err != nil {
		return nil, gqlerror.Errorf("error fetch payment detail" + err.Error())
	}

	if paymentDetail.OrderID == "" {
		return nil, nil
	}

	var result model.PaymentDetail
	pipe.PaymentDetailServiceToGraph(paymentDetail, &result)

	return &result, nil
}

func (r *queryResolver) Campaigns(ctx context.Context, filter *model.CampaignsFilter, limit *int, offset *int) ([]*model.Campaign, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)
	_ = userData

	campaigns := []*modeldb.Campaign{}
	condition := modeldb.Campaign{}
	if filter != nil {
		if filter.AdsAccountID != nil {
			condition.AdsAccountID = uint64(*filter.AdsAccountID)
		}
		if filter.CampaignStatus != nil {
			condition.CampaignStatus = *filter.CampaignStatus
		}

	}
	query := db.DB.Limit(utils.SafeIntDereference(limit, 25)).Offset(utils.SafeIntDereference(offset, 0))
	if filter != nil {
		if rangeFilter := filter.RangeFilter; rangeFilter != nil {
			start, _ := time.Parse(time.RFC3339, "2002-10-02T15:00:00Z")
			end := time.Now()
			if startDate := rangeFilter.StartDate; startDate != nil {
				tempStart, startErr := time.Parse(time.RFC3339, utils.SafeStringDereference(startDate))
				if startErr != nil {
					return nil, gqlerror.Errorf("invalid range filter", startErr.Error())
				}
				start = tempStart
			}

			if endDate := rangeFilter.EndDate; endDate != nil {
				tempEnd, endErr := time.Parse(time.RFC3339, utils.SafeStringDereference(endDate))
				if endErr != nil {
					return nil, gqlerror.Errorf("invalid range filter", endErr.Error())
				}
				end = tempEnd
			}
			query = query.Where("updated_at between ? and ?", start, end)
		}
	}
	query = query.Find(&campaigns, condition)

	if dbErr := query.Error; dbErr != nil {
		return nil, gqlerror.Errorf("error getting campaign", dbErr.Error())
	}

	var results []*model.Campaign
	for _, campaign := range campaigns {
		var result model.Campaign
		pipe.DbToGraphCampaignSimple(*campaign, &result)
		results = append(results, &result)
	}

	return results, nil
}

func (r *queryResolver) AdsContents(ctx context.Context, filter *model.AdsContentsFilter, limit *int, offset *int) ([]*model.AdsContent, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)
	_ = userData

	adsContents := []*modeldb.AdsContent{}
	condition := modeldb.AdsContent{}
	if filter != nil {
		if filter.AdsAccountID != nil {
			condition.AdsAccountID = uint64(*filter.AdsAccountID)
		}
	}

	query := db.DB.Limit(utils.SafeIntDereference(limit, 25)).Offset(utils.SafeIntDereference(offset, 0)).Order("updated_at desc")
	if filter != nil {
		if rangeFilter := filter.RangeFilter; rangeFilter != nil {
			start, _ := time.Parse(time.RFC3339, "2002-10-02T15:00:00Z")
			end := time.Now()
			if startDate := rangeFilter.StartDate; startDate != nil {
				tempStart, startErr := time.Parse(time.RFC3339, utils.SafeStringDereference(startDate))
				if startErr != nil {
					return nil, gqlerror.Errorf("invalid range filter", startErr.Error())
				}
				start = tempStart
			}

			if endDate := rangeFilter.EndDate; endDate != nil {
				tempEnd, endErr := time.Parse(time.RFC3339, utils.SafeStringDereference(endDate))
				if endErr != nil {
					return nil, gqlerror.Errorf("invalid range filter", endErr.Error())
				}
				end = tempEnd
			}
			query = query.Where("updated_at between ? and ?", start, end)
		}
	}
	query = query.Find(&adsContents, condition)

	if dbErr := query.Error; dbErr != nil {
		return nil, gqlerror.Errorf("error getting campaign", dbErr.Error())
	}

	var results []*model.AdsContent
	for _, adsContent := range adsContents {
		var result model.AdsContent
		pipe.DbToGraphAdsContentSimple(*adsContent, &result)
		results = append(results, &result)
	}

	return results, nil
}

func (r *queryResolver) Audiences(ctx context.Context, filter *model.AudienceFilter, limit *int, offset *int) ([]*model.Audience, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, gqlerror.Errorf("error getting gin context", err.Error())
	}
	var temp interface{} = gc.MustGet("user")
	userData := temp.(service.UserProperties)
	_ = userData

	audiences := []*modeldb.Audience{}
	condition := modeldb.Audience{}
	if filter != nil {
		if filter.AdsAccountID != nil {
			condition.AdsAccountID = uint64(*filter.AdsAccountID)
		}
	}

	query := db.DB.Limit(utils.SafeIntDereference(limit, 25)).Offset(utils.SafeIntDereference(offset, 0)).Order("updated_at desc")
	if filter != nil {
		if rangeFilter := filter.RangeFilter; rangeFilter != nil {
			start, _ := time.Parse(time.RFC3339, "2002-10-02T15:00:00Z")
			end := time.Now()
			if startDate := rangeFilter.StartDate; startDate != nil {
				tempStart, startErr := time.Parse(time.RFC3339, utils.SafeStringDereference(startDate))
				if startErr != nil {
					return nil, gqlerror.Errorf("invalid range filter", startErr.Error())
				}
				start = tempStart
			}

			if endDate := rangeFilter.EndDate; endDate != nil {
				tempEnd, endErr := time.Parse(time.RFC3339, utils.SafeStringDereference(endDate))
				if endErr != nil {
					return nil, gqlerror.Errorf("invalid range filter", endErr.Error())
				}
				end = tempEnd
			}
			query = query.Where("updated_at between ? and ?", start, end)
		}
	}
	query = query.Find(&audiences, condition)

	if dbErr := query.Error; dbErr != nil {
		return nil, gqlerror.Errorf("error getting audience", dbErr.Error())
	}

	var results []*model.Audience
	for _, adsContent := range audiences {
		var result model.Audience
		pipe.DbToGraphAudience(*adsContent, &result)
		results = append(results, &result)
	}

	return results, nil
}

func (r *subscriptionResolver) MessageUpdateAdsPlacementEvent(ctx context.Context) (<-chan *model.ResponseSubcribe, error) {
	panic(fmt.Errorf("not implemented"))
}

// AdsContent returns generated.AdsContentResolver implementation.
func (r *Resolver) AdsContent() generated.AdsContentResolver { return &adsContentResolver{r} }

// Audience returns generated.AudienceResolver implementation.
func (r *Resolver) Audience() generated.AudienceResolver { return &audienceResolver{r} }

// Campaign returns generated.CampaignResolver implementation.
func (r *Resolver) Campaign() generated.CampaignResolver { return &campaignResolver{r} }

// CampaignHistories returns generated.CampaignHistoriesResolver implementation.
func (r *Resolver) CampaignHistories() generated.CampaignHistoriesResolver {
	return &campaignHistoriesResolver{r}
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// PaymentDetail returns generated.PaymentDetailResolver implementation.
func (r *Resolver) PaymentDetail() generated.PaymentDetailResolver { return &paymentDetailResolver{r} }

// PlacementContent returns generated.PlacementContentResolver implementation.
func (r *Resolver) PlacementContent() generated.PlacementContentResolver {
	return &placementContentResolver{r}
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type adsContentResolver struct{ *Resolver }
type audienceResolver struct{ *Resolver }
type campaignResolver struct{ *Resolver }
type campaignHistoriesResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type paymentDetailResolver struct{ *Resolver }
type placementContentResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
