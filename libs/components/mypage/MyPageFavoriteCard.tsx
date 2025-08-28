import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Product } from "../../types/product/product";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../types/config";
import { addItem } from "../../../slices/cartSlice";

interface MyPageFavoriteCard {
  product: Product;
  likeProductHandler?: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const MyPageFavoriteCard = (props: MyPageFavoriteCard) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const { product, likeProductHandler, myFavorites, recentlyVisited } = props;
  const imagePath: string = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : "/img/products/mango.png";
  const discountPrice =
    Number(product.productPrice) -
    (Number(product.productPrice) / 100) * product.productDiscountRate;
  const dispatch = useDispatch();

  const handleProductDetail = async () => {
    await router.push({
      pathname: "/product/detail",
      query: { id: product._id },
    });
  };

  return (
    <Stack className="card-config">
      <Stack className="top">
        <div className="img-container" onClick={handleProductDetail}>
          <img src={imagePath} alt="" />
          {!recentlyVisited && (
            <Box
              className="like-btn-container"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                likeProductHandler(user, product._id, product.productLikes);
              }}
            >
              {myFavorites ? (
                <FavoriteOutlinedIcon />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </Box>
          )}

          <Box className="volume">{product.productVolume}Kg</Box>
        </div>
      </Stack>
      <Stack className="bottom">
        <span className="name">{product.productName}</span>
        <span className="desc">{product.productDesc}</span>
        <div className="price-container">
          <span className="discounted-price">￦{discountPrice.toFixed(0)}</span>
          <span className="origin-price">
            ￦{Number(product.productPrice).toFixed(0)}
          </span>
          <span className="discount-amount">
            <p>-{product.productDiscountRate}%</p>
          </span>
        </div>
        <Button
          variant="contained"
          className="add-to-cart-btn"
          endIcon={<AddShoppingCartOutlinedIcon />}
          onClick={() =>
            dispatch(
              addItem({
                _id: product._id,
                quantity: 1,
                price: Number(product.productPrice),
                name: product.productName,
                image: product.productImages[0],
                discountRate: product.productDiscountRate,
              })
            )
          }
        >
          Add To Cart
        </Button>
      </Stack>
    </Stack>
  );
};

export default MyPageFavoriteCard;
