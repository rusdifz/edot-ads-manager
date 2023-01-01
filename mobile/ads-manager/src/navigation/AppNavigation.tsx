import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import type { BankParams } from '../pages/adsWallet/topup/topup.interfaces';

import Dashboard from '../pages/dashboard/Dashboard';
import DetailCampaign from '../pages/dashboard/detailCampaign/DetailCampaign';
import AccountSetting from '../pages/accountSetting/AccountSetting';
import ManageAccount from '../pages/manageAccount/ManageAccount';
import AdsWallet from '../pages/adsWallet/AdsWallet';
import Topup from '../pages/adsWallet/topup/Topup';
import ConfirmTopup from '../pages/adsWallet/confirmTopup/ConfirmTopup';
import Initialize from '../pages/initialize/Initialize';
import ManageAds from '../pages/manageAds/ManageAds';
import ChooseMedia from '../pages/manageAds/campaign/createCampaign/chooseMedia/ChooseMedia';
import CreateCampaign from '../pages/manageAds/campaign/createCampaign/CreateCampaign';
import CreateAudience from '../pages/manageAds/audience/createAudience/CreateAudience';
import CreateAdsContent from '../pages/manageAds/adsContent/createAdsContent/CreateAdsContent';

export type AppNavigationParams = {
  Initialize: undefined;
  Dashboard: undefined;
  DetailCampaign: undefined;
  AccountSetting: undefined;
  ManageAccount: undefined;
  AdsWallet: undefined;
  Topup: undefined;
  ConfirmTopup: {
    amount: string;
    bank: BankParams | null;
  };
  ManageAds: undefined;
  ChooseMedia: undefined;
  CreateCampaign: undefined;
  CreateAudience: undefined;
  CreateAdsContent: undefined;
};

const Stack = createStackNavigator<AppNavigationParams>();

export const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Initialize" component={Initialize} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="AccountSetting" component={AccountSetting} />
      <Stack.Screen name="ManageAccount" component={ManageAccount} />
      <Stack.Screen name="AdsWallet" component={AdsWallet} />
      <Stack.Screen name="Topup" component={Topup} />
      <Stack.Screen name="ConfirmTopup" component={ConfirmTopup} />
      <Stack.Screen name="ManageAds" component={ManageAds} />
      <Stack.Screen name="CreateCampaign" component={CreateCampaign} />
      <Stack.Screen name="CreateAudience" component={CreateAudience} />
      <Stack.Screen name="CreateAdsContent" component={CreateAdsContent} />
      <Stack.Screen name="DetailCampaign" component={DetailCampaign} />
      <Stack.Screen name="ChooseMedia" component={ChooseMedia} />
    </Stack.Navigator>
  );
};

export type AppNavigationProps = StackNavigationProp<AppNavigationParams>;
