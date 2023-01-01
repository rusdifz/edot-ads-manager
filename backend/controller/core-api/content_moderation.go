package coreapi

import (
	"ads-manager/controller/core-api/response"
	"ads-manager/service"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/rekognition"
	"github.com/gin-gonic/gin"
)

func GetModerationObjectImage(ctx *gin.Context) {
	var (
		bucket  *string
		key     *string
		pathObj string
		obj     response.ModerationData
		objTmp  []response.ModerationData
		result  response.ModerationDataImage
	)

	pathObj = ctx.Request.URL.Query().Get("object")
	bucket = aws.String(os.Getenv("S3_BUCKET"))
	key = aws.String(pathObj)

	params := &rekognition.DetectModerationLabelsInput{
		Image: &rekognition.Image{
			S3Object: &rekognition.S3Object{
				Bucket: bucket,
				Name:   key,
			},
		},
		MinConfidence: aws.Float64(70),
	}

	sess, err := service.MakeSession()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AWS session => " + err.Error()})
		return
	}

	scv := rekognition.New(sess)

	detectResult, err := scv.DetectModerationLabels(params)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to detect moderation labels => " + err.Error()})
		return
	}
	fmt.Println(detectResult.ModerationLabels)
	for _, val := range detectResult.ModerationLabels {
		obj.Confidence = *val.Confidence
		obj.ParentName = *val.ParentName
		obj.Name = *val.Name

		objTmp = append(objTmp, obj)
	}
	result.ModerationLabels = objTmp

	ctx.JSON(http.StatusOK, gin.H{"message": "Success Get All file", "data": result})
}

func GetModerationObjectVideo(ctx *gin.Context) {
	var (
		bucket               *string
		key                  *string
		pathObj              string
		paginationToken      *string
		videoMeta            response.VideoMetaData
		dataModerationLabels response.DataModerationLabels
		moderationDataVideo  response.ModerationDataVideo
		status               string
	)

	pathObj = ctx.Request.URL.Query().Get("object")
	bucket = aws.String(os.Getenv("S3_BUCKET"))
	key = aws.String(pathObj)

	params := &rekognition.StartContentModerationInput{
		Video: &rekognition.Video{
			S3Object: &rekognition.S3Object{
				Bucket: bucket,
				Name:   key,
			},
		},
	}

	sess, err := service.MakeSession()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AWS session => " + err.Error()})
		return
	}

	svc := rekognition.New(sess)

	startModerationLabel, err := svc.StartContentModeration(params)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to start Video Content Moderation Analisys => " + err.Error()})
		return
	}

	startJobId := startModerationLabel.JobId

	for {
		getContentModeration, err := svc.GetContentModeration(&rekognition.GetContentModerationInput{
			JobId:     startJobId,
			SortBy:    aws.String("TIMESTAMP"),
			NextToken: paginationToken,
		})

		paginationToken = getContentModeration.NextToken

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get content moderation => " + err.Error()})
			return
		}

		if len(getContentModeration.ModerationLabels) > 0 {
			for _, val := range getContentModeration.ModerationLabels {
				dataModerationLabels.ModerationLabel.Name = *val.ModerationLabel.Name
				dataModerationLabels.ModerationLabel.Confidence = *val.ModerationLabel.Confidence
				dataModerationLabels.ModerationLabel.ParentName = *val.ModerationLabel.ParentName
				dataModerationLabels.Timestamp = *val.Timestamp

				moderationDataVideo.ModerationLabels = append(moderationDataVideo.ModerationLabels, dataModerationLabels)
			}
		}

		status = *getContentModeration.JobStatus
		if status == "FAILED" {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Unsupport codec/format", "data": moderationDataVideo})
			return
		}

		if status == "SUCCEEDED" {
			moderationDataVideo.JobStatus = *getContentModeration.JobStatus

			videoMeta.Format = getContentModeration.VideoMetadata.Format
			videoMeta.Codec = getContentModeration.VideoMetadata.Codec
			videoMeta.DurationMillis = getContentModeration.VideoMetadata.DurationMillis
			videoMeta.FrameHeight = getContentModeration.VideoMetadata.FrameHeight
			videoMeta.FrameRate = getContentModeration.VideoMetadata.FrameRate
			videoMeta.FrameWidth = getContentModeration.VideoMetadata.FrameWidth
			break
		}
	}

	moderationDataVideo.VideoMetadata = videoMeta

	ctx.JSON(http.StatusOK, gin.H{"message": "Success Get content moderation", "data": moderationDataVideo})

}
