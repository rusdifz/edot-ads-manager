package mediaapi

import (
	"ads-manager/controller/media-api/response"
	"ads-manager/service"
	"ads-manager/utils"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/gin-gonic/gin"
)

func UploadVideo(ctx *gin.Context) {
	var (
		bucket *string
		key    *string
	)

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	path := ctx.PostForm("folder")
	path = "ads-manager/" + path

	bucket = aws.String(os.Getenv("S3_BUCKET"))
	key = aws.String(path + file.Filename)

	f, openErr := file.Open()
	if openErr != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to Upload File/Video"})
		return

	}
	defer f.Close()

	session, errSession := service.MakeSession()
	if errSession != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AWS session => " + errSession.Error()})
		return

	}

	result, errUp := service.UploadObject(session, f, bucket, key)
	if errUp != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Unable To save File/Video => " + errUp.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Your File has been successfull uploaded", "file": result.Location})
}
func ReadAllObjectVideo(ctx *gin.Context) {
	var (
		obj    response.ObjectBucket
		tmpObj []response.ObjectBucket
		data   response.ListObjectBucket
		bucket *string
	)

	object := ctx.Request.URL.Query().Get("location")
	prefix := aws.String("ads-manager/" + object)
	bucket = aws.String(os.Getenv("S3_BUCKET"))

	sess, errSession := service.MakeSession()
	if errSession != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AWS session => " + errSession.Error()})
		return

	}

	result, errList := service.ListFileObject(sess, bucket, prefix)
	if errList != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Unable To read All Object => " + errList.Error()})
		return
	}

	for _, val := range result.Contents {
		if utils.CekExtensionObjextVideo(*val.Key) {
			obj.Name = utils.GetNameFileObject(*val.Key)
			obj.Key = *val.Key
			obj.Url = os.Getenv("ASW_DNS_CLOUD_FRONT") + "/" + *val.Key

			tmpObj = append(tmpObj, obj)
		}
	}

	data.ListFile = tmpObj

	if len(data.ListFile) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Object not found", "data": data})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Success Get All file", "data": data})
}
func DeleteObjectVideo(ctx *gin.Context) {
	var (
		bucket *string
		object *string
	)
	obj := ctx.Request.URL.Query().Get("file")
	bucket = aws.String(os.Getenv("S3_BUCKET"))
	object = aws.String(obj)

	sess, errSession := service.MakeSession()
	if errSession != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AWS session => " + errSession.Error()})
		return
	}

	errDel := service.DeleteFileObject(sess, bucket, object)
	if errDel != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Cannot Delete Object => " + errDel.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Your File has been deleted"})
}
