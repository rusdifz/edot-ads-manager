package enum

import "database/sql/driver"

type gender string

const (
	MALE   gender = "male"
	FEMALE gender = "female"
)

func (ct *gender) Scan(value interface{}) error {
	*ct = gender(value.([]byte))
	return nil
}

func (ct gender) Value() (driver.Value, error) {
	return string(ct), nil
}
