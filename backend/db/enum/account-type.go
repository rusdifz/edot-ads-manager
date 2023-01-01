package enum

import "database/sql/driver"

type accountType string

const (
	PERSONAL accountType = "personal"
	BUSINESS accountType = "business"
)

func (ct *accountType) Scan(value interface{}) error {
	*ct = accountType(value.([]byte))
	return nil
}

func (ct accountType) Value() (driver.Value, error) {
	return string(ct), nil
}
