package utils

import "os"

func GetSSODomain() string {
	stage := os.Getenv("stage")
	if stage == "prod" {
		// CHANGE TO PROD DOMAIN
		return "https://api-accounts.dev.edot.id/"
	} else {
		return "https://api-accounts.dev.edot.id/"
	}
}

func GetPaymentDomain() string {
	stage := os.Getenv("stage")
	if stage == "prod" {
		// CHANGE TO PROD DOMAIN
		return "https://epayment.dev.edot.id/"
	} else {
		return "https://epayment.dev.edot.id/"
	}
}
