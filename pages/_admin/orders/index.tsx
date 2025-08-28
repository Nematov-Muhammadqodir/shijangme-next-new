import { useMutation, useQuery } from "@apollo/client";
import { List, ListItem, Stack } from "@mui/material";
import React, { useState } from "react";
import {
  Order,
  OrderInquery,
  OrderUpdateInput,
} from "../../../libs/types/cart/order";
import { UPDATE_ORDER_BY_ADMIN } from "../../../apollo/admin/mutation";
import { GET_ALL_ORDERS_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../../libs/types/common";
import { OrderStatus } from "../../../libs/enums/order.enum";
import { sweetErrorHandling } from "../../../libs/types/sweetAlert";
import AdminOrderCard from "../../../libs/components/admin/AdminOrderCard";
import withLayoutAdmin from "../../../libs/components/layout/AdminLayout";

const Orders = ({ initialInquiry, ...props }: any) => {
  const [ordersInquiry, setOrdersInquiry] =
    useState<OrderInquery>(initialInquiry);
  const [value, setValue] = useState(
    ordersInquiry?.search.orderStatus
      ? ordersInquiry?.search.orderStatus
      : "ALL"
  );
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);

  console.log("myOrders", myOrders);
  console.log("ordersInquiryAdmin", ordersInquiry);

  //APOLLO REQUESTS
  const [updateOrderByAdmin] = useMutation(UPDATE_ORDER_BY_ADMIN);
  const {
    loading: getOrdersLoading,
    data: getOrdersData,
    error: getOrdersError,
    refetch: getOrdersRefetch,
  } = useQuery(GET_ALL_ORDERS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: ordersInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("OrderData", data?.getAllOrdersByAdmin?.list);
      setMyOrders(data?.getAllOrdersByAdmin?.list);
      setTotal(data?.getAllOrdersByAdmin?.metaCounter[0]?.total);
    },
  });
  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    switch (newValue) {
      case "ALL":
        setOrdersInquiry({
          ...ordersInquiry,
          search: {},
        });
        break;
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

  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };
  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const updateOrderHandler = async (updateData: OrderUpdateInput) => {
    console.log("updateData:", updateData);
    try {
      await updateOrderByAdmin({
        variables: { input: updateData },
      });
      menuIconCloseHandler();
      await getOrdersRefetch({ input: ordersInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };
  return (
    <div className="orders-page">
      <Stack className="orders-page-intro">
        <span className="orders-page-name">Orders Page</span>
        <span className="orders-page-desc">View and Manage All Orders</span>
      </Stack>
      <div className="top-navigation">
        <List className={"tab-menu"}>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "ALL")}
            value="ALL"
            className={value === "ALL" ? "li on" : "li"}
          >
            All
          </ListItem>
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
        </List>
      </div>
      <Stack className="order-list-main-container">
        <Stack className="member-list-header">
          <span className="mb-id">Order ID</span>
          <span className="phone">User</span>
          <span className="type">Status</span>
          <span className="state"> Order Date</span>
        </Stack>
        <Stack className="order-list-container">
          {myOrders.map((order: Order) => {
            return (
              <AdminOrderCard
                key={order._id}
                order={order}
                menuIconClickHandler={menuIconClickHandler}
                menuIconCloseHandler={menuIconCloseHandler}
                anchorEl={anchorEl}
                updateOrderHandler={updateOrderHandler}
              />
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
};

Orders.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 1000,
    search: {},
  },
};

export default withLayoutAdmin(Orders);
