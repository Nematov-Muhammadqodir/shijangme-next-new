//@ts-nocheck
import withLayoutMain from "@/libs/components/layout/LayoutHome";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import { cartItemsValue, deleteAll } from "@/slices/cartSlice";
import CartItemCard from "@/libs/components/cart/CartItem";
import { useMutation, useReactiveVar } from "@apollo/client";
import { CREATE_ORDER, LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { T } from "@/libs/types/common";
import { useSelector, useDispatch } from "react-redux";
import { Message } from "@/libs/enums/common.enum";
import {
  wishListDecrement,
  wishListIncrement,
  resetWishListAmount,
  wishListValue,
} from "@/slices/wishListSlice";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/libs/types/sweetAlert";
import { CartItem } from "@/libs/types/search";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { userVar } from "@/apollo/store";
import { OrderItemsInput } from "@/libs/types/order/order";
import { OrderItemInput } from "@/libs/types/cart/order";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Cart = () => {
  const cartItems = useSelector(cartItemsValue);
  console.log("cartItemsValue", cartItems.length);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const user = useReactiveVar(userVar);
  const totalItems = cartItems.reduce((acc: number, cur: CartItem) => {
    return acc + cur.quantity;
  }, 0);
  const totalPrice = cartItems.reduce((acc: number, cur: CartItem) => {
    return acc + cur.quantity * cur.price;
  }, 0);
  const discountedPrice = cartItems.reduce((acc: number, cur: CartItem) => {
    console.log("currentItemInCart", cur);
    return (
      acc + cur.quantity * (cur.price - (cur.price / 100) * cur.discountRate)
    );
  }, 0);
  const router = useRouter();

  //APOLLO REQUESTS
  const [createOrder] = useMutation(CREATE_ORDER);

  console.log("discountedPrice", discountedPrice);

  const earnedAmount = totalPrice - discountedPrice;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Render a fallback or nothing on server and during hydration
    return <p>Loading...</p>; // or return null
  }

  const proceedOrderHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      const orderItems: OrderItemInput[] = cartItems.map(
        (cartItem: CartItem) => {
          return {
            itemQuantity: cartItem.quantity,
            itemPrice:
              cartItem.price - (cartItem.price / 100) * cartItem.discountRate,
            productId: cartItem._id,
          };
        }
      );

      console.log("orderItemsInput", orderItems);
      await createOrder({
        variables: { input: { ordertItemInputs: orderItems } },
      });

      dispatch(deleteAll());

      router.push({ pathname: "mypage", query: { category: "order" } });
    } catch (error) {
      console.log("Error proceedOrderHandler", error);
      sweetMixinErrorAlert(Message.CREATE_ORDER_FAILED);
    }
  };
  return (
    <div className="main-cart-container">
      <Stack className="container">
        <Box className="cart-intro">
          <Typography variant="h2" className="main">
            Your Cart
          </Typography>
          <Typography className="products-amount">
            {cartItems.length} Products in Your cart
          </Typography>
        </Box>

        <Stack className="cart-layout-main">
          <Stack className="left-config">
            {cartItems.map((cartItem) => {
              return <CartItemCard key={cartItem._id} cartItem={cartItem} />;
            })}
          </Stack>
          <Stack className="right-config">
            <Stack className="top-config">
              <Stack className="row">
                <span className="key">{totalItems} items:</span>
                <span className="value">￦{totalPrice}</span>
              </Stack>
              <Stack className="row">
                <span className="key">Delivery cost:</span>
                <span className="value">Unavailable</span>
              </Stack>
              <Stack className="row">
                <span className="key">Tax:</span>
                <span className="value">0</span>
              </Stack>
              <Stack className="row">
                <span className="key">Discount:</span>
                <span className="value">-￦{earnedAmount}</span>
              </Stack>
            </Stack>
            <div className="divider"></div>
            <Stack className="total-price-container">
              <span className="desc">Total:</span>
              <span className="amount">￦{totalPrice - earnedAmount}</span>
            </Stack>
            <Button
              variant="contained"
              className="checkout-btn"
              endIcon={<CreditScoreOutlinedIcon />}
              onClick={proceedOrderHandler}
            >
              Checkout
            </Button>
            <Button
              variant="contained"
              className="remove-all"
              endIcon={<DeleteForeverIcon />}
              onClick={() => dispatch(deleteAll())}
            >
              Remove all
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default withLayoutMain(Cart);
