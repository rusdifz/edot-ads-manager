package controllers

import (
	customtype "ads-manager/db/type"
	"ads-manager/dto"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAdsPlacement(c *gin.Context) {
	adsPlacements := []dto.AdsPlacementCoreApi{
		{ID: 1, AdsPlacementName: "eshop image banner with search and category filter",
			Description: "eshop image banner with search and category",
			ContentProperties: []customtype.AdsContentProperties{
				{Key: "title", Type: "short text", ExampleValue: "rice ball", UrlSource: "", JsonKeyId: ""},
				{Key: "banner_image", Type: "image", ExampleValue: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/image/simple-onigiri-rice-ball-snack-11.jpg", UrlSource: "", JsonKeyId: ""},
				{Key: "source", Type: "link", ExampleValue: "https://www.google.com/", UrlSource: "", JsonKeyId: ""},
			},
			SpecialFilterProperties: []customtype.AdsSpecialFilterProperties{
				{QueryParam: "search", Type: "search"},
				{QueryParam: "category", Type: "classification", UrlSource: "https://get-category-product.com", JsonKeyId: "category_id"},
			},
			IsClicked:    true,
			IsConversion: false,
			HtmlView:     "",
		},
		{ID: 2, AdsPlacementName: "eshop video banner with search",
			Description: "eshop video banner with search",
			ContentProperties: []customtype.AdsContentProperties{
				{Key: "title", Type: "short text", ExampleValue: "earth", UrlSource: "", JsonKeyId: ""},
				{Key: "banner_video", Type: "video", ExampleValue: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/video/file_example_MP4_480_1_5MG.mp4", UrlSource: "", JsonKeyId: ""},
				{Key: "source", Type: "link", ExampleValue: "https://www.google.com/", UrlSource: "", JsonKeyId: ""},
			},
			SpecialFilterProperties: []customtype.AdsSpecialFilterProperties{
				{QueryParam: "search", Type: "search", UrlSource: "", JsonKeyId: ""},
			},
			IsClicked:    true,
			IsConversion: false,
			HtmlView:     "",
		},
		{ID: 3, AdsPlacementName: "eshop text ads",
			Description: "eshop text ads",
			ContentProperties: []customtype.AdsContentProperties{
				{Key: "title", Type: "short text", ExampleValue: "lorem", UrlSource: "", JsonKeyId: ""},
				{Key: "caption", Type: "long text", ExampleValue: "lorem ipsum dolor sir amet", UrlSource: "", JsonKeyId: ""},
			},
			SpecialFilterProperties: []customtype.AdsSpecialFilterProperties{},
			IsClicked:               false,
			IsConversion:            false,
			HtmlView:                "",
		},
		{ID: 4, AdsPlacementName: "eshop sell in app product with category classification",
			Description: "eshop sell in app product with category classification",
			ContentProperties: []customtype.AdsContentProperties{
				{Key: "title", Type: "short text", ExampleValue: "cool lamp", UrlSource: "", JsonKeyId: ""},
				{Key: "banner_image", Type: "app_data", ExampleValue: `{"product_id": 10, "name": "bright lamp", "code": "SU-123"}`, UrlSource: "https://get-product.com", JsonKeyId: "product_id"},
				{Key: "source", Type: "link", ExampleValue: "shop/products?product_id=10", UrlSource: "", JsonKeyId: ""},
			},
			SpecialFilterProperties: []customtype.AdsSpecialFilterProperties{
				{QueryParam: "category", Type: "classification", UrlSource: "https://get-category-product.com", JsonKeyId: "category_id"},
			},
			IsClicked:    true,
			IsConversion: true,
			HtmlView:     "",
		},
	}
	// if err := db.DB.Find(&adsPlacements).Error; err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	if adsPlacements[0].ID > 0 {
		c.JSON(http.StatusOK, gin.H{"data": adsPlacements})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"data": nil})
		return
	}
}
