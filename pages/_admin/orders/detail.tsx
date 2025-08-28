import { useQuery } from "@apollo/client";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { OrderItem } from "../../../libs/types/cart/order";
import { GET_ALL_ORDER_ITEMS_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../../libs/types/common";
import withLayoutAdmin from "../../../libs/components/layout/AdminLayout";
import OrderDetailCard from "../../../libs/components/admin/OrderDetailCard";

const AdminOrderDetail = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[] | []>([]);
  console.log("orderItemsSSS", orderItems);

  const {
    loading: getOrderItemsLoading,
    data: getOrderItemsData,
    error: getOrderItemsError,
    refetch: getOrderItemsRefetch,
  } = useQuery(GET_ALL_ORDER_ITEMS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: orderId },
    skip: !orderId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("orderItemData", data.getAllOrderItemsByAdmin);
      if (data?.getAllOrderItemsByAdmin)
        setOrderItems(data.getAllOrderItemsByAdmin);
    },
  });

  //LIFECYCLES

  useEffect(() => {
    if (router.query.id) {
      setOrderId(router.query.id as string);
    }
  }, [router]);
  return (
    <div className="admin-order-detail">
      <Stack className="admin-page-intro">
        <span className="admin-page-name">Orders Page</span>
        <span className="admin-page-desc">View and Manage All Orders</span>
      </Stack>

      <Stack className="order-item-list-main-container">
        <Stack className="member-list-header">
          <span className="mb-id">Product ID</span>
          <span className="phone">Item Qty</span>
          <span className="type">Item Price</span>
          <span className="state"> Order Date</span>
          <span className="state" style={{ fontWeight: "600", color: "green" }}>
            View Product
          </span>
        </Stack>
        <Stack className="order-list-container">
          {orderItems.map((orderItem: OrderItem) => {
            return (
              <OrderDetailCard orderItem={orderItem} key={orderItem._id} />
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
};

export default withLayoutAdmin(AdminOrderDetail);
