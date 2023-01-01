import { Divider, List, Skeleton } from "antd";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type ItemsType = {
  name?: string;
  type?: string;
  from?: string;
  balance?: number;
  amount?: number;
};

type DataType = {
  title?: string;
  items?: ItemsType[];
};

const CustomList: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<DataType[]>([]);

  const loadMoreData = React.useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    // fetch(
    // 	"https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    // )
    // 	.then((res) => res.json())
    // 	.then((body) => {
    // 		setData([...data, ...body.results]);
    // 		setLoading(false);
    // 	})
    // 	.catch(() => {
    // 		setLoading(false);
    // 	});
    setTimeout(() => {
      setData([
        {
          title: "July 27",
          items: [
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
            {
              name: "Ads Spending",
              type: "payout",
              from: "Campaign B",
              balance: 200000,
              amount: 3300000,
            },
            {
              name: "Ads Spending",
              type: "payout",
              from: "via Bank BCA",
              balance: 500000,
              amount: 3500000,
            },
          ],
        },
        {
          title: "July 20",
          items: [
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
            {
              name: "Top Up",
              type: "income",
              from: "via Bank BCA",
              balance: 5300000,
              amount: 2000000,
            },
          ],
        },
      ]);
      setLoading(false);
    }, 3000);
  }, [loading]);

  React.useEffect(() => {
    loadMoreData();
  }, [loadMoreData]);

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 500,
        overflow: "hidden",
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 10}
        loader={<Skeleton paragraph={{ rows: 2 }} active />}
        scrollableTarget="scrollableDiv"
      >
        {data.map((val, index) => {
          return (
            <List
              key={index}
              header={<div className="text-sm px-2">{val?.title}</div>}
              dataSource={val?.items}
              renderItem={(item, idx) => (
                <List.Item
                  key={idx + 1}
                  className="flex items-center justify-between px-2"
                >
                  <div>
                    <h4 className="text-base">{item?.name}</h4>
                    <span
                      className="text-xs font-normal"
                      style={{ color: "#666666" }}
                    >
                      {item?.from}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={item?.type}>
                      {`${
                        item?.type === "income" ? "+" : "-"
                      }Rp${Intl.NumberFormat("id").format(
                        Number(item?.amount)
                      )}`}
                    </p>
                    <span
                      className="text-xs font-normal"
                      style={{ color: "#666666" }}
                    >
                      Balance:
                      {Intl.NumberFormat("id").format(Number(item?.balance))}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default CustomList;
