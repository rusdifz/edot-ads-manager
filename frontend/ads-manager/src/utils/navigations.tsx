import React from "react";
import Dashboard from "src/pages/Dashboard";
import DashboardDetail from "src/pages/Dashboard/detail";
import AccountSetting from "src/pages/AccountSetting";
import ManageAds from "src/pages/ManageAds";
import BusinessAccount from "src/pages/BusinessAccount";
import AdsWallet from "src/pages/Wallet";
import Topup from "src/pages/Wallet/topup";
import ContentAdd from "src/pages/ManageAds/content/add";
import AudienceAdd from "src/pages/ManageAds/audience/add";
import CampaignAdd from "src/pages/ManageAds/campaign/add";

export const routeAll = () => {
	return [
		{
			path: "/dashboard",
			private: true,
			component: <Dashboard />,
		},
		{
			path: "/dashboard/detail/:id",
			private: true,
			component: <DashboardDetail />,
		},
		{
			path: "/",
			private: true,
			component: <AccountSetting />,
		},
		{
			path: "/manage-ads",
			private: true,
			component: <ManageAds />,
		},
		{
			path: "/manage-ads/content/add",
			private: true,
			component: <ContentAdd />,
		},
		{
			path: "/manage-ads/audience/add",
			private: true,
			component: <AudienceAdd />,
		},
		{
			path: "/manage-ads/campaign/add",
			private: true,
			component: <CampaignAdd />,
		},
		{
			path: "/ads-wallet",
			private: true,
			component: <AdsWallet />,
		},
		{
			path: "/ads-wallet/topup",
			private: true,
			component: <Topup />,
		},
		{
			path: "/business-account",
			private: true,
			component: <BusinessAccount />,
		},
	];
};
