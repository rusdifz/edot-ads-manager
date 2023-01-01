package enum

import "database/sql/driver"

type userActorType string

const (
	MEMBER    userActorType = "member"
	APPROVER  userActorType = "approver"
	ADMINZEUS userActorType = "admin zeus"
	SYSTEM    userActorType = "system"
)

func (ct *userActorType) Scan(value interface{}) error {
	*ct = userActorType(value.([]byte))
	return nil
}

func (ct userActorType) Value() (driver.Value, error) {
	return string(ct), nil
}
