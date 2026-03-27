import { useQuery, useReactiveVar } from "@apollo/client";
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { userVar } from "../../../apollo/store";
import { GET_MY_ORDERS } from "../../../apollo/user/query";
import { OrderStatus } from "../../enums/order.enum";
import { T } from "../../types/common";

interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: {
    itemQuantity: number;
    itemPrice: number;
    orderId: string;
    productId: string;
  }[];
}

const VendorOrders = () => {
  const user = useReactiveVar(userVar);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);

  const { loading, refetch } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 100,
        ...(statusFilter !== "ALL" && {
          search: { orderStatus: statusFilter },
        }),
      },
    },
    onCompleted: (data: T) => {
      setOrders(data?.getMyOrders?.list || []);
      setTotal(data?.getMyOrders?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAUSE":
        return "warning";
      case "PROCESS":
        return "info";
      case "FINISH":
        return "success";
      case "DELETE":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div id="vendor-orders-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Orders</Typography>
          <Typography className="sub-title">
            View and manage customer orders
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {["ALL", "PAUSE", "PROCESS", "FINISH", "DELETE"].map((s) => (
          <Chip
            key={s}
            label={s}
            onClick={() => setStatusFilter(s)}
            color={statusFilter === s ? "primary" : "default"}
            variant={statusFilter === s ? "filled" : "outlined"}
          />
        ))}
      </Stack>

      <TableContainer
        sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Delivery</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {order._id.slice(-8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      size="small"
                      color={getStatusColor(order.orderStatus) as any}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {order.orderItems?.length || 0}
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={700} color="primary">
                      ₩{order.orderTotal?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    ₩{order.orderDelivery?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Total: {total} orders
      </Typography>
    </div>
  );
};

export default VendorOrders;
