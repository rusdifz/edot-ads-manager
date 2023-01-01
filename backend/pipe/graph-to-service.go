package pipe

import (
	"ads-manager/graph/model"
	"ads-manager/service"
	"strconv"
)

func InputPaymentGraphToService(graphInput *model.InputTopup, userData service.UserProperties, orderId uint64, phoneNumber *string, serviceInput *service.BodyPayment) error {
	phone := userData.PhoneNumber
	if phoneNumber != nil {
		phone = *phoneNumber
	}
	*serviceInput = service.BodyPayment{
		PartnerTransactionId: strconv.FormatUint(orderId, 10),
		PaymentMethodId:      graphInput.PaymentMethodID,
		UserId:               strconv.FormatUint(userData.ID, 10),
		Name:                 userData.Fullname,
		Phone:                phone,
		Price:                graphInput.Amount,
	}
	return nil
}
