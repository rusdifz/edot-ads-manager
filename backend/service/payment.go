package service

import (
	"ads-manager/utils"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type PaymentMethod struct {
	ID              int    `json:"id"`
	Name            string `json:"name"`
	Logo            string `json:"logo"`
	Status          int    `json:"status"`
	Type            int    `json:"type"`
	ExpirationTime  int    `json:"expiration_time"`
	AdminFeeFixed   int    `json:"admin_fee_fixed"`
	AdminFeePercent int    `json:"admin_fee_percent"`
	MinPrice        int    `json:"min_price"`
	MaxPrice        int64  `json:"max_price"`
}

type ResGetAllPayment struct {
	Status  int             `json:"status"`
	Message string          `json:"message"`
	Data    []PaymentMethod `json:"data"`
}

type ResGetPaymentMethodById struct {
	Status  int           `json:"status"`
	Message string        `json:"message"`
	Data    PaymentMethod `json:"data"`
}

type BodyPayment struct {
	PartnerTransactionId string
	PaymentMethodId      int
	UserId               string
	Name                 string
	Phone                string
	Price                float64
}

type PaymentDetail struct {
	PartnerTransactionID string    `json:"partner_transaction_id"`
	UserID               string    `json:"user_id"`
	PaymentMethodID      int       `json:"payment_method_id"`
	OrderID              string    `json:"order_id"`
	ExternalID           string    `json:"external_id"`
	Price                int       `json:"price"`
	PriceRaw             int       `json:"price_raw"`
	PriceAdmin           int       `json:"price_admin"`
	Status               int       `json:"status"`
	Phone                string    `json:"phone"`
	AccountName          string    `json:"account_name"`
	VaNumber             string    `json:"va_number"`
	DesktopURL           string    `json:"desktop_url"`
	MobileURL            string    `json:"mobile_url"`
	Deeplink             string    `json:"deeplink"`
	QrCode               string    `json:"qr_code"`
	PaymentCode          string    `json:"payment_code"`
	ExpiredAt            time.Time `json:"expired_at"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

type ResGetPaymentDetail struct {
	Status  int           `json:"status"`
	Message string        `json:"message"`
	Data    PaymentDetail `json:"data"`
}

type ResCreatePayment struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Data    struct {
		PartnerTransactionID string    `json:"partner_transaction_id"`
		UserID               string    `json:"user_id"`
		PaymentMethodID      int       `json:"payment_method_id"`
		OrderID              string    `json:"order_id"`
		ExternalID           string    `json:"external_id"`
		Price                int       `json:"price"`
		PriceRaw             int       `json:"price_raw"`
		PriceAdmin           int       `json:"price_admin"`
		Status               int       `json:"status"`
		Phone                string    `json:"phone"`
		AccountName          string    `json:"account_name"`
		VaNumber             string    `json:"va_number"`
		DesktopURL           string    `json:"desktop_url"`
		MobileURL            string    `json:"mobile_url"`
		Deeplink             string    `json:"deeplink"`
		QrCode               string    `json:"qr_code"`
		PaymentCode          string    `json:"payment_code"`
		ExpiredAt            time.Time `json:"expired_at"`
		CreatedAt            time.Time `json:"created_at"`
		UpdatedAt            time.Time `json:"updated_at"`
	} `json:"data"`
}

func GetAllPayment() ([]PaymentMethod, error) {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	domain := utils.GetPaymentDomain()
	req, err := http.NewRequest("GET", domain+"payment-method", nil)
	if err != nil {
		return nil, errors.New("error get payment method" + err.Error())
	}
	secret_key := os.Getenv("ADS_PAYMENT_KEY")
	var authorization string = base64.StdEncoding.EncodeToString([]byte(secret_key))
	req.Header.Set("Authorization", "Basic "+authorization)
	response, err := client.Do(req)
	if err != nil {
		return nil, errors.New("error get payment method" + err.Error())
	}
	defer response.Body.Close()
	bodyBytes, _ := io.ReadAll(response.Body)
	allPaymentData := ResGetAllPayment{}
	json.Unmarshal(bodyBytes, &allPaymentData)
	if allPaymentData.Data == nil {
		return nil, errors.New("no data returned" + err.Error())
	}
	return allPaymentData.Data, nil
}

func GetPaymentMethodById(id string) (PaymentMethod, error) {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	domain := utils.GetPaymentDomain()
	req, err := http.NewRequest("GET", domain+"payment-method/"+id, nil)
	if err != nil {
		return PaymentMethod{}, errors.New("error get payment method" + err.Error())
	}
	secret_key := os.Getenv("ADS_PAYMENT_KEY")
	var authorization string = base64.StdEncoding.EncodeToString([]byte(secret_key))
	req.Header.Set("Authorization", "Basic "+authorization)
	response, err := client.Do(req)
	if err != nil {
		return PaymentMethod{}, errors.New("error get payment method" + err.Error())
	}
	defer response.Body.Close()
	bodyBytes, _ := io.ReadAll(response.Body)
	paymentData := ResGetPaymentMethodById{}
	json.Unmarshal(bodyBytes, &paymentData)
	if paymentData.Data.ID == 0 {
		return PaymentMethod{}, errors.New("not found payment method")
	}
	return paymentData.Data, nil
}

func CreatePayment(body BodyPayment) (PaymentDetail, error) {
	domain := utils.GetPaymentDomain()
	jsonData := map[string]interface{}{
		"partner_transaction_id": body.PartnerTransactionId,
		"payment_method_id":      body.PaymentMethodId,
		"user_id":                body.UserId,
		"name":                   body.Name,
		"phone":                  body.Phone,
		"price":                  body.Price,
	}
	jsonValue, err := json.Marshal(jsonData)
	if err != nil {
		return PaymentDetail{}, errors.New("error marshal struct to json body" + err.Error())
	}
	fmt.Println("jsonvalue", jsonValue)
	request, err := http.NewRequest("POST", domain+"payment", bytes.NewBuffer(jsonValue))
	if err != nil {
		return PaymentDetail{}, errors.New("error provide byte to post request" + err.Error())
	}
	secret_key := os.Getenv("ADS_PAYMENT_KEY")
	var authorization string = base64.StdEncoding.EncodeToString([]byte(secret_key))
	request.Header.Set("Authorization", "Basic "+authorization)
	request.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: time.Second * 10}
	response, err := client.Do(request)
	if err != nil {
		return PaymentDetail{}, errors.New("error post request" + err.Error())
	}
	defer response.Body.Close()
	fmt.Println(response.Body)
	data, err := io.ReadAll(response.Body)
	if err != nil {
		return PaymentDetail{}, errors.New("error io read response" + err.Error())
	}
	resCreatePayment := ResCreatePayment{}
	json.Unmarshal(data, &resCreatePayment)
	fmt.Println(resCreatePayment)
	if resCreatePayment.Status == 400 || resCreatePayment.Data.OrderID == "" {
		return PaymentDetail{}, errors.New(resCreatePayment.Message)
	}
	return resCreatePayment.Data, nil
}

func GetPaymentDetail(orderId string) (PaymentDetail, error) {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	domain := utils.GetPaymentDomain()
	req, err := http.NewRequest("GET", domain+"payment/"+"ads-manager-"+orderId, nil)
	if err != nil {
		return PaymentDetail{}, errors.New("error get payment detail" + err.Error())
	}
	secret_key := os.Getenv("ADS_PAYMENT_KEY")
	var authorization string = base64.StdEncoding.EncodeToString([]byte(secret_key))
	req.Header.Set("Authorization", "Basic "+authorization)
	response, err := client.Do(req)
	if err != nil {
		return PaymentDetail{}, errors.New("error get payment detail" + err.Error())
	}
	defer response.Body.Close()
	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return PaymentDetail{}, errors.New("error io read response" + err.Error())
	}
	resPaymentDetail := ResGetPaymentDetail{}
	json.Unmarshal(bodyBytes, &resPaymentDetail)
	if resPaymentDetail.Data.OrderID == "0" {
		return PaymentDetail{}, errors.New("not found payment detail")
	}
	return resPaymentDetail.Data, nil
}
