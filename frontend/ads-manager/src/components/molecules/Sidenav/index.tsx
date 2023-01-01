import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { menus } from "src/utils/menu";
import Logo from "src/assets/img/logo-edot.png";

const Sidenav: React.FC = () => {
	// const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	let path = "/" + location.pathname.split("/")[1];
	console.log(location.pathname.split("/"));

	return (
		<Layout.Sider
			// collapsible
			// collapsed={collapsed}
			// onCollapse={(value) => setCollapsed(value)}
			className='py-4 bg-edot-main'>
			<img className='logo mb-4' src={Logo} alt='logo-edot' />
			<Menu theme='dark' defaultSelectedKeys={[path]} mode='inline'>
				{menus?.map((menu) => {
					return (
						<Menu.Item key={`${[menu.redirect]}`} icon={menu?.icon}>
							<Link to={`${menu?.redirect}`}>{menu?.title}</Link>
						</Menu.Item>
					);
				})}
			</Menu>
		</Layout.Sider>
	);
};

export default Sidenav;
