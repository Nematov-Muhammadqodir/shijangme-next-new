import { GET_PRODUCT } from "@/apollo/user/query";
import { OrderItem } from "@/libs/types/cart/order";
import { T } from "@/libs/types/common";
import { formatDate } from "@/libs/types/config";
import { Product } from "@/libs/types/product/product";
import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Fade,
  Menu,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";

interface OrderDetailCardProps {
  orderItem: OrderItem;
}

const OrderDetailCard = ({ orderItem }: OrderDetailCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const { refetch: getProductRefetch } = useQuery(GET_PRODUCT, {
    fetchPolicy: "network-only",
    skip: true, // Skip auto query, we fetch manually
  });

  const handleOpenMenu = async (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setLoadingProduct(true);

    try {
      const res = await getProductRefetch({ input: orderItem.productId });
      setProduct(res.data.getProduct);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div className="order-detail-card">
      <span className="orderId">{orderItem.productId}</span>
      <Stack className="user-config">
        <span>{orderItem.itemQuantity}</span>
      </Stack>
      <Box className="status-container">
        <Button
          className="status-change-btn badge success"
          style={{ paddingRight: "30px" }}
        >
          {orderItem.itemPrice}
        </Button>
      </Box>
      <span style={{ paddingRight: "0px" }}>
        {formatDate(orderItem.createdAt)}
      </span>

      <Button
        onClick={handleOpenMenu}
        variant="contained"
        style={{ backgroundColor: "green", color: "white" }}
      >
        View Product
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
        sx={{ p: 1 }}
        slotProps={{
          paper: {
            sx: {
              width: "400px",
              height: "100px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              border: "2px solid rgba(203, 210, 220, 0.50)",
              "& .product-detail": {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                gap: "70px",
                "& .prod-img-cont": {
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  "& img": {
                    width: "70px",
                    height: "70px",
                    border: "2px solid rgba(203, 210, 220, 0.50)",
                    borderRadius: "20px",
                  },
                  "& .prod-name": {
                    fontSize: "20px",
                  },
                },
                "& .price-cont": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                },
              },
            },
          },
        }}
      >
        <MenuItem>
          {loadingProduct ? (
            <CircularProgress size={24} />
          ) : (
            <div className="product-detail">
              <Stack className="prod-img-cont">
                <img src="/img/products/apple.png" alt="" />
                <span className="prod-name">
                  {product?.productName || "No Name"}
                </span>
              </Stack>
              <Stack className="price-cont">
                {/* @ts-ignore */}
                <span>Price</span>
                <span>
                  {product?.productPrice} /
                  {Number(product?.productPrice) -
                    (Number(product?.productPrice) / 100) *
                      Number(product?.productDiscountRate)}
                </span>
              </Stack>
            </div>
          )}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default OrderDetailCard;
