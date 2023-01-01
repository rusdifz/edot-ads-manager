package adsbalance

import (
	"ads-manager/db"
	"ads-manager/dto"
	"ads-manager/service"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/monaco-io/request"
)

func CreateTopupAds(ctx *gin.Context) {
	var temp interface{} = ctx.MustGet("user")
	userData := temp.(service.UserProperties)

	var input dto.InputTopup

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error dd": err.Error()})
		return
	}

	var topup dto.WalletTopupTransaction

	//insert data topup

	tx := db.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err1 := tx.Error; err1 != nil {
		tx.Rollback()
	}

	if err := tx.Raw(` INSERT INTO wallet_topup_transactions (wallet_ad_id, amount, order_id, is_success) VALUES(?,?,?,?)
						RETURNING *`,
		input.WalletAdId, input.Amount, input.PaymentMethod, false).Scan(&topup).Error; err != nil {
		tx.Rollback()
	}

	secret_key := os.Getenv("ADS_PAYMENT_KEY")
	var authorization string = base64.StdEncoding.EncodeToString([]byte(secret_key))

	sendPayment := dto.CreatePayment{
		PartnerTransactionId: strconv.FormatUint(topup.ID, 10),
		PaymentMethodId:      input.PaymentMethod,
		UserId:               userData.ID,
		Name:                 userData.Fullname,
		Phone:                userData.PhoneNumber,
		Price:                input.Amount,
	}

	client := request.Client{
		URL:    "https://epayment.dev.edot.id/payment",
		Method: "POST",
		Header: map[string]string{"Authorization": "Basic " + authorization},
		JSON:   sendPayment,
	}

	var result interface{}

	resp := client.Send().Scan(&result)

	emptyResp := dto.EmptyResp{
		WalletTopupID: 0,
		WalletAdsId:   0,
		Amount:        0,
		OrderId:       0,
		IsSuccess:     false,
		CreatedAt:     "",
		UpdatedAt:     "",
	}

	if !resp.OK() {
		fmt.Println("err", resp.Error())
		tx.Rollback()
		ctx.JSON(400, gin.H{"statusCode": 400, "message": "Failed Topup", "errorMessage": resp.Error(), "data": emptyResp})
	}

	if resp.OK() {
		fmt.Println("success", resp.OK())
		tx.Commit()
		ctx.JSON(201, gin.H{"statusCode": 201, "message": "success", "data": topup})
	}
}
