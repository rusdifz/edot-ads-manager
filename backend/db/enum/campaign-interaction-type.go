package enum

import "database/sql/driver"

type campaignInteractionType string

const (
	DURATION               campaignInteractionType = "duration"
	VIEW                   campaignInteractionType = "view"
	CLICK                  campaignInteractionType = "click"
	CONVERSION_INTERACTION campaignInteractionType = "conversion"
)

func (ct *campaignInteractionType) Scan(value interface{}) error {
	*ct = campaignInteractionType(value.([]byte))
	return nil
}

func (ct campaignInteractionType) Value() (driver.Value, error) {
	return string(ct), nil
}
