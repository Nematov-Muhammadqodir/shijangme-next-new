import React, { useState } from "react";
import { NextPage } from "next";
import { Pagination, Stack, Typography } from "@mui/material";
import { T } from "../../types/common";
import { useMutation, useQuery } from "@apollo/client";
import { Message } from "../../enums/common.enum";
import { Product } from "@/libs/types/product/product";
import MyPageFavoriteCard from "./MyPageFavoriteCard";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { GET_VISITED } from "@/apollo/user/query";
import ScrollFade from "@/libs/components/common/MotionWrapper";

const RecentlyVisited: NextPage = () => {
  const [recentlyVisited, setRecentlyVisited] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFavorites, setSearchFavorites] = useState<T>({
    page: 1,
    limit: 6,
  });
  console.log("total visited", total);

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const {
    loading: loadingFavorites,
    error: errorFavorites,
    data: dataFavorites,
    refetch: refetchFavorites,
  } = useQuery(GET_VISITED, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: searchFavorites.page,
        limit: searchFavorites.limit,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getVisited) {
        setRecentlyVisited(data.getVisited.list);
        setTotal(data.getVisited.metaCounter[0].total);
      }
    },
  });

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFavorites({ ...searchFavorites, page: value });
  };

  const likeProductHandler = async (user: any, productId: string) => {
    try {
      if (!user) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetProduct({
        variables: {
          input: productId,
        },
      });
      await refetchFavorites();
      console.log("likeProductHandler");
    } catch (err: any) {
      console.error("Error liking product:", err);
    }
  };

  return (
    <div id="my-favorites-page">
      <ScrollFade>
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">Recently Visited</Typography>
            <Typography className="sub-title">
              We are glad to see you again!
            </Typography>
          </Stack>
        </Stack>
      </ScrollFade>
      <ScrollFade>
        <Stack className="favorites-list-box">
          {recentlyVisited?.length ? (
            recentlyVisited?.map((product: Product) => {
              return (
                <MyPageFavoriteCard
                  product={product}
                  recentlyVisited={true}
                  key={product._id}
                />
              );
            })
          ) : (
            <div className={"no-data"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>No Recently Visited Products found!</p>
            </div>
          )}
        </Stack>
      </ScrollFade>
      {recentlyVisited?.length ? (
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
              Total {total} recently visited product{total > 1 ? "s" : ""}
            </Typography>
          </Stack>
        </Stack>
      ) : null}
    </div>
  );
};

export default RecentlyVisited;
