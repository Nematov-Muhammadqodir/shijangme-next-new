import { Box, Button, Stack } from "@mui/material";
import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useReactiveVar } from "@apollo/client";
import { useDispatch } from "react-redux";
import { Product } from "../../types/product/product";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../types/config";
import { addItem } from "../../../slices/cartSlice";

interface TrendProductsCardProps {
  product: Product;
  likeProductHandler: any;
}

const TrendProductsCard = (props: TrendProductsCardProps) => {
  const { product, likeProductHandler } = props;
  const dispatch = useDispatch();
  const user = useReactiveVar(userVar);
  const imgPath = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : "/img/products/pinapple.png";
  return (
    <div>
      <Stack className="trend-products-card">
        <Stack className="trend-products-card-image">
          <img src={imgPath} alt="trend-products-card-image" />
          <Box
            className="like"
            onClick={() =>
              likeProductHandler(user, product._id, product.productLikes)
            }
          >
            {product.meLiked && product.meLiked[0]?.myFavorite ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </Box>
          <Box className="product-left-count">
            <span>{product.productLeftCount} items left</span>
          </Box>
        </Stack>
        <Stack className="card-info">
          <Stack>
            <Box className="card-info-name">{product.productName}</Box>
            <Box className="card-info-desc">{product.productDesc}</Box>
          </Stack>

          <Box className="card-view">
            <RemoveRedEyeIcon />
            <span>{product.productViews}</span>
          </Box>
          <Stack className="product-price">
            <span>￦{product.productPrice}</span>
            <Button
              className="cart"
              disabled={!user || !user._id}
              onClick={() =>
                dispatch(
                  addItem({
                    _id: product._id,
                    quantity: 1,
                    name: product.productName,
                    price: Number(product.productPrice),
                    image: product.productImages[0],
                    discountRate: product.productDiscountRate,
                  })
                )
              }
            >
              <AddShoppingCartIcon />
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default TrendProductsCard;
