package dto

type KeyValues struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type ExampleData1 struct {
	CampaignId  int    `json:"campaign_id"`
	Title       string `json:"title"`
	BannerImage string `json:"banner_image"`
	Source      string `json:"source"`
}

type ExampleData2 struct {
	CampaignId  int    `json:"campaign_id"`
	Title       string `json:"title"`
	BannerVideo string `json:"banner_video"`
	Source      string `json:"source"`
}

type ExampleData3 struct {
	CampaignId int    `json:"campaign_id"`
	Title      string `json:"title"`
	Caption    string `json:"caption"`
}

type ExampleData4 struct {
	CampaignId int    `json:"campaign_id"`
	Title      string `json:"title"`
	Product    string `json:"caption"`
	ProductID  int    `json:"product_id"`
	Source     string `json:"source"`
}
