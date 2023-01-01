package utils

type accountRole string

const (
	OWNER      accountRole = "owner"
	ADMIN      accountRole = "admin"
	ADVERTISER accountRole = "advertiser"
	ANALYST    accountRole = "analyst"
)
