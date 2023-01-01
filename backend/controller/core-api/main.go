package coreapi

import (
	"ads-manager/db/enum"
	customtype "ads-manager/db/type"
	"ads-manager/dto"
	"ads-manager/service"
	"fmt"
	"net/http"
	"strconv"

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
				{Key: "product", Type: "app_data", ExampleValue: `{"product_id": 10, "name": "bright lamp", "code": "SU-123"}`, UrlSource: "https://get-product.com", JsonKeyId: "product_id"},
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
		c.JSON(http.StatusOK, gin.H{"data": adsPlacements, "message": "successfully fetched placemnets data"})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"data": nil})
	}
}

func PushEventAds(c *gin.Context) {
	var temp interface{} = c.MustGet("user")
	userData := temp.(service.UserProperties)
	event := c.Param("event")
	campaign_id := c.Param("campaign_id")
	if event != string(enum.VIEW) && event != string(enum.CLICK) && event != string(enum.CONVERSION) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "event should be either view, click, and conversion"})
		c.Abort()
	}
	c.JSON(http.StatusCreated, gin.H{"message": "succesfully tracked event",
		"user": userData, "campaign_id": campaign_id, "event": event})
}

func GetCoreAdsContent(c *gin.Context) {
	var temp interface{} = c.MustGet("user")
	userData := temp.(service.UserProperties)
	search := c.Query("search")
	category := c.Query("category")
	rawLimit := c.Query("limit")
	limit, err := strconv.Atoi(rawLimit)
	if err != nil {
		fmt.Println("limit contain no string on getcoreadscontent")
		limit = 1
	}
	if limit < 1 {
		limit = 1
	}
	rawPlacement_id := c.Query("placement_id")
	placement_id, err := strconv.Atoi(rawPlacement_id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "placement id is required and must be a string integer"})
		c.Abort()
	}
	if placement_id < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "placement id must be a string integer more than 0"})
		c.Abort()
	}
	fmt.Println(placement_id)
	if placement_id != 1 && placement_id != 2 && placement_id != 3 && placement_id != 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no placement id " + fmt.Sprint(placement_id) + " found"})
		c.Abort()
	}
	location := c.Query("location")
	fmt.Println("search", search)
	fmt.Println("category", category)
	fmt.Println("location", location)

	keys := []string{rawLimit, search, category, location}
	keyValues := []dto.KeyValues{
		{Key: "limit", Value: rawLimit},
		{Key: "search", Value: search},
		{Key: "category", Value: category},
		{Key: "location", Value: location},
	}
	var filterApplied []interface{}
	for i := 0; i < len(keys); i++ {
		if len(keys[i]) > 0 {
			filterApplied = append(filterApplied, keyValues[i])
		}
	}

	rawData1 := []dto.ExampleData1{
		{CampaignId: 3456,
			Title:       "onigiri laris",
			BannerImage: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/image/simple-onigiri-rice-ball-snack-11.jpg",
			Source:      "https://google.com",
		},
		{
			CampaignId:  1256,
			Title:       "onigiri berbeda",
			BannerImage: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/image/simple-onigiri-rice-ball-snack-11.jpg",
			Source:      "https://google.com",
		},
		{
			CampaignId:  3256,
			Title:       "onigiri baru",
			BannerImage: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/image/simple-onigiri-rice-ball-snack-11.jpg",
			Source:      "https://google.com",
		},
		{
			CampaignId:  8901,
			Title:       "onigiri hebat",
			BannerImage: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/image/simple-onigiri-rice-ball-snack-11.jpg",
			Source:      "https://google.com",
		},
	}

	rawData2 := []dto.ExampleData2{
		{CampaignId: 7367,
			Title:       "moving earth",
			BannerVideo: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/video/file_example_MP4_480_1_5MG.mp4",
			Source:      "https://google.com",
		},
		{
			CampaignId:  32378,
			Title:       "rotating earth",
			BannerVideo: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/video/file_example_MP4_480_1_5MG.mp4",
			Source:      "https://google.com",
		},
		{
			CampaignId:  32367,
			Title:       "big earth",
			BannerVideo: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/video/file_example_MP4_480_1_5MG.mp4",
			Source:      "https://google.com",
		},
		{
			CampaignId:  32166,
			Title:       "small earth",
			BannerVideo: "https://ads-manager-dev.s3.ap-southeast-1.amazonaws.com/ads-manager/user/ads-account-1/video/file_example_MP4_480_1_5MG.mp4",
			Source:      "https://google.com",
		},
	}

	rawData3 := []dto.ExampleData3{
		{CampaignId: 1356,
			Title:   "lorem 1",
			Caption: "lorem ipsum dolor sit amet",
		},
		{CampaignId: 1324,
			Title:   "lorem 2",
			Caption: "lorem ipsum dolor sit amet",
		},
		{CampaignId: 3123,
			Title:   "lorem 3",
			Caption: "lorem ipsum dolor sit amet",
		},
		{CampaignId: 3231,
			Title:   "lorem 4",
			Caption: "lorem ipsum dolor sit amet",
		},
	}

	rawData4 := []dto.ExampleData4{
		{CampaignId: 8978,
			Title:     "cool lamp",
			Product:   `{"product_id": 10, "name": "cool lamp", "code": "SU-123", "image": "https://link-image"}`,
			ProductID: 10,
			Source:    "shop/products?product_id=10",
		},
		{CampaignId: 4332,
			Title:     "good lamp",
			Product:   `{"product_id": 11, "name": "good lamp", "code": "SU-321", "image": "https://link-image"}`,
			ProductID: 10,
			Source:    "shop/products?product_id=11",
		},
		{CampaignId: 3233,
			Title:     "great lamp",
			Product:   `{"product_id": 12, "name": "great lamp", "code": "SU-1223", "image": "https://link-image"}`,
			ProductID: 12,
			Source:    "shop/products?product_id=12",
		},
		{CampaignId: 2313,
			Title:     "luxury lamp",
			Product:   `{"product_id": 15, "name": "luxury lamp", "code": "SU-446", "image": "https://link-image"}`,
			ProductID: 15,
			Source:    "shop/products?product_id=15",
		},
	}
	var data4 []dto.ExampleData4
	fmt.Println(rawData4, len(rawData4))
	for i := 0; i < limit && i < len(rawData4); i++ {
		fmt.Println(i)
		data4 = append(data4, rawData4[i])
	}
	var data3 []dto.ExampleData3
	for i := 0; i < limit && i < len(rawData3); i++ {
		data3 = append(data3, rawData3[i])
	}
	var data2 []dto.ExampleData2
	for i := 0; i < limit && i < len(rawData2); i++ {
		data2 = append(data2, rawData2[i])
	}
	var data1 []dto.ExampleData1
	for i := 0; i < limit && i < len(rawData1); i++ {
		data1 = append(data1, rawData1[i])
	}
	fmt.Sprintln(data1)
	fmt.Sprintln(data2)
	fmt.Sprintln(data3)
	fmt.Sprintln(data4)
	if placement_id == 1 {
		c.JSON(http.StatusCreated, gin.H{"message": "succesfully fetched content ads for placement " + fmt.Sprint(placement_id),
			"data":           data1,
			"filter_applied": filterApplied,
			"user":           userData,
		})
	} else if placement_id == 2 {
		c.JSON(http.StatusCreated, gin.H{"message": "succesfully fetched content ads for placement " + fmt.Sprint(placement_id),
			"data":           data2,
			"filter_applied": filterApplied,
			"user":           userData,
		})
	} else if placement_id == 3 {
		c.JSON(http.StatusCreated, gin.H{"message": "succesfully fetched content ads for placement " + fmt.Sprint(placement_id),
			"data":           data3,
			"filter_applied": filterApplied,
			"user":           userData,
		})
	} else if placement_id == 4 {
		c.JSON(http.StatusCreated, gin.H{"message": "succesfully fetched content ads for placement " + fmt.Sprint(placement_id),
			"data":           data4,
			"filter_applied": filterApplied,
			"user":           userData,
		})
	}
}
