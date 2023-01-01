import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const routeSlice = createSlice({
  name: "route",
  initialState: {
    name: ""
  },
  reducers: {
    setRouteName(state, action: PayloadAction<string>) {
      state.name = action.payload
    },
  }
})

export const { setRouteName } = routeSlice.actions

export const routeState = (state: {route: {name: string}}) => state.route;

export default routeSlice.reducer