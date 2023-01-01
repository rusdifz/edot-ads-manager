export interface UserType {
    id: string,
    fullname: string,
    username: string,
    profile_picture: string | null
  }
  
  interface Business {
    id: string,
    name: string,
    owner: number
  }
  
  export interface AccountMemberType {
    id: string,
    role: string,
    is_approver: string,
    is_me: boolean,
    user: UserType
  }
  
  export interface AdsAccountType {
    id: string,
    ads_account_name: string,
    account_type: string,
    user: UserType,
    business: Business,
    approver_mode: boolean,
    ads_account_members: AccountMemberType[]
  }
  
  export interface MyAdsAccountType {
    myAdsAccount: AdsAccountType[]
  }
  
  export interface InvitationType {
    id: string,
      ads_account: {
        id: string,
        ads_account_name: string
      },
      role: string,
      user_inviter: UserType,
      updated_at: string
  }
  
  export interface MyInvitationType {
    myAccountInvitation: InvitationType[]
  }
  
  export interface RequestType {
      id: string,
      ads_account: {
        id: string,
        ads_account_name: string
      },
      role: string,
      ads_invitation_status: string,
      user_invited: UserType,
      created_at: string
  }
  
  export interface MyRequestType {
    myAccountRequest: RequestType[]
  }
  
  export interface AllUserType {
    listUser: UserType[]
  }

  export interface InputInviteMember {
    userIdInvited: number,
    role: string,
    adsAccountId: number
}

export interface InputRespondInvitation {
    adsInvitationId: number,
    isApprove: boolean
}

export interface InputCancelInvitation {
    adsInvitationId: number
}

export interface ResponseRespondInvitation {
    updatedInvitation: {
        id : string,
        ads_invitation_status: string
    },
    newAdsAccount: AdsAccountType | null
}

export interface ResponseCancelInvitation {
    id: string,
    ads_invitation_status: string
}

export interface InputRemoveUser {
    adsAccountId : string,
    userId: number
}

export interface ResponseRemoveUser {
    id: string
}

export interface InputEditUserRole {
    adsAccountId: number,
    userId: number,
    userRole: string
}

export interface ResponseEditUserRole {
    id: string,
    role: string
}

export interface InputSelectApprover {
    adsMemberId: string,
    isDisable: boolean
}

export interface ResponseSelectApprover {
    id: string
    approver_mode: boolean,
    ads_account_members: AccountMemberType[]
}

export interface InputRenameAccount {
    adsAccountId: string,
    adsAccountName: string
}

export interface ResponseRenameAccount {
    id: string,
    ads_account_name: string
}

export interface InputLeaveAdsAccount {
    adsAccountId: number
}

export interface ResponseLeaveAdsAccount {
    id: string
}