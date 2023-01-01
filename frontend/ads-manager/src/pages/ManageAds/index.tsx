import React from "react";
import DefaultLayout from "src/components/defaultLayout";
import { Tabs } from "antd";
import Audiences from "./audience";
import Campaigns from "./campaign";
import Contents from "./content";

const { TabPane } = Tabs;

const BusinessAccount: React.FC = () => {
	return (
		<DefaultLayout header='Manage Ads'>
			<Tabs>
				<TabPane tab={<div>Campaign</div>} key='1'>
					<Campaigns />
				</TabPane>
				<TabPane tab={<div>Audience</div>} key='2'>
					<Audiences />
				</TabPane>
				<TabPane tab={<div>Ads Content</div>} key='3'>
					<Contents />
				</TabPane>
			</Tabs>
		</DefaultLayout>
	);
};

export default BusinessAccount;
