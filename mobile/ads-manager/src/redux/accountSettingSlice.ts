import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AccountMemberType, AdsAccountType, InvitationType, RequestType, ResponseCancelInvitation, ResponseEditUserRole, ResponseLeaveAdsAccount, ResponseRemoveUser, ResponseRenameAccount, ResponseSelectApprover } from "../graphql/queries/accountSetting/accountSetting.interface"

export interface AdsAccountsStateType {
  adsAccounts: AdsAccountType[],
  selectedAdsAccount: AdsAccountType | undefined,
  myRequests: RequestType[],
  myInvitations: InvitationType[]
}

const accountSettingSlice = createSlice({
  name: "accountSetting",
  initialState: {
    adsAccounts: [] as AdsAccountType[],
    selectedAdsAccount: {} as AdsAccountType | undefined,
    myRequests: [] as RequestType[],
    myInvitations: [] as InvitationType[]
  },
  reducers: {
    setAdsAccounts(state, action: PayloadAction<AdsAccountType[]>) {
      state.adsAccounts = action.payload;
    },
    setSelectedAdsAccounts(state, action: PayloadAction<AdsAccountType | undefined>) {
      state.selectedAdsAccount = action.payload;
    },
    setMyRequests(state, action: PayloadAction<RequestType[]>) {
      state.myRequests = action.payload;
    },
    pushNewRequest(state, action: PayloadAction<RequestType>) {
      state.myRequests.push(action.payload)
    },
    setMyInvitations (state, action: PayloadAction<InvitationType[]>) {
      state.myInvitations = action.payload
    },
    resolveInvitation(state, action: PayloadAction<string>) {
      const newInvitations = state.myInvitations.filter((invitation:InvitationType) => invitation.id !== action.payload)
      state.myInvitations = newInvitations;
    },
    pushNewAdsAccount(state, action: PayloadAction<AdsAccountType>) {
      state.adsAccounts.push(action.payload);
    },
    updateStatusRequest(state, action:PayloadAction<ResponseCancelInvitation>) {
      const newState = state.myRequests.map((request:RequestType) => ({
        ...request,
        ads_invitation_status: action.payload.id === request.id ? action.payload.ads_invitation_status : request.ads_invitation_status
      }))
      state.myRequests = newState;
    },
    removeMember(state, action:PayloadAction<ResponseRemoveUser>) {
      const id = state.selectedAdsAccount?.id
      const newAdsAccount = state.adsAccounts.map((ads: AdsAccountType) => {
        const newMembers = ads.ads_account_members.filter((member: AccountMemberType) => member.id !== action.payload.id)
        if (id === ads.id) {
          state.selectedAdsAccount = {...ads, ads_account_members:newMembers};
        }
        return ({
          ...ads,
          ads_account_members: newMembers
        })
      })
      state.adsAccounts = newAdsAccount;
    },
    updateMemberRole(state, action:PayloadAction<ResponseEditUserRole>) {
      const id = state.selectedAdsAccount?.id
      const newAdsAccount = state.adsAccounts.map((ads: AdsAccountType) => {
        const newMembers = ads.ads_account_members.map((member: AccountMemberType) => ({
          ...member,
          role: member.id === action.payload.id ? action.payload.role : member.role
        }))
        if (id === ads.id) {
          state.selectedAdsAccount = {...ads, ads_account_members:newMembers};
        }
        return ({
          ...ads,
          ads_account_members: newMembers
        })
      })
      state.adsAccounts = newAdsAccount;
  },
  updateApprover(state, action:PayloadAction<ResponseSelectApprover>) {
    const newAdsAccounts = state.adsAccounts.map((ads:AdsAccountType) => {
      if (ads.id === action.payload.id) {
        state.selectedAdsAccount = {
          ...ads,
          ads_account_members: ads.id === action.payload.id ? action.payload.ads_account_members : ads.ads_account_members,
          approver_mode: ads.id === action.payload.id ? action.payload.approver_mode : ads.approver_mode
        }
      }
      return ({
        ...ads,
        ads_account_members: ads.id === action.payload.id ? action.payload.ads_account_members : ads.ads_account_members,
        approver_mode: ads.id === action.payload.id ? action.payload.approver_mode : ads.approver_mode
      })
    })
    state.adsAccounts = newAdsAccounts;
  },
  updateAccountNameState(state, action:PayloadAction<ResponseRenameAccount>) {
    const newAdsAccounts = state.adsAccounts.map((ads:AdsAccountType) => {
      if (ads.id === action.payload.id) {
        state.selectedAdsAccount = {
          ...ads,
          ads_account_name: action.payload.ads_account_name
        }
      }
      return ({
      ...ads,
      ads_account_name: ads.id === action.payload.id ? action.payload.ads_account_name : ads.ads_account_name
      })
    })
    state.adsAccounts = newAdsAccounts;
  },
  removeAdsAccountState(state, action:PayloadAction<ResponseLeaveAdsAccount>) {
    let isChanged = false;
    const newAdsAccounts = state.adsAccounts.filter((ads:AdsAccountType) => {
      if(ads.ads_account_members.some((member:AccountMemberType) => member.id === action.payload.id)) {
        if (state.selectedAdsAccount?.id === ads.id) {
          isChanged = true;
        }
        return false;
      } else {
        return true;
      }
    })
    state.adsAccounts = newAdsAccounts;
    if (isChanged) {
      state.selectedAdsAccount = newAdsAccounts[0];
    }
  }
}
})

export const { setAdsAccounts, setMyRequests, setMyInvitations, setSelectedAdsAccounts, updateMemberRole, updateAccountNameState,
pushNewRequest, resolveInvitation, pushNewAdsAccount, updateStatusRequest, removeMember, updateApprover, removeAdsAccountState } = accountSettingSlice.actions

export const accountSettingState = (state:{accountSetting: AdsAccountsStateType}) => state.accountSetting;

export default accountSettingSlice.reducer