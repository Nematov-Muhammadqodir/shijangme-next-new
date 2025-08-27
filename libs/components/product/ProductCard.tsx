import { Box, Button, Stack } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Product } from "@/libs/types/product/product";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { REACT_APP_API_URL } from "@/libs/types/config";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/slices/cartSlice";

interface ProductCardProps {
  likeProductHandler: any;
  product: Product;
}

const ProductCard = (props: ProductCardProps) => {
  const dispatch = useDispatch();
  const user = useReactiveVar(userVar);
  const { likeProductHandler, product } = props;
  const productImage = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : "/img/products/mango.png";
  return (
    <div className="product-card-container">
      <Stack className="product-card">
        <Link
          href={{
            pathname: "/product/detail",
            query: { id: product?._id },
          }}
        >
          <Box className="image-container">
            <img src={productImage} alt="" />
            <Box
              className="like"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                likeProductHandler(user, product._id, product.productLikes);
              }}
            >
              {/* @ts-ignore */}
              {product?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </Box>
          </Box>
        </Link>

        <Stack className="product-info-container">
          <Link
            href={{
              pathname: "/product/detail",
              query: { id: product?._id },
            }}
          >
            <span className="product-name">{product?.productName}</span>
          </Link>
          <span className="product-desc">{product?.productDesc}</span>
          <span className="product-price">${product?.productPrice}</span>
          <Button
            className="add-btn"
            variant="contained"
            onClick={() =>
              dispatch(
                addItem({
                  _id: product._id,
                  quantity: 1,
                  price: Number(product.productPrice),
                  name: product.productName,
                  image: product?.productImages[0],
                  discountRate: product.productDiscountRate,
                })
              )
            }
          >
            <AddIcon />
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default ProductCard;
