import { GET_MEMBER } from "@/apollo/user/query";
import { OrderStatus } from "@/libs/enums/order.enum";
import { Order } from "@/libs/types/cart/order";
import { formatDate, REACT_APP_API_URL } from "@/libs/types/config";
import { Member } from "@/libs/types/member/member";
import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Stack,
  Menu,
  MenuItem,
  Fade,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface AdminOrderCardProps {
  order: Order;
  menuIconClickHandler: any;
  menuIconCloseHandler: any;
  anchorEl: any;
  updateOrderHandler: any;
}
const AdminOrderCard = (props: AdminOrderCardProps) => {
  const {
    order,
    menuIconClickHandler,
    menuIconCloseHandler,
    anchorEl,
    updateOrderHandler,
  } = props;
  const [member, setMember] = useState<Member | null>(null);
  const router = useRouter();
  /** APOLLO REQUESTS **/
  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: order.memberId },
    skip: !order.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("memberData", data?.getMember);
      setMember(data?.getMember);
    },
  });

  const handleOrderDetail = (id: string) => {
    router.push({ pathname: "orders/detail", query: { id: id } });
  };

  const imagePath = member?.memberImage
    ? `${REACT_APP_API_URL}/${member?.memberImage}`
    : "/img/profile/defaultImg.jpg";
  return (
    <div
      className="admin-order-card"
      onClick={() => handleOrderDetail(order._id)}
    >
      <span className="orderId">{order._id}</span>
      <Stack className="user-config">
        <img src={imagePath} alt="" />
        <span>{member?.memberNick}</span>
      </Stack>
      <Box className="status-container">
        <Button
          onClick={(e: any) => menuIconClickHandler(e, order?._id)}
          className={"status-change-btn badge success"}
        >
          {order?.orderStatus}
        </Button>
        {order?.orderStatus === OrderStatus.PROCESS && (
          <Menu
            className={"menu-modal"}
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl[order?._id]}
            open={Boolean(anchorEl[order?._id])}
            onClose={menuIconCloseHandler}
            TransitionComponent={Fade}
            sx={{ p: 1 }}
          >
            {Object.values(OrderStatus)
              .filter(
                (ele: string) =>
                  ele !== order?.orderStatus &&
                  ele !== OrderStatus.DELETE &&
                  ele !== OrderStatus.PAUSE
              )
              .map((status: string) => (
                <MenuItem
                  onClick={() =>
                    updateOrderHandler({
                      orderId: order?._id,
                      orderStatus: status,
                    })
                  }
                  key={status}
                >
                  <Typography variant={"subtitle1"} component={"span"}>
                    {status}
                  </Typography>
                </MenuItem>
              ))}
          </Menu>
        )}
      </Box>
      <span>{formatDate(order.createdAt)}</span>
    </div>
  );
};

export default AdminOrderCard;
