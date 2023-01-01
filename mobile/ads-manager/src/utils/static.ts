import { colors } from '../themes/colors';

export const USER_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  ADVERTISER: 'advertiser',
  ANALYST: 'analyst',
};

export const INVITATION_STATUS = {
  PENDING: 'pending',
  CANCELED: 'canceled',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const CAMPAIGN_OBJECTIVE = {
  BRAND_AWARENESS: "brand awareness",
	REACH: "reach",
	TRAFFIC: "traffic",
	CONVERSION: "conversion"
}

export const CAMPAIGN_STATUS = {
  DRAFT             : "draft",
	TEAM_APPROVAL :    "team approval",
	ADMIN_APPROVAL   : "admin approval",
	LIVE              : "live",
	CAMPAIGN_REJECTED : "rejected",
	PUBLISHED        : "published",
	TEAM_PAUSED      : "team paused",
	ADMIN_PAUSED     : "admin paused"
}

export interface roleUserType {
  id: number;
  name: string;
}

export const roleUser = [
  { id: 1, name: USER_ROLE.ANALYST },
  { id: 2, name: USER_ROLE.ADVERTISER },
  { id: 3, name: USER_ROLE.ADMIN },
  { id: 4, name: USER_ROLE.OWNER },
]; // do not change the order of this role user, it is treated as sorted from lowest authority

export const adsMenu = [
  { title: 'Ads Dashboard', screen: 'Dashboard', icon: require('../assets/icons/ads_dash.png') },
  { title: 'Manage Ads', screen: 'ManageAccount', icon: require('../assets/icons/ads_manage.png') },
  { title: 'Ads Wallet', screen: 'AdsWallet', icon: require('../assets/icons/ads_wallet.png') },
  {
    title: 'Ads Account Setting',
    screen: 'AccountSetting',
    icon: require('../assets/icons/ads_account.png'),
  },
];

export const campaignList = [
  { name: 'Select All Campaign Objectives', id: '1', color: colors.success },
  { name: 'Campaign Objective A', id: '2', color: colors.purple },
  { name: 'Campaign B', id: '3', color: colors.yellow },
  { name: 'Campaign C', id: '4', color: colors.success },
  { name: 'Campaign Objective D', id: '5', color: colors.primaryLight },
  { name: 'Campaign Objective E', id: '6', color: colors.blue1 },
  { name: 'Campaign Objective F', id: '7', color: colors.blackDim },
];

export const bankList = [
  {
    name: 'BNI Virtual Account',
    type: 'va',
    code: 'bni',
    image: require('../assets/images/bni.png'),
  },
  {
    name: 'BRI Virtual Account',
    type: 'va',
    code: 'bri',
    image: require('../assets/images/bri.png'),
  },
  {
    name: 'Permata Virtual Account',
    type: 'va',
    code: 'permata',
    image: require('../assets/images/permata.png'),
  },
  {
    name: 'Mandiri Virtual Account',
    type: 'va',
    code: 'mandiri',
    image: require('../assets/images/mandiri.png'),
  },
  { name: 'Gopay', type: 'ewallet', code: 'gopay', image: require('../assets/images/gopay.png') },
  { name: 'OVO', type: 'ewallet', code: 'ovo', image: require('../assets/images/ovo.png') },
];

export const howToPayList = [
  { title: 'ATM', description: 'Lorem ipsum' },
  { title: 'Internet Banking', description: 'Lorem ipsum' },
  { title: 'Mobile Banking', description: 'Lorem ipsum' },
];

export const campaignMenu = [
  { name: 'Select All Campaign Objectives', code: 'all' },
  { name: 'Brand Awareness', code: 'branch' },
  { name: 'Reach', code: 'reach' },
  { name: 'Trafic', code: 'trafic' },
  { name: 'Catalogue Sales', code: 'sales' },
  { name: 'Store trafic', code: 'store' },
];

export const campaignStatusMenu = [
  { name: 'Select All Status', code: 'all' },
  { name: 'Draft', code: 'draft' },
  { name: 'Pending Approval', code: 'pending' },
  { name: 'Live', code: 'live' },
  { name: 'Published', code: 'published' },
];

export const sortAdsMenu = [
  { name: 'Most Recent (Default)', code: 'default' },
  { name: 'Highest View', code: 'hview' },
  { name: 'Highest Click', code: 'hclick' },
  { name: 'Highest Conversion', code: 'hconv' },
  { name: 'Highest Spent', code: 'hspent' },
  { name: 'Lowest Spent', code: 'lspent' },
  { name: 'Lowest Cost per View', code: 'lcpv' },
  { name: 'Lowest Cost per Click', code: 'lcpc' },
  { name: 'Lowest Cost per Conversion', code: 'lcpconv' },
];

export const mediaMenu = [
  { name: 'Existing', code: 'existing' },
  { name: 'Upload', code: 'upload' },
];

export const DEFAULT_PHOTO = 'https://www.w3schools.com/howto/img_avatar.png';
