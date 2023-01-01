import React from "react";
// import { connect } from 'react-redux';
import { Route, Routes, BrowserRouter } from "react-router-dom";

// import { routeAll } from './navigations';
// import { PrivateRouter, ReverseRouter } from "../middleware/credentials";
// import { Login } from "../component/Auth/Login";
// import { Register } from "../component/Auth/Register";
// import { ForgetPassword } from "../component/Auth/ForgetPassword";
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

const Routers = () => {
	// const token = localStorage.getItem("token");
	// const role = localStorage.getItem("role");

	// const setRoutes = () => {
	//   switch (role) {
	//     case "admin":
	//       return routeAll(token);
	//     default:
	//       return routeAll(token);
	//   }
	// };

	return (
		<BrowserRouter>
			<Routes>
				{/* {setRoutes()?.map((items, index) => (
          <Route
            key={index}
            path={items.path}
            element={<PrivateRouter>{items.component}</PrivateRouter>}
          />
        ))} */}
				{/* <Route
          path="/login"
          element={
            <ReverseRouter>
              <Login />
            </ReverseRouter>
          }
        />
        <Route
          path="/register"
          element={
            <ReverseRouter>
              <Register />
            </ReverseRouter>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ReverseRouter>
              <ForgetPassword />
            </ReverseRouter>
          }
        /> */}
				<Route path='/' element={<AccountSetting />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/dashboard/detail/:id' element={<DashboardDetail />} />
				<Route path='/manage-ads' element={<ManageAds />} />
				<Route path='/manage-ads/content/add' element={<ContentAdd />} />
				<Route path='/manage-ads/audience/add' element={<AudienceAdd />} />
				<Route path='/manage-ads/campaign/add' element={<CampaignAdd />} />
				<Route path='/ads-wallet' element={<AdsWallet />} />
				<Route path='/ads-wallet/topup' element={<Topup />} />
				<Route path='/business-account' element={<BusinessAccount />} />
			</Routes>
		</BrowserRouter>
	);
};

// const mapStateToProps = ({ reducerAuth }: any) => {
//   return { ...reducerAuth };
// };

// export const Routers = connect(mapStateToProps)(_Routers);
export default Routers;

// _Routers.propTypes = {};
