import { gql } from "@apollo/client";

export const GET_CAMPAIGNS = gql`
query campaigns($filter: CampaignsFilter, 
    $limit: Int = 10,
    $offset: Int = 0
     ) {
    campaigns (filter: $filter,
    limit: $limit,
    offset: $offset
    )
  {
    id,
    ads_account_id,
    audience_id,
    ads_content_id,
    campaign_name,
    campaign_objective,
    description,
    end_date,
    budget_limit,
    campaign_status,
    updated_at,
    campaign_histories {
      id,
      reason,
      recorded_status,
      user_id_actor,
      user_type,
      updated_at
    },
    audience {
      id,
      ads_account_id,
      address,
      audience_name,
      age,
      updated_at,
      gender,
      interest,
      locations,
      campaigns {
        id,
        campaign_status
      }
    },
    ads_content {
      id,
      ads_account_id,
      ads_content_name,
      updated_at,
      campaigns {
        id,
        campaign_status
      }
      placement_contents {
        id,
        content,
        special_filter,
        cost_duration_bid,
        cost_view_bid,
        cost_click_bid,
        cost_conversion_bid,
        ads_placement_id,
        ads_content_id,
      }
    }
  }
}
`