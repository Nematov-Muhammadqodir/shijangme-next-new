import { Box, Button, Stack } from "@mui/material";
import React, { useState } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import type { RootState } from "../../../store.ts";
import { useSelector, useDispatch } from "react-redux";
import { Product } from "@/libs/types/product/product.js";
import { CartItem } from "@/libs/types/search";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_PRODUCT } from "@/apollo/user/query";
import { REACT_APP_API_URL } from "@/libs/types/config";
import { addItem, removeItem, deleteItem, deleteAll } from "@/slices/cartSlice";
import { useMutation } from "@apollo/client";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { T } from "@/libs/types/common";
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
import { userVar } from "@/apollo/store";
import router from "next/router.js";

interface CartItemProps {
  cartItem: CartItem;
}

const CartItemCard = (props: CartItemProps) => {
  const { cartItem } = props;
  const [product, setProduct] = useState<Product | null>(null);
  const dispatch = useDispatch();
  const like = true;
  const user = useReactiveVar(userVar);

  const discountPrice =
    Number(product?.productPrice) -
    //@ts-ignore
    (Number(product?.productPrice) / 100) * product?.productDiscountRate;

  const total = cartItem.quantity * discountPrice;
  // APOLLO REQUESTS
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const {
    loading: getProductLoading,
    data: getProductData,
    error: getProductError,
    refetch: getProductRefetch,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "network-only",
    variables: { input: cartItem._id },
    skip: !cartItem._id,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getProduct) setProduct(data.getProduct);
    },
  });

  /** HANDLERS **/
  const likeProductHandler = async (
    user: T,
    id: string,
    likeAmount: number
  ) => {
    console.log("likeRefid", user._id);
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      // execute likeTargetProperty Mutation
      const likeResult = await likeTargetProduct({ variables: { input: id } });

      if (likeResult.data.likeTargetProduct.productLikes > likeAmount) {
        dispatch(wishListIncrement());
      } else {
        dispatch(wishListDecrement());
      }

      await getProductRefetch({ input: cartItem._id });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("Error, likeProductHandler", err);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const handleProductDetail = (id: string) => {
    router.push({ pathname: "/product/detail", query: { id: id } });
  };

  const imagePath = `${REACT_APP_API_URL}/${cartItem.image}`;

  return (
    <div className="cart-item-main">
      <Box className="cart-item-left-config">
        <Box
          className="cart-image-container"
          onClick={() => handleProductDetail(cartItem._id)}
        >
          <img
            src={cartItem.image ? imagePath : "/img/products/pinapple.png"}
            alt=""
          />
        </Box>
        <Stack className="product-detail-container">
          <span className="name">{cartItem.name}</span>
          <span className="secondary">Volume: {product?.productVolume}KG</span>
          <span className="secondary">
            Discount: {product?.productDiscountRate}%
          </span>
          <span className="secondary">
            Price: {discountPrice} W - Total: {total}
          </span>
        </Stack>
      </Box>
      <Box className="cart-item-right-config">
        <Stack className="like-delete-container">
          <Button
            className="like-container"
            onClick={() =>
              //@ts-ignore
              likeProductHandler(user, cartItem._id, product?.productLikes)
            }
          >
            {product?.meLiked && product?.meLiked[0]?.myFavorite ? (
              <FavoriteOutlinedIcon />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
          </Button>
          <Button
            className="delete-btn"
            onClick={() =>
              dispatch(
                deleteItem({
                  _id: cartItem._id,
                  quantity: 1,
                  price: cartItem.price,
                  name: cartItem.name,
                  image: cartItem.image,
                  //@ts-ignore
                  discountRate: product.productDiscountRate,
                })
              )
            }
          >
            <ClearOutlinedIcon />
          </Button>
        </Stack>
        <Stack className="qty-container">
          <div className="qty-amount">Qty: {cartItem.quantity}</div>
          <Button
            className="plus"
            onClick={() =>
              dispatch(
                addItem({
                  _id: cartItem._id,
                  quantity: 1,
                  price: cartItem.price,
                  name: cartItem.name,
                  image: cartItem.image,
                  //@ts-ignore
                  discountRate: product?.productDiscountRate,
                })
              )
            }
          >
            <AddOutlinedIcon />
          </Button>
          <Button
            className="minus"
            onClick={() =>
              dispatch(
                removeItem({
                  _id: cartItem._id,
                  quantity: 1,
                  price: cartItem.price,
                  name: cartItem.name,
                  image: cartItem.image,
                  //@ts-ignore
                  discountRate: product?.productDiscountRate,
                })
              )
            }
          >
            <RemoveOutlinedIcon />
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default CartItemCard;
