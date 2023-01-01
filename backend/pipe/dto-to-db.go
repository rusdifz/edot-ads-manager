package pipe

import (
	"ads-manager/db/modeldb"
	"ads-manager/dto"
)

func CampaignInteractionDtoToDb(dtoData dto.Interaction, dbData *modeldb.CampaignLiveInteraction) {
	*dbData = modeldb.CampaignLiveInteraction{
		ID:               dtoData.ID,
		CampaignID:       dtoData.CampaignID,
		UserIdConsumer:   dtoData.UserIdConsumer,
		InteractionType:  dtoData.InteractionType,
		TotalCompetition: dtoData.TotalCompetition,
		BillCharged:      dtoData.BillCharged,
		PlacementID:      dtoData.PlacementID,
		IsCalculated:     dtoData.IsCalculated,
		CreatedAt:        dtoData.CreatedAt,
		UpdatedAt:        dtoData.UpdatedAt,
	}
}
