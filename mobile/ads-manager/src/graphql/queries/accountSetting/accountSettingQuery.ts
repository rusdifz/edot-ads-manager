import { gql } from "@apollo/client";

export const GET_MY_ADS_ACCOUNT = gql`
query {
  myAdsAccount {
    id,
    ads_account_name,
    account_type,
    user {
      id,
      fullname,
      username,
      profile_picture
    },
    business {
      id,
      name,
      owner
    },
    approver_mode,
    ads_account_members {
      id,
      role,
      is_approver,
      is_me,
      user {
        id,
        fullname,
      	username,
        profile_picture
      }
    }
  }
}
`

export const GET_MY_ACCOUNT_INVITATION = gql`
query {
	myAccountInvitation {
    id,
    ads_account {
      id,
      ads_account_name
    },
    role,
    user_inviter {
    	id,
      fullname,
      username,
      profile_picture
    },
    updated_at,
  }
}
`

export const GET_MY_ACCOUNT_REQUEST = gql`
query {
	myAccountRequest {
    id,
    ads_account {
      id,
      ads_account_name
    },
    role,
    ads_invitation_status,
    user_invited {
      id,
      username,
      fullname,
      profile_picture
    },
    created_at
  }
}
`

export const GET_ALL_USER = gql `
query {
	listUser {
    id,
    fullname,
    username
  }
}
`