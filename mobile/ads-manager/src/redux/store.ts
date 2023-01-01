import { configureStore } from '@reduxjs/toolkit';
import accountSettingReducer from './accountSettingSlice';
import routeReducer from './routeSlice';
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    accountSetting: accountSettingReducer,
    route: routeReducer,
    user: userReducer
  }
});