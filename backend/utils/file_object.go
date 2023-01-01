package utils

import (
	"path/filepath"
	"strings"
)

var (
	ExtVideo = []string{".mp4", ".mpeg", ".webm", ".gif", ".mkv", ".avi"}
	ExtImage = []string{".jpg", ".jpeg", ".png"}
)

func GetNameFileObject(data string) string {
	nameData := strings.Split(data, "/")
	return nameData[len(nameData)-1]
}

func CekExtensionObjextVideo(name string) bool {
	ext_file := filepath.Ext(name)
	for _, val := range ExtVideo {
		if ext_file == val {
			return true
		}
	}
	return false
}

func CekExtensionObjectImage(name string) bool {
	ext_file := filepath.Ext(name)
	for _, val := range ExtImage {
		if ext_file == val {
			return true
		}
	}
	return false
}
