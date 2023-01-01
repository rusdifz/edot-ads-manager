package enum

import "database/sql/driver"

type invitationStatus string

const (
	PENDING             invitationStatus = "pending"
	APPROVED            invitationStatus = "approved"
	INVITATION_REJECTED invitationStatus = "rejected"
	CANCELED            invitationStatus = "canceled"
)

func (ct *invitationStatus) Scan(value interface{}) error {
	*ct = invitationStatus(value.([]byte))
	return nil
}

func (ct invitationStatus) Value() (driver.Value, error) {
	return string(ct), nil
}
