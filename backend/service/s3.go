package service

import (
	"mime/multipart"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

func MakeSession() (*session.Session, error) {
	AccessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	SecretAccessKey := os.Getenv("AWS_SECRET_ACCESS_KEY")

	creds := credentials.NewStaticCredentials(AccessKey, SecretAccessKey, "")
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(os.Getenv("AWS_REGION")),
		Credentials: creds,
	})
	if err != nil {
		return nil, err
	}

	return sess, nil
}

func UploadObject(sess *session.Session, file multipart.File, bucket *string, key *string) (*s3manager.UploadOutput, error) {
	uploader := s3manager.NewUploader(sess)

	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: bucket,
		Key:    key,
		Body:   file,
		ACL:    aws.String("public-read"),
	})

	if err != nil {
		return nil, err
	}

	return result, nil
}

func ListFileObject(sess *session.Session, bucket *string, object *string) (*s3.ListObjectsV2Output, error) {
	client := s3.New(sess)

	resp, err := client.ListObjectsV2(&s3.ListObjectsV2Input{
		Bucket: bucket,
		Prefix: object,
	})

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func DeleteFileObject(sess *session.Session, bucket, object *string) error {
	client := s3.New(sess)

	_, err := client.DeleteObject(&s3.DeleteObjectInput{
		Bucket: bucket,
		Key:    object,
	})

	if err != nil {
		return err
	}

	errSnip := client.WaitUntilObjectNotExists(&s3.HeadObjectInput{
		Bucket: bucket,
		Key:    object,
	})
	if errSnip != nil {
		return errSnip
	}

	return nil
}

func GetPresignerUrl(sess *session.Session, bucket, key *string) (string, error) {
	client := s3.New(sess)

	req, _ := client.GetObjectRequest(&s3.GetObjectInput{
		Bucket: bucket,
		Key:    key,
	})

	urlStr, err := req.Presign(15 * time.Minute)
	if err != nil {
		return "", err
	}
	return urlStr, nil
}
