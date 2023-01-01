package pipe

import (
	"ads-manager/graph/model"
	"ads-manager/service"
	"strconv"
	"time"
)

func UserServiceToGraph(userService service.UserProperties, userGraph *model.User) error {
	*userGraph = model.User{
		ID:             strconv.FormatUint(userService.ID, 10),
		Fullname:       userService.Fullname,
		Username:       userService.Username,
		ProfilePicture: userService.ProfilePicture,
	}
	return nil
}

func UserServiceDataToGraph(userService service.UserAccountData, userGraph *model.User) error {
	*userGraph = model.User{
		ID:             strconv.FormatUint(userService.ID, 10),
		Fullname:       userService.Fullname,
		Username:       userService.Username,
		ProfilePicture: userService.ProfilePicture,
	}
	return nil
}

func PaymentMethodServiceToGraph(paymentService service.PaymentMethod, paymentGraph *model.PaymentMethod) error {
	*paymentGraph = model.PaymentMethod{
		ID:              paymentService.ID,
		Name:            paymentService.Name,
		Logo:            paymentService.Logo,
		Status:          paymentService.Status,
		Type:            paymentService.Type,
		ExpirationTime:  paymentService.ExpirationTime,
		AdminFeeFixed:   float64(paymentService.AdminFeeFixed),
		AdminFeePercent: float64(paymentService.AdminFeePercent),
		MinPrice:        float64(paymentService.MinPrice),
		MaxPrice:        float64(paymentService.MaxPrice),
	}
	return nil
}

func PaymentDetailServiceToGraph(paymentService service.PaymentDetail, paymentGraph *model.PaymentDetail) error {
	*paymentGraph = model.PaymentDetail{
		OrderID:              paymentService.OrderID,
		PartnerTransactionID: paymentService.PartnerTransactionID,
		UserID:               paymentService.UserID,
		Payment:              paymentService.PaymentMethodID,
		ExternalID:           paymentService.ExternalID,
		Price:                float64(paymentService.Price),
		PriceRaw:             float64(paymentService.PriceRaw),
		PriceAdmin:           float64(paymentService.PriceAdmin),
		Status:               paymentService.Status,
		Phone:                paymentService.Phone,
		AccountName:          paymentService.AccountName,
		VaNumber:             paymentService.VaNumber,
		DesktopURL:           paymentService.DesktopURL,
		MobileURL:            paymentService.MobileURL,
		DeepLink:             paymentService.Deeplink,
		QRCode:               paymentService.QrCode,
		PaymentCode:          paymentService.QrCode,
		ExpiredAt:            paymentService.ExpiredAt.Format(time.RFC3339),
		CreatedAt:            paymentService.CreatedAt.Format(time.RFC3339),
		UpdatedAt:            paymentService.UpdatedAt.Format(time.RFC3339),
	}
	return nil
}
