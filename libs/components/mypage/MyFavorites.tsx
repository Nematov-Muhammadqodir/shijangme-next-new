import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Pagination, Stack, Typography } from "@mui/material";
import { T } from "../../types/common";
import { useMutation, useQuery } from "@apollo/client";
import { Message } from "../../enums/common.enum";
import MyPageFavoriteCard from "./MyPageFavoriteCard";
import { useSelector, useDispatch } from "react-redux";
import {
  resetWishListAmount,
  wishListDecrement,
  wishListIncrement,
  wishListValue,
} from "../../../slices/wishListSlice";
import { LIKE_TARGET_PRODUCT } from "../../../apollo/user/mutation";
import { GET_FAVORITES } from "../../../apollo/user/query";
import ScrollFade from "../common/MotionWrapper";
import { Product } from "../../types/product/product";

const MyFavorites: NextPage = () => {
  const [myFavorites, setMyFavorites] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFavorites, setSearchFavorites] = useState<T>({
    page: 1,
    limit: 6,
  });
  const dispatch = useDispatch();
  const wishListAmount = useSelector(wishListValue);

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const {
    loading: loadingFavorites,
    error: errorFavorites,
    data: dataFavorites,
    refetch: refetchFavorites,
  } = useQuery(GET_FAVORITES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: searchFavorites.page,
        limit: searchFavorites.limit,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getFavorites) {
        setMyFavorites(data.getFavorites.list);
        setTotal(data.getFavorites.metaCounter[0].total);
      }
    },
  });

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFavorites({ ...searchFavorites, page: value });
    // Optional: window.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const likeProductHandler = async (
    user: any,
    productId: string,
    likeAmount: number
  ) => {
    try {
      if (!user) throw new Error(Message.NOT_AUTHENTICATED);
      const likeResult = await likeTargetProduct({
        variables: {
          input: productId,
        },
      });
      if (likeResult.data.likeTargetProduct.productLikes > likeAmount) {
        dispatch(wishListIncrement());
      } else {
        dispatch(wishListDecrement());
      }
      await refetchFavorites();
      console.log("likeProductHandler");
    } catch (err: any) {
      console.error("Error liking product:", err);
    }
  };

  // Read from localStorage on mount
  useEffect(() => {
    const storedAmount = localStorage.getItem("wishListAmount");
    if (storedAmount !== null) {
      dispatch(resetWishListAmount(Number(storedAmount)));
    }
  }, [dispatch]);

  // Write to localStorage whenever wishListAmount changes
  useEffect(() => {
    localStorage.setItem("wishListAmount", String(wishListAmount));
  }, [wishListAmount]);

  return (
    <div id="my-favorites-page">
      <ScrollFade>
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">My Favorites</Typography>
            <Typography className="sub-title">
              We are glad to see you again!
            </Typography>
          </Stack>
        </Stack>
      </ScrollFade>
      <ScrollFade>
        <Stack className="favorites-list-box">
          {myFavorites?.length ? (
            myFavorites?.map((product: Product) => {
              return (
                <MyPageFavoriteCard
                  product={product}
                  likeProductHandler={likeProductHandler}
                  myFavorites={true}
                  key={product._id}
                />
              );
            })
          ) : (
            <div className={"no-data"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>No Favorites found!</p>
            </div>
          )}
        </Stack>
      </ScrollFade>
      {myFavorites?.length ? (
        <ScrollFade>
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(total / searchFavorites.limit)}
                page={searchFavorites.page}
                shape="circular"
                color="primary"
                onChange={paginationHandler}
              />
            </Stack>
            <Stack className="total-result">
              <Typography>
                Total {total} favorite product{total > 1 ? "s" : ""}
              </Typography>
            </Stack>
          </Stack>
        </ScrollFade>
      ) : null}
    </div>
  );
};

export default MyFavorites;
