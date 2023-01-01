package enum

import "database/sql/driver"

type campaignStatus string

const (
	DRAFT             campaignStatus = "draft"
	TEAM_APPROVAL     campaignStatus = "team approval"
	ADMIN_APPROVAL    campaignStatus = "admin approval"
	LIVE              campaignStatus = "live"
	CAMPAIGN_REJECTED campaignStatus = "rejected"
	PUBLISHED         campaignStatus = "published"
	TEAM_PAUSED       campaignStatus = "team paused"
	ADMIN_PAUSED      campaignStatus = "admin paused"
)

func (ct *campaignStatus) Scan(value interface{}) error {
	*ct = campaignStatus(value.([]byte))
	return nil
}

func (ct campaignStatus) Value() (driver.Value, error) {
	return string(ct), nil
}
