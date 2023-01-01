package response

type ObjectBucket struct {
	Name string `json:"name_object"`
	Key  string `json:"key_object"`
	Url  string `json:"url_object"`
}

type ListObjectBucket struct {
	ListFile []ObjectBucket `json:"list_file"`
}
