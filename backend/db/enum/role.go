package enum

import "database/sql/driver"

type userRole string

const (
	OWNER      userRole = "owner"
	ADMIN      userRole = "admin"
	ADVERTISER userRole = "advertiser"
	ANALYST    userRole = "analyst"
)

func (ct *userRole) Scan(value interface{}) error {
	*ct = userRole(value.([]byte))
	return nil
}

func (ct userRole) Value() (driver.Value, error) {
	return string(ct), nil
}
