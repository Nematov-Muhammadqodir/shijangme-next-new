import { Pagination, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MyProductsCard from "../common/MyProductsCard";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { NextPage } from "next";
import { T } from "@/libs/types/common";
import { useRouter } from "next/router";
import { Product } from "@/libs/types/product/product";
import { GET_PRODUCTS } from "@/apollo/user/query";
import { useQuery } from "@apollo/client";
import ScrollFade from "../common/MotionWrapper";

const MemberProducts: NextPage = ({ initialInput, ...props }: any) => {
  const router = useRouter();
  const { memberId } = router.query;
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({
    ...initialInput,
  });

  /** APOLLO REQUESTS **/

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    skip: !searchFilter?.search?.productOwnerId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("vendorProducts", data?.getProducts?.list);
      setVendorProducts(data?.getProducts?.list);
      setTotal(data?.getProducts?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getProductsRefetch().then();
  }, [searchFilter]);

  useEffect(() => {
    if (memberId)
      setSearchFilter({
        ...initialInput,
        search: { ...initialInput.search, productOwnerId: memberId as string },
      });
  }, [memberId]);

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };
  return (
    <div id="member-products-page">
      <ScrollFade>
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">Products</Typography>
          </Stack>
        </Stack>
      </ScrollFade>
      <Stack className="products-list-box">
        <Stack className="list-box">
          {vendorProducts?.length > 0 && (
            <ScrollFade>
              <Stack className="listing-title-box">
                <Typography className="title-text">Listing title</Typography>
                <Typography className="title-text">Date Published</Typography>
                <Typography className="title-text">Status</Typography>
                <Typography className="title-text">View</Typography>
              </Stack>
            </ScrollFade>
          )}
          {vendorProducts?.length === 0 && (
            <ScrollFade>
              <div className={"no-data"}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No Product found!</p>
              </div>
            </ScrollFade>
          )}
          {vendorProducts.map((product) => {
            return (
              <ScrollFade>
                <MyProductsCard
                  key={product._id}
                  product={product}
                  memberPage={true}
                />
              </ScrollFade>
            );
          })}
          {vendorProducts.length !== 0 && (
            <ScrollFade>
              <Stack className="pagination-config">
                <Stack className="pagination-box">
                  <Pagination
                    count={Math.ceil(total / searchFilter.limit)}
                    page={searchFilter.page}
                    shape="circular"
                    color="primary"
                    onChange={paginationHandler}
                  />
                </Stack>
                <Stack className="total-result">
                  <Typography>{total} property available</Typography>
                </Stack>
              </Stack>
            </ScrollFade>
          )}
        </Stack>
      </Stack>
    </div>
  );
};
MemberProducts.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    search: {
      productOwnerId: "",
    },
  },
};

export default MemberProducts;
