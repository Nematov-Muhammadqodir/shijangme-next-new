import { Button, Stack } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Product } from "../../types/product/product";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../types/config";
import { addItem } from "../../../slices/cartSlice";
interface HorizontalCardProps {
  product: Product;
  likeProductHandler: any;
}

const HorizontalCard = (props: HorizontalCardProps) => {
  const user = useReactiveVar(userVar);
  const { product, likeProductHandler } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const handleProductDetail = (id: string) => {
    router.push({ pathname: "/product/detail", query: { id: id } });
  };
  return (
    <div className="horizontal-card-main">
      <Stack className="horizontal-card-layout">
        <Stack
          className="card-image-container"
          onClick={() => handleProductDetail(product._id)}
        >
          <img
            src={`${REACT_APP_API_URL}/${product?.productImages[0]}`}
            alt=""
          />
        </Stack>
        <Stack className="card-detail-container">
          <span className="product-description">{product.productDesc}</span>
          <span className="product-name">{product.productName}</span>
          <div className="like-price-container">
            <span className="product-price">￦{product.productPrice}</span>
            <div
              className="like-btn-container"
              onClick={() => likeProductHandler(user, product._id)}
            >
              {product?.meLiked && product?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>
          </div>
          <Button
            className="add-to-card-btn"
            variant="contained"
            endIcon={<AddShoppingCartIcon />}
            disabled={!user || !user._id}
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
            Add To Cart
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default HorizontalCard;
