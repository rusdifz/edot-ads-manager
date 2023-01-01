package service

import (
	"ads-manager/utils"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
)

type UserProperties struct {
	ID                   uint64      `json:"id"`
	Fullname             string      `json:"fullname"`
	Username             string      `json:"username"`
	Bio                  interface{} `json:"bio"`
	Email                string      `json:"email"`
	RecoveryEmail        string      `json:"recovery_email"`
	PhoneNumber          string      `json:"phone_number"`
	RecoveryPhone        string      `json:"recovery_phone"`
	ProfilePicture       *string     `json:"profile_picture"`
	DateOfBirth          string      `json:"date_of_birth"`
	Gender               string      `json:"gender"`
	KtpImage             interface{} `json:"ktp_image"`
	KtpNo                interface{} `json:"ktp_no"`
	IsTwoStep            string      `json:"is_two_step"`
	IsVerification       string      `json:"is_verification"`
	IsDeveloper          string      `json:"is_developer"`
	IsEmployee           int         `json:"is_employee"`
	CreatedBy            string      `json:"created_by"`
	UpdatedBy            string      `json:"updated_by"`
	UserSecurityQuestion struct {
		QuestionID int `json:"question_id"`
	} `json:"user_security_question"`
}
type GetMultipleUserPropertiesRes struct {
	APIVersion  string `json:"api_version"`
	MemoryUsage string `json:"memory_usage"`
	ElapseTime  string `json:"elapse_time"`
	Lang        string `json:"lang"`
	Code        int    `json:"code"`
	Error       struct {
		Message string `json:"message"`
		Errors  []struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		} `json:"errors"`
	} `json:"error"`
	Data []UserProperties `json:"data"`
}

type CheckUserTokenRes struct {
	APIVersion  string `json:"api_version"`
	MemoryUsage string `json:"memory_usage"`
	ElapseTime  string `json:"elapse_time"`
	Lang        string `json:"lang"`
	Code        int    `json:"code"`
	Error       struct {
		Message string `json:"message"`
		Errors  []struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		} `json:"errors"`
	} `json:"error"`
	Data UserProperties `json:"data"`
}

type SsoTokenRes struct {
	APIVersion  string `json:"api_version"`
	MemoryUsage string `json:"memory_usage"`
	ElapseTime  string `json:"elapse_time"`
	Lang        string `json:"lang"`
	Code        int    `json:"code"`
	Error       struct {
	} `json:"error"`
	Data struct {
		Token struct {
			ID           uint64      `json:"id"`
			AppsID       string      `json:"apps_id"`
			DeviceID     string      `json:"device_id"`
			DeviceType   string      `json:"device_type"`
			IP           interface{} `json:"ip"`
			TokenCode    string      `json:"token_code"`
			RefreshToken string      `json:"refresh_token"`
			CreatedDate  time.Time   `json:"created_date"`
			ExpiredDate  time.Time   `json:"expired_date"`
			TokenProfile struct {
				UserID       interface{} `json:"user_id"`
				AdminID      interface{} `json:"admin_id"`
				LastActivity time.Time   `json:"last_activity"`
			} `json:"token_profile"`
		} `json:"token"`
	} `json:"data"`
}

type UserAccountData struct {
	ID             uint64      `json:"id"`
	Fullname       string      `json:"fullname"`
	Username       string      `json:"username"`
	Email          string      `json:"email"`
	RecoveryEmail  string      `json:"recovery_email"`
	PhoneNumber    string      `json:"phone_number"`
	RecoveryPhone  string      `json:"recovery_phone"`
	ProfilePicture *string     `json:"profile_picture"`
	DateOfBirth    time.Time   `json:"date_of_birth"`
	Gender         string      `json:"gender"`
	KtpImage       interface{} `json:"ktp_image"`
	KtpNo          interface{} `json:"ktp_no"`
	IsTwoStep      string      `json:"is_two_step"`
	IsVerification string      `json:"is_verification"`
	IsDeveloper    string      `json:"is_developer"`
	Createdate     time.Time   `json:"createdate"`
	Updatedate     time.Time   `json:"updatedate"`
	Status         string      `json:"status"`
	IsEmployee     int         `json:"is_employee"`
	CreatedBy      interface{} `json:"created_by"`
	UpdatedBy      interface{} `json:"updated_by"`
}

type UserAccountsRes struct {
	APIVersion  string `json:"api_version"`
	MemoryUsage string `json:"memory_usage"`
	ElapseTime  string `json:"elapse_time"`
	Lang        string `json:"lang"`
	Code        int    `json:"code"`
	Error       struct {
	} `json:"error"`
	Data []UserAccountData `json:"data"`
}

type BusinessAccountData struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Owner int    `json:"owner"`
}

type BusinessAccountsRes struct {
	APIVersion  string `json:"api_version"`
	MemoryUsage string `json:"memory_usage"`
	ElapseTime  string `json:"elapse_time"`
	Lang        string `json:"lang"`
	Code        int    `json:"code"`
	Error       struct {
	} `json:"error"`
	Data struct {
		BusinessesNoAuth []BusinessAccountData `json:"businesses_no_auth"`
	} `json:"data"`
}

type CheckSSOTokenRes struct {
	APIVersion  string `json:"api_version"`
	MemoryUsage string `json:"memory_usage"`
	ElapseTime  string `json:"elapse_time"`
	Lang        string `json:"lang"`
	Code        int    `json:"code"`
	Error       struct {
		Message string `json:"message"`
		Errors  []struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		} `json:"errors"`
	} `json:"error"`
	Data struct {
		Data struct {
			ID           uint64      `json:"id"`
			AppsID       string      `json:"apps_id"`
			DeviceID     string      `json:"device_id"`
			DeviceType   string      `json:"device_type"`
			IP           interface{} `json:"ip"`
			TokenCode    string      `json:"token_code"`
			RefreshToken string      `json:"refresh_token"`
			CreatedDate  time.Time   `json:"created_date"`
			ExpiredDate  time.Time   `json:"expired_date"`
			TokenProfile struct {
				UserID       interface{} `json:"user_id"`
				AdminID      interface{} `json:"admin_id"`
				LastActivity time.Time   `json:"last_activity"`
			} `json:"token_profile"`
		} `json:"data"`
	} `json:"data"`
}

type MultipleBusinessAccountRes struct {
	APIVersion  string `json:"api_version"`
	MemoryUsage string `json:"memory_usage"`
	ElapseTime  string `json:"elapse_time"`
	Lang        string `json:"lang"`
	Code        int    `json:"code"`
	Error       struct {
	} `json:"error"`
	Data struct {
		GetDetailBusinessNoOauth []BusinessAccountData `json:"getDetailBusinessNoOauth"`
	} `json:"data"`
}

// function to fetch sso token from sso 3rd party api
func FetchSSOToken() (string, error) {
	domain := utils.GetSSODomain()
	resp, err := http.PostForm((domain + "api/token/get"), url.Values{
		"name":       {os.Getenv("SSO_NAME_APP")},
		"secret_key": {os.Getenv("SSO_SECRET_KEY")},
	})
	if err != nil {
		fmt.Println("error in fetching sso token", err)
		return "", err
	}

	defer resp.Body.Close()
	bodyBytes, _ := io.ReadAll(resp.Body)

	ssoTokenData := SsoTokenRes{}
	json.Unmarshal(bodyBytes, &ssoTokenData)
	return ssoTokenData.Data.Token.TokenCode, nil
}

// function to fetch all user account from sso api
func FetchAllUserAccounts() (UserAccountsRes, error) {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	domain := utils.GetSSODomain()
	req, err := http.NewRequest("GET", domain+"api/user/get_all_user", nil)
	if err != nil {
		fmt.Println("Got error in get all user account sso", err.Error())
		return UserAccountsRes{}, err
	}
	token, errToken := GetSsoToken()
	if errToken != nil {
		fmt.Println(errToken.Error())
		return UserAccountsRes{}, errToken
	}
	req.Header.Set("sso-token", token)
	response, err := client.Do(req)
	if err != nil {
		fmt.Println("Got error in get all user account sso", err.Error())
		return UserAccountsRes{}, err
	}
	defer response.Body.Close()
	bodyBytes, _ := io.ReadAll(response.Body)
	allUserAccountData := UserAccountsRes{}
	json.Unmarshal(bodyBytes, &allUserAccountData)
	return allUserAccountData, nil
}

// function to fetch all business accounts from sso api
func FetchAllBusinessAccounts() (BusinessAccountsRes, error) {
	domain := utils.GetSSODomain()
	jsonData := map[string]string{"query": "{ businesses_no_auth{ id, name, owner } }"}
	jsonValue, _ := json.Marshal(jsonData)
	request, err := http.NewRequest("POST", domain+"api/business/all", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Println("error post request business account", err.Error())
		return BusinessAccountsRes{}, err
	}
	token, errToken := GetSsoToken()
	if errToken != nil {
		fmt.Println(errToken.Error())
		return BusinessAccountsRes{}, errToken
	}
	request.Header.Set("sso-token", token)
	request.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: time.Second * 10}
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("request business account data error", err.Error())
		return BusinessAccountsRes{}, err
	}
	defer response.Body.Close()
	data, _ := io.ReadAll(response.Body)
	BusinessAccountsData := BusinessAccountsRes{}
	json.Unmarshal(data, &BusinessAccountsData)
	return BusinessAccountsData, nil
}

// function to check if sso token is valid
func CheckSSOToken(token string) bool {
	domain := utils.GetSSODomain()
	jsonData := map[string]string{"token": token}
	jsonValue, _ := json.Marshal(jsonData)
	request, err := http.NewRequest("POST", domain+"api/token/check", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Println("error check token", err)
		return false
	}
	request.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: time.Second * 10}
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("request check token error", err)
		return false
	}
	defer response.Body.Close()
	data, _ := io.ReadAll(response.Body)
	cekTokenRes := CheckSSOTokenRes{}
	json.Unmarshal(data, &cekTokenRes)
	if cekTokenRes.Code == 200 {
		return true
	} else {
		return false
	}
}

/*
function to check if user token valid, and return properties
*/
func CheckUserToken(token string) (UserProperties, error) {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	domain := utils.GetSSODomain()
	req, err := http.NewRequest("GET", domain+"api/user/get_user_detail", nil)
	if err != nil {
		fmt.Println("Got error in get all user account sso", err)
		return UserProperties{}, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	response, err := client.Do(req)
	if err != nil {
		fmt.Println("Got error in check user token", err)
		return UserProperties{}, err
	}
	defer response.Body.Close()
	bodyBytes, _ := io.ReadAll(response.Body)
	resCheckUserToken := CheckUserTokenRes{}
	json.Unmarshal(bodyBytes, &resCheckUserToken)
	return resCheckUserToken.Data, nil
}

/* function to get user properties from valid sso token and array of user ids */
func GetMultipleUserProperties(ssoToken string, userIds []uint64) ([]UserProperties, error) {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	domain := utils.GetSSODomain()
	jsonData := map[string][]uint64{"user_id": userIds}
	jsonValue, _ := json.Marshal(jsonData)
	req, err := http.NewRequest("POST", domain+"api/user/get_user_detail_no_auth", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Println("error in getting user details from user ids")
		return nil, err
	}
	req.Header.Set("sso-token", ssoToken)
	req.Header.Set("Content-Type", "application/json")
	response, err := client.Do(req)
	if err != nil {
		fmt.Println("Got error in getting user details from user ids", err)
		return nil, err
	}
	defer response.Body.Close()
	bodyBytes, _ := io.ReadAll(response.Body)
	resMultipleUserProperties := GetMultipleUserPropertiesRes{}
	json.Unmarshal(bodyBytes, &resMultipleUserProperties)
	return resMultipleUserProperties.Data, nil
}

// function to get multiple business properties from valid sso token and array of business ids
func GetMultipleBusinessProperties(SsoToken string, businessIds []uint64) ([]BusinessAccountData, error) {
	domain := utils.GetSSODomain()
	variableString := `{"id_business": [`
	for i := 0; i < len(businessIds); i++ {
		if i == len(businessIds)-1 {
			variableString = variableString + strconv.FormatUint(businessIds[i], 10) + " ]}"
			break
		}
		variableString = variableString + strconv.FormatUint(businessIds[i], 10) + ", "
	}
	jsonData := map[string]string{
		"query":         "mutation getDetailBusiness2($id_business: [Int]!){ getDetailBusinessNoOauth( id_business:$id_business) {id, name, owner}}",
		"operationName": "getDetailBusiness2",
		"variables":     variableString,
	}
	jsonValue, _ := json.Marshal(jsonData)
	request, err := http.NewRequest("POST", domain+"api/business/detail/noauth/all", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Println("error post request business account", err)
		return nil, err
	}
	token, errToken := GetSsoToken()
	if errToken != nil {
		fmt.Println(errToken.Error())
		return nil, errToken
	}
	request.Header.Set("sso-token", token)
	request.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: time.Second * 10}
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("request business account data error", err)
		return nil, err
	}
	defer response.Body.Close()
	data, _ := io.ReadAll(response.Body)
	BusinessAccountsData := MultipleBusinessAccountRes{}
	json.Unmarshal(data, &BusinessAccountsData)
	return BusinessAccountsData.Data.GetDetailBusinessNoOauth, nil
}
