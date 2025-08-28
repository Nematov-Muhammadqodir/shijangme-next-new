import { useQuery } from "@apollo/client";
import { List, ListItem, Stack } from "@mui/material";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { T } from "../../libs/types/common";
import { Order, OrderInquery } from "../../libs/types/cart/order";
import { GET_MY_ORDERS } from "../../apollo/user/query";
import { OrderStatus } from "../../libs/enums/order.enum";
import UserOrderCard from "../../libs/components/order/UserOrderCard";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Orderr: NextPage = ({ initialInquiry, ...props }: any) => {
  const [ordersInquiry, setOrdersInquiry] =
    useState<OrderInquery>(initialInquiry);
  const [value, setValue] = useState(
    ordersInquiry?.search.orderStatus
      ? ordersInquiry?.search.orderStatus
      : "PROCESS"
  );
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);

  //APOLLO REQUESTS
  const {
    loading: getOrdersLoading,
    data: getOrdersData,
    error: getOrdersError,
    refetch: getOrdersRefetch,
  } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: "network-only",
    variables: { input: ordersInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("OrderData", data?.getMyOrders?.list);
      setMyOrders(data?.getMyOrders?.list);
      setTotal(data?.getMyOrders?.metaCounter[0]?.total);
    },
  });
  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    switch (newValue) {
      case "PROCESS":
        setOrdersInquiry({
          ...ordersInquiry,
          search: { orderStatus: OrderStatus.PROCESS },
        });
        break;
      case "FINISH":
        setOrdersInquiry({
          ...ordersInquiry,
          search: { orderStatus: OrderStatus.FINISH },
        });
        break;
      case "DELETE":
        setOrdersInquiry({
          ...ordersInquiry,
          search: { orderStatus: OrderStatus.DELETE },
        });
        break;

      default:
        setOrdersInquiry({ ...ordersInquiry });
        break;
    }
  };

  return (
    <div className="order-page">
      <Stack className="order-page-intro">
        <span className="order-page-name">Order Page</span>
        <span className="order-page-desc">View All Your Orders Here</span>
      </Stack>
      <div className="top-navigation">
        <List className={"tab-menu"}>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "PROCESS")}
            value="PROCESS"
            className={value === "PROCESS" ? "li on" : "li"}
          >
            Process
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "FINISH")}
            value="FINISH"
            className={value === "FINISH" ? "li on" : "li"}
          >
            Finished
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "DELETE")}
            value="DELETE"
            className={value === "DELETE" ? "li on" : "li"}
          >
            Deleted
          </ListItem>
        </List>
      </div>
      <Stack className="order-list-main-container">
        <Stack className="member-list-header">
          <span className="mb-id">Order ID</span>
          <span className="phone">Order Price</span>
          <span className="type">Status</span>
          <span className="state"> Order Date</span>
        </Stack>
        <Stack className="order-list-container">
          {myOrders.map((item: Order) => {
            return <UserOrderCard item={item} key={item._id} />;
          })}
        </Stack>
      </Stack>
    </div>
  );
};

Orderr.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 1000,
    search: {
      orderStatus: OrderStatus.PROCESS,
    },
  },
};

export default Orderr;
