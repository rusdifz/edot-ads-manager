package utils

import (
	"time"

	"gorm.io/datatypes"
)

func SafeStringDereference(pointer *string) string {
	if pointer == nil {
		return ""
	}
	return *pointer
}

func SafeIntDereference(pointer *int, defVal_optional ...int) int {
	defVal := 0
	if len(defVal_optional) > 0 {
		defVal = defVal_optional[0]
	}
	if pointer == nil {
		return defVal
	}
	return *pointer
}

func SafeFloat64Dereference(pointer *float64, defVal_optional ...float64) float64 {
	defVal := 0.
	if len(defVal_optional) > 0 {
		defVal = defVal_optional[0]
	}
	if pointer == nil {
		return defVal
	}
	return *pointer
}

func SafeIntToUint64Pointer(pointer *int) *uint64 {
	if pointer == nil {
		return nil
	}
	result := uint64(*pointer)
	return &result
}

func SafeUint64ToIntPointer(pointer *uint64) *int {
	if pointer == nil {
		return nil
	}
	result := int(*pointer)
	return &result
}

func SafeStringToTimePointer(pointer *string) *time.Time {
	if pointer == nil {
		return nil
	}
	tmp, err := time.Parse(time.RFC3339, *pointer)
	if err != nil {
		return nil
	}
	return &tmp
}

func SafeTimeToStringPointer(pointer *time.Time) *string {
	if pointer == nil {
		return nil
	}
	tmp := pointer.Format(time.RFC3339)
	return &tmp
}

func SafeStringToJsonRawMessagePointer(pointer *string) *datatypes.JSON {
	if pointer == nil {
		return nil
	}
	tmpByte := datatypes.JSON([]byte(*pointer))
	return &tmpByte
}

func SafeJsonRawMessageToStringPointer(pointer *datatypes.JSON) *string {
	if pointer == nil {
		return nil
	}
	tmpByte := string(*pointer)
	return &tmpByte
}
