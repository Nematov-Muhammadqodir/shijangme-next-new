import { Box, Stack } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

import { Order, OrderItem } from "@/libs/types/cart/order";
import { formatDate } from "@/libs/types/config";

interface UserOrderCardProps {
  item: Order;
}

const UserOrderCard = (props: UserOrderCardProps) => {
  const { item } = props;
  return (
    <div className="user-order-card">
      <Stack className="image-name-cont">
        <span className="name-cont">{item._id}</span>
      </Stack>
      <span>${item.orderTotal}</span>
      <span>{item.orderStatus}</span>
      <span>{formatDate(item.createdAt)}</span>
    </div>
  );
};

export default UserOrderCard;
