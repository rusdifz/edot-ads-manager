import React from "react";
import { Layout } from "antd";
import DropdownComponent from "./molecules/Drowdown";
import Sidenav from "./molecules/Sidenav";
import "../styles/style.css";

type Props = {
  children?: React.ReactNode;
  header?: React.ReactNode;
};

const { Content, Header } = Layout;

const DefaultLayout: React.FC<Props> = ({ children, header }) => {
  return (
    <Layout className="container-layout">
      <Sidenav />
      <Layout className="site-layout">
        <Header className="flex justify-between edot-header">
          <div className="header-title">{header}</div>
          <div className="flex justify-end">
            <DropdownComponent />
          </div>
        </Header>
        <Content style={{ padding: "32px 28px", overflowX: "auto" }}>
          <div className="site-layout-content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
