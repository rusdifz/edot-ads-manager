package enum

import "database/sql/driver"

type campaignObjective string

const (
	BRAND_AWARENESS campaignObjective = "brand awareness"
	REACH           campaignObjective = "reach"
	TRAFFIC         campaignObjective = "traffic"
	CONVERSION      campaignObjective = "conversion"
)

func (ct *campaignObjective) Scan(value interface{}) error {
	*ct = campaignObjective(value.([]byte))
	return nil
}

func (ct campaignObjective) Value() (driver.Value, error) {
	return string(ct), nil
}
