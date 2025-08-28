import { Box, Stack } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { formatDate } from "../../types/config";
import { Order } from "../../types/cart/order";

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
      <span>${item.orderTotal}</span>s<span>{item.orderStatus}</span>
      <span>{formatDate(item.createdAt)}</span>
    </div>
  );
};

export default UserOrderCard;
