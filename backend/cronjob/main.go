package cronjob

import (
	"time"

	"github.com/go-co-op/gocron"
)

func RunCronJobs() {
	s := gocron.NewScheduler(time.UTC)

	CheckAndUpdateTopup(s)
	BillAds(s)

	s.StartAsync()
}
