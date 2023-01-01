import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { UserType } from "../graphql/queries/accountSetting/accountSetting.interface"

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: [] as UserType[]
  },
  reducers: {
    setUserList(state, action: PayloadAction<UserType[]>) {
      state.data = action.payload
    },
  }
})

export const { setUserList } = userSlice.actions

export const usersState = (state: {user: {data: UserType[]}}) => state.user;

export default userSlice.reducer