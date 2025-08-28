import { Box, Button, Stack } from "@mui/material";
import React, { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import AddIcon from "@mui/icons-material/Add";
import { useReactiveVar } from "@apollo/client";
import { useDispatch } from "react-redux";
import { Product } from "../../types/product/product";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../types/config";
import { addItem } from "../../../slices/cartSlice";

interface NewProductCardProps {
  product: Product;
  likeProductHandler: any;
}

const NewProductCard = (props: NewProductCardProps) => {
  const { product, likeProductHandler } = props;
  const user = useReactiveVar(userVar);
  const dispatch = useDispatch();
  const imgPath = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : "/img/products/pinapple.png";
  return (
    <div>
      <Stack className="new-product-card">
        <Stack className="new-product-card-image">
          <img src={imgPath} alt="product-image" />
          <Box
            className="like"
            onClick={() =>
              likeProductHandler(user, product._id, product.productLikes)
            }
          >
            {product.meLiked && product.meLiked[0]?.myFavorite ? (
              <ThumbUpIcon />
            ) : (
              <ThumbUpOffAltIcon />
            )}
          </Box>
          <Box className="new">
            <FiberNewIcon />
          </Box>
          <Stack className="product-volume">
            <Box>{product.productVolume} Kg</Box>
          </Stack>
        </Stack>
        <Stack className="card-info">
          <Box className="product-origin">
            <span>Origin: {product.productOrigin}</span>
          </Box>
          <Stack className="product-price">
            <span>￦{product.productPrice}</span>
            <Button
              className="add-btn"
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
              <AddIcon />
            </Button>
          </Stack>
          <div className="product-name-wrapper">
            <span className="product-name">{product.productName}</span>
            <span className="product-desc">{product.productDesc}</span>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default NewProductCard;
// height: 50%;
// position: relative;
// display: flex;
// justify-content: center;
// align-items: center;
