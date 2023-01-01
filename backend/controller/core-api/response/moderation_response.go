package response

type ModerationData struct {
	Confidence float64 `json:"confidence"`
	Name       string  `json:"name"`
	ParentName string  `json:"parent_name"`
}

type ModerationDataImage struct {
	ModerationLabels []ModerationData `json:"moderation_labels"`
}

type VideoMetaData struct {
	Codec          *string  `json:"codec"`
	DurationMillis *int64   `json:"duration_millis"`
	Format         *string  `json:"format"`
	FrameHeight    *int64   `json:"frame_height"`
	FrameRate      *float64 `json:"frame_rate"`
	FrameWidth     *int64   `json:"frame_width"`
}

type DataModerationLabels struct {
	ModerationLabel ModerationData `json:"moderation_label"`
	Timestamp       int64          `json:"timestamp"`
}

type ModerationDataVideo struct {
	JobStatus        string                 `json:"job_status"`
	ModerationLabels []DataModerationLabels `json:"moderation_labels"`
	NextToken        string                 `json:"next_token"`
	VideoMetadata    VideoMetaData          `json:"video_metadata"`
}
