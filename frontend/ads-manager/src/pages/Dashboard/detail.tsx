import React from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Tabs } from "antd";
import DefaultLayout from "src/components/defaultLayout";
import PageHeader from "src/components/atoms/PageHeader";

const { TabPane } = Tabs;

const DetailDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { id, params } = useParams();
  // const query = new URLSearchParams(useLocation().search);
  // const uniqueId = query.get("unique-code");

  return (
    <DefaultLayout header="Ads Dashboard">
      <PageHeader title="Campaign ABC" />
      <div className="mobile-wrapper">
        <Tabs centered className="w-full px-10" tabBarGutter={80}>
          <TabPane tab={<div>Ads Details</div>} key="1" className="py-3">
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Objective</span>
              Brand Awareness
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Audience</span>
              Audience 1
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Location</span>
              DKI Jakarta, Bandung, Tangerang
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Gender</span>
              All
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Age</span>
              25-31
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Interest</span>
              Lorem Ipsum
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Description</span>
              Lorem Ipsum
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Content Name</span>
              Banner e-shop
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Placement</span>
              Banner 1080px, Caption,
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">
                Scheduled (Published Date - End Date)
              </span>
              02/09/2022 - Continuous
            </div>
            <div className="flex flex-col text-lg font-semibold mb-8">
              <span className="text-sm text-[#888888]">Budget Limit</span>
              IDR {Intl.NumberFormat("id").format(500000)}
            </div>
            <hr className="w-full h-1 bg-[#f4f4f4]" />
            <div className="flex flex-col text-lg font-semibold my-8">
              <span className="text-sm text-[#888888]">Placement 1</span>
              Banner 1080px
              <div className="img-wrapper">
                <img
                  src="/img/banner-example.png"
                  className="img-content"
                  alt="banner-1080px"
                />
              </div>
            </div>
            <hr className="w-full h-1 bg-[#f4f4f4]" />
            <div className="flex flex-col text-lg font-semibold mt-8 mb-4">
              <span className="text-sm text-[#888888]">Placement 2</span>
              Caption
              <div className="note mt-4">
                Lorem ipsum caption Lorem ipsum caption Lorem ipsum caption
              </div>
            </div>
          </TabPane>
          <TabPane tab={<div>Insight</div>} key="2" className="py-3">
            <div className="flex gap-2 pb-8 scrollbar-inner">
              <div className="primary-badge">All Placement</div>
              <div className="secondary-badge">Banner</div>
              <div className="secondary-badge">Caption</div>
              <div className="secondary-badge">Placement A</div>
              <div className="secondary-badge">Placement B</div>
              <div className="secondary-badge">Placement C</div>
              <div className="secondary-badge">Placement D</div>
              <div className="secondary-badge">Placement E</div>
            </div>
            <hr className="w-full h-1 bg-[#f4f4f4]" />
            <div className="flex flex-col text-lg font-semibold mt-8 mb-4">
              <span className="text-sm text-[#888888]">Total Durations</span>
              Caption
            </div>
            <div className="flex">
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">Total Clicks</span>
                {Intl.NumberFormat("id").format(12000)}
              </div>
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">Cost per Click</span>
                IDR {Intl.NumberFormat("id").format(560000)}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">
                  Total Conversions
                </span>
                48
              </div>
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">
                  Cost per Conversion
                </span>
                IDR {Intl.NumberFormat("id").format(200)}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">Conversion Rate</span>
                23.75%
              </div>
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">
                  Click through Rate
                </span>
                7.11%
              </div>
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Bounce Rate</span>
              2%
            </div>
            <div className="flex">
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">Total Views</span>
                {Intl.NumberFormat("id").format(3200)}
              </div>
              <div className="w-1/2 flex flex-col text-lg font-semibold mb-4">
                <span className="text-sm text-[#888888]">Cost per View</span>
                IDR {Intl.NumberFormat("id").format(200)}
              </div>
            </div>
            <div className="flex flex-col text-lg font-semibold mb-4">
              <span className="text-sm text-[#888888]">Total Spent</span>
              IDR {Intl.NumberFormat("id").format(250000)}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </DefaultLayout>
  );
};

export default DetailDashboard;
