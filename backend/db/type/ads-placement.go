package customtype

type AdsContentProperties struct {
	Key          string `json:"key"`
	Type         string `json:"type"`
	ExampleValue string `json:"example_value"`
	UrlSource    string `json:"url_source"`
	JsonKeyId    string `json:"json_key_id"`
}

type AdsSpecialFilterProperties struct {
	QueryParam string `json:"query_param"`
	Type       string `json:"type"`
	UrlSource  string `json:"url_source"`
	JsonKeyId  string `json:"json_key_id"`
}
