import { gql } from "@apollo/client";

export const INVITE_MEMBER = gql`
mutation inviteMember($type: InputInviteMember!) {
  inviteMember (input: $type) {
   id,
   ads_account {
    id,
    ads_account_name,
    account_type,
  },
   role,
   ads_invitation_status,
   user_invited {
    id,
    username,
    fullname,
    username
  }
  	created_at
  }
}
`;

export const RESPOND_INVITATION = gql`
mutation respondInvitation($type: InputRespondInvitation!) {
    respondInvitation (input: $type) {
        updatedInvitation {
          id,
          ads_invitation_status
        },
        newAdsAccount {
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
            owner,
            name
          }
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
}
`

export const CANCEL_INVITATION = gql`
mutation cancelInvitation($type: InputCancelInvitation!) {
    cancelInvitation (input: $type) {
        id,
        ads_invitation_status
    }
}
`

export const REMOVE_USER = gql`
mutation removeUserFromAdsAccount($type: RemoveUserFromAdsAccount!) {
    removeUserFromAdsAccount(input: $type) {
        id
    }
}
`

export const EDIT_ROLE = gql`
mutation editUserRole($type: InputEditUserRole!) {
    editUserRole(input: $type) {
        id,
        role
    }
}
`

export const SET_APPROVER = gql`
mutation selectApprover ($type: InputSelectApprover!) {
    selectApprover(input: $type) {
        id,
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

export const UPDATE_ACCOUNT_NAME = gql`
mutation updateAdsAccountName ($type: InputEditAdsAccountName!) {
    updateAdsAccountName (input: $type) {
        id,
        ads_account_name
    } 
}
`

export const LEAVE_ACCOUNT = gql`
mutation leaveAdsAccount($type: InputLeaveAdsAccount!) {
    leaveAdsAccount(input: $type) {
        id
    }
}
`