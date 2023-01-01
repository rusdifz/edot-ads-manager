/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined, CheckOutlined } from "@ant-design/icons";

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <button type="button" className="flex items-center">
            My Shop A{" "}
            <div className="neutral-badge text-[10px] leading-[.75rem] ml-2">
              Business
            </div>
          </button>
        ),
      },
      {
        key: "2",
        label: (
          <button type="button" className="flex items-center">
            My Shop B
            <div className="neutral-badge text-[10px] leading-[.75rem] ml-2">
              Business
            </div>
          </button>
        ),
      },
      {
        key: "3",
        label: (
          <button
            type="button"
            className="flex items-center text-edot-primary justify-between w-full"
          >
            <div className="flex items-center">
              My Shop
              <div className="primary-badge text-[10px] leading-[.75rem] ml-2">
                Business
              </div>
            </div>
            <CheckOutlined />
          </button>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "4",
        label: (
          <button
            type="button"
            className="w-full rounded-[96px] bg-edot-primary text-white px-4 py-1 font-bold"
          >
            Manage Ads Account
          </button>
        ),
      },
    ]}
  />
);

const DropdownComponent: React.FC = () => {
  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <a
        onClick={(e) => e.preventDefault()}
        className="flex items-center leading-none"
      >
        My Shop
        <div className="primary-badge mx-2 text-xs">Business</div>
        <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default DropdownComponent;
