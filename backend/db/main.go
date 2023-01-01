package db

import (
	"fmt"
	"log"
	"os"

	dbModel "ads-manager/db/modeldb"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func GetEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return os.Getenv(key)
}

var (
	host     = GetEnvVariable("POSTGRES_HOST")
	username = GetEnvVariable("POSTGRES_USER")
	password = GetEnvVariable("POSTGRES_PASSWORD")
	dbName   = GetEnvVariable("POSTGRES_DB")
	port     = GetEnvVariable("POSTGRES_PORT")
)

var DB *gorm.DB

func Connect() {

	psqlHost := fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
		host,
		port,
		username,
		dbName,
		password,
	)
	database, err := gorm.Open(postgres.Open(psqlHost), &gorm.Config{})
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	} else {
		fmt.Println("connect db", database)
	}

	DB = database
}

func Close() {
	interfaceDB, err := DB.DB()
	if err != nil {
		panic("error interfacing db")
	}
	interfaceDB.Close()
}

func InitDBType() {
	DB.Exec(`
	CREATE TYPE 
		account_type 
	AS ENUM 
		('personal', 'business') ;
	`)
	DB.Exec(`
	CREATE TYPE 
		user_role 
	AS ENUM 
		('owner', 'admin', 'advertiser', 'analyst') ;
	`)
	DB.Exec(`
	CREATE TYPE 
		invitation_status 
	AS ENUM 
		('pending', 'approved', 'rejected', 'canceled') ;
	`)
	DB.Exec(`
	CREATE TYPE 
		campaign_objective 
	AS ENUM 
		('pending', 'approved', 'rejected', 'canceled') ;
	`)
	DB.Exec(`
	CREATE TYPE 
		campaign_status
	AS ENUM 
		('draft', 'team approval', 'admin approval', 'live', 
		'rejected', 'published', 'team paused', 'admin paused') ;
	`)
	DB.Exec(`
	CREATE TYPE 
		gender
	AS ENUM 
		('male', 'female') ;
	`)
	DB.Exec(`
	CREATE TYPE 
		user_actor_type
	AS ENUM 
		('member', 'admin zeus', 'approver', 'system') ;
	`)
	DB.Exec(`
	CREATE TYPE 
		campaign_interaction_type
	AS ENUM 
		('duration', 'view', 'click', 'conversion') ;
	`)
}

func RunMigrations() {

	DB.AutoMigrate(
		&dbModel.WalletAd{}, &dbModel.WalletSpentTransaction{}, &dbModel.WalletTopupTransaction{},
		&dbModel.AdsAccount{}, &dbModel.AdsAccountMember{}, &dbModel.AdsManagerInvitation{},
		&dbModel.AdsPlacement{}, &dbModel.AdsAccountReceivingDiscount{}, &dbModel.AdsAccountRestrictedPlacement{},
		&dbModel.Audience{}, &dbModel.AdsContent{}, &dbModel.PlacementContent{}, &dbModel.AdsContentPropertiesType{},
		&dbModel.Campaign{}, &dbModel.CampaignHistory{}, &dbModel.CampaignLiveInteraction{}, &dbModel.CacheToken{},
	)
}

// func InsertBulk(db *gorm.DB) {

// 	var (
// 		data       []model.AdsPlacement
// 		dataInsert []interface{}
// 		faceData   model.AdsPlacement
// 	)

// 	data = []model.AdsPlacement{
// 		{AdsPlacementID: "emitra-001", AdsPlacementName: "emitra main banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada main banner emitra, terdapat unit", IsActive: true},
// 		{AdsPlacementID: "emitra-002", AdsPlacementName: "emitra initial main page", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada initial page emitra ketika dibuka, muncul popup setengah layar", IsActive: true},
// 		{AdsPlacementID: "emitra-003", AdsPlacementName: "emitra category page product card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada emitra ketika user memilih salah satu category, berupa card product teratas", IsActive: true},
// 		{AdsPlacementID: "emitra-004", AdsPlacementName: "emitra category page banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada emitra ketika user memilih salah satu category, banner paling atas", IsActive: true},
// 		{AdsPlacementID: "emitra-005", AdsPlacementName: "emitra product recomendation product card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada rekomendasi produk, apabila produk yang diiklankan satu kategori dengan relomendasi produk page tersebut. sebuah product card", IsActive: true},
// 		{AdsPlacementID: "emitra-006", AdsPlacementName: "emitra product recomendation page banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada rekomendasi produk, apabila produk yang diiklankan satu kategori dengan relomendasi produk page tersebut. sebuah banner produk", IsActive: true},
// 		{AdsPlacementID: "eshop-001", AdsPlacementName: "eshop main banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada main banner eshop, terdapat unit", IsActive: true},
// 		{AdsPlacementID: "eshop-002", AdsPlacementName: "eshop initial main page", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada initial page eshop ketika dibuka, muncul popup setengah layar", IsActive: true},
// 		{AdsPlacementID: "eshop-003", AdsPlacementName: "eshop category page product card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada eshop ketika user memilih salah satu category, berupa card product teratas", IsActive: true},
// 		{AdsPlacementID: "eshop-004", AdsPlacementName: "eshop category page banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada eshop ketika user memilih salah satu category, banner paling atas", IsActive: true},
// 		{AdsPlacementID: "eshop-005", AdsPlacementName: "eshop product search page product card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada eshop ketika user search suatu product, content berupa card product teratas", IsActive: true},
// 		{AdsPlacementID: "eshop-006", AdsPlacementName: "eshop search page product banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada eshop ketika user search suatu product, content berupa banner", IsActive: true},
// 		{AdsPlacementID: "eshop-007", AdsPlacementName: "eshop product recomendation product card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada rekomendasi produk, apabila produk yang diiklankan satu kategori dengan rekomendasi produk page tersebut. sebuah product card", IsActive: true},
// 		{AdsPlacementID: "eshop-008", AdsPlacementName: "eshop product recomendation page banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada rekomendasi produk, apabila produk yang diiklankan satu kategori dengan relomendasi produk page tersebut. sebuah banner produk", IsActive: true},
// 		{AdsPlacementID: "eshop-009", AdsPlacementName: "eshop search toko shop card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada eshop ketika user search toko tertentu, konten berupa shop card", IsActive: true},
// 		{AdsPlacementID: "eshop-010", AdsPlacementName: "eshop search toko banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada eshop ketika user search toko tertentu, konten berupa banner", IsActive: true},
// 		{AdsPlacementID: "eshop-011", AdsPlacementName: "eshop hanya untukmu", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada home eshop section hanya untukmu. berupa sebuah banner vertikal", IsActive: true},
// 		{AdsPlacementID: "eshop-012", AdsPlacementName: "eshop cart list", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada menu cart eshop. berupa rekomendasi card product", IsActive: true},
// 		{AdsPlacementID: "eshop-013", AdsPlacementName: "eshop pilih kurir", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada saat pilih kurir, berupa banner dari usaha logistik", IsActive: true},
// 		{AdsPlacementID: "eshop-014", AdsPlacementName: "eshop pilih payment", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada saat user pilih payment, berupa banner dari usaha kategori bank/finance sejenisnya", IsActive: true},
// 		{AdsPlacementID: "efood-001", AdsPlacementName: "efood main banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada main banner efood, terdapat unit", IsActive: true},
// 		{AdsPlacementID: "efood-002", AdsPlacementName: "efood initial main page", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada initial page efood ketika dibuka, muncul popup setengah layar", IsActive: true},
// 		{AdsPlacementID: "efood-003", AdsPlacementName: "efood category page food merchant card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada efood ketika user memilih salah satu category, berupa card food merchant teratas", IsActive: true},
// 		{AdsPlacementID: "efood-004", AdsPlacementName: "efood category page banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada efood ketika user memilih salah satu category, banner paling atas", IsActive: true},
// 		{AdsPlacementID: "efood-005", AdsPlacementName: "efood product recomendation food merchant card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada efood rekomendasi produk atau makanan. berupa card food merchant", IsActive: true},
// 		{AdsPlacementID: "efood-006", AdsPlacementName: "efood product recomendation food banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada efood rekomendasi produk atau makanan. berupa banner", IsActive: true},
// 		{AdsPlacementID: "efood-007", AdsPlacementName: "efood search food card", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada efood search, ketika user search suatu keyword makanan. berupa card food di bawah suatu restoran", IsActive: true},
// 		{AdsPlacementID: "elog-001", AdsPlacementName: "elog location ads", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada maps dan memiliki sebuah koordinat, apabila diclick konten open", IsActive: true},
// 		{AdsPlacementID: "ehastag-001", AdsPlacementName: "ehastag chat ads", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada chat ehashtag, di mana user ", IsActive: true},
// 		{AdsPlacementID: "superapp-001", AdsPlacementName: "superapp interest banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada home superapp, banner yang bisa digeser-geser", IsActive: true},
// 		{AdsPlacementID: "superapp-002", AdsPlacementName: "superapp home search banner", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada laman search home superapp, banner yang bisa digeser-geser", IsActive: true},
// 		{AdsPlacementID: "superapp-003", AdsPlacementName: "superapp recorded video ads", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada laman ketika user menonton konten video hasil recorded dan uploaded, berupa streaming video vertikal satu layar penuh", IsActive: true},
// 		{AdsPlacementID: "superapp-004", AdsPlacementName: "superapp live video ads", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada laman ketika user menonton konten video live recorded dan uploaded, berupa streaming video vertikal satu layar penuh. bisa disetting oleh content creator kapan dimunculkan.", IsActive: true},
// 		{AdsPlacementID: "superapp-005", AdsPlacementName: "superapp podcast", BaseDurationCost: 0, BaseViewCost: 0, ViewCostIncrement: 0, BaseClickCost: 0, ClickCostIncrement: 0, BaseConversionCost: 0, ConversionCostIncrement: 0, DiscountPersentage: 0.0, IsDiscountAll: true, Description: "berada pada engine podcast, ", IsActive: true},
// 	}

// 	// db.Create(&data)
// 	for _, fd := range data {
// 		faceData.AdsPlacementID = fd.AdsPlacementID
// 		faceData.AdsPlacementName = fd.AdsPlacementName
// 		faceData.BaseDurationCost = fd.BaseDurationCost
// 		faceData.BaseViewCost = fd.BaseViewCost
// 		faceData.ViewCostIncrement = fd.ViewCostIncrement
// 		faceData.BaseClickCost = fd.BaseClickCost
// 		faceData.ClickCostIncrement = fd.ClickCostIncrement
// 		faceData.BaseConversionCost = fd.BaseConversionCost
// 		faceData.ConversionCostIncrement = fd.ConversionCostIncrement
// 		faceData.DiscountPersentage = fd.DiscountPersentage
// 		faceData.IsDiscountAll = fd.IsDiscountAll
// 		faceData.Description = fd.Description
// 		faceData.IsActive = fd.IsActive

// 		dataInsert = append(dataInsert, faceData)
// 	}
// 	gormbulk.BulkInsert(db, dataInsert, 3000)

// }
