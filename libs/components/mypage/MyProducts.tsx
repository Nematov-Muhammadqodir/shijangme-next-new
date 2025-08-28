import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MyPageProductCard } from "./MyPageProductCard";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { VendorProductsInquery } from "../../types/product/product.input";
import { Product } from "../../types/product/product";
import { userVar } from "../../../apollo/store";
import { UPDATE_PRODUCT } from "../../../apollo/user/mutation";
import { GET_VENDOR_PRODUCTS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { ProductStatus } from "../../enums/product.enum";
import { sweetConfirmAlert, sweetErrorHandling } from "../../types/sweetAlert";
import ScrollFade from "../common/MotionWrapper";

const MyProducts = ({ initialInput, ...props }: any) => {
  const [searchFilter, setSearchFilter] =
    useState<VendorProductsInquery>(initialInput);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);

  const user = useReactiveVar(userVar);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  /** APOLLO REQUESTS **/
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const {
    loading: getVendorProductsLoading,
    data: getVendorProductsData,
    error: getVendorProductsError,
    refetch: getVendorProductsRefetch,
  } = useQuery(GET_VENDOR_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setVendorProducts(data?.getVendorProducts?.list);
      console.log("vendorProductsData", data?.getVendorProducts?.list);
      setTotal(data?.getVendorProducts?.metaCounter[0].total ?? 0);
    },
  });

  //HANDLERS
  const changeStatusHandler = (value: ProductStatus) => {
    setSearchFilter({ ...searchFilter, search: { productStatus: value } });
  };

  const deleteProductHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert("are you sure to delete this product?")) {
        await updateProduct({
          variables: {
            input: {
              _id: id,
              productStatus: ProductStatus.DELETE,
            },
          },
        });

        await getVendorProductsRefetch({ input: searchFilter });
      }
    } catch (error: any) {
      console.error("Error deleting property:", error);
      sweetErrorHandling(error);
    }
  };

  const updateProductHandler = async (status: string, id: string) => {
    try {
      if (await sweetConfirmAlert(`Are you sure change to ${status} status?`)) {
        await updateProduct({
          variables: {
            input: {
              _id: id,
              productStatus: status,
            },
          },
        });

        await getVendorProductsRefetch({ input: searchFilter });
      }
    } catch (error: any) {
      console.error("Error updateProductHandler:", error);
      sweetErrorHandling(error);
    }
  };

  if (user?.memberType !== "VENDOR") {
    router.back();
  }
  return (
    <div id="my-product-page">
      <ScrollFade>
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">My Products</Typography>
            <Typography className="sub-title">
              We are glad to see you again!
            </Typography>
          </Stack>
        </Stack>
      </ScrollFade>

      <Stack className="property-list-box">
        <ScrollFade>
          <Stack className="tab-name-box">
            <Typography
              onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
              className={
                searchFilter.search.productStatus === "ACTIVE"
                  ? "active-tab-name"
                  : "tab-name"
              }
            >
              On Sale
            </Typography>
            <Typography
              onClick={() => changeStatusHandler(ProductStatus.SOLD)}
              className={
                searchFilter.search.productStatus === "SOLD"
                  ? "active-tab-name"
                  : "tab-name"
              }
            >
              On Sold
            </Typography>
          </Stack>

          <Stack className="list-box">
            <ScrollFade>
              <Stack className="listing-title-box">
                <Typography className="title-text">Listing title</Typography>
                <Typography className="title-text">Date Published</Typography>
                <Typography className="title-text">Status</Typography>
                <Typography className="title-text">View</Typography>
                {searchFilter.search.productStatus === "ACTIVE" ? (
                  <Typography className="title-text">Action</Typography>
                ) : null}
              </Stack>
            </ScrollFade>
            {vendorProducts?.length === 0 ? (
              <ScrollFade>
                <div className={"no-data"}>
                  <img src="/img/icons/icoAlert.svg" alt="" />
                  <p>No Product found!</p>
                </div>
              </ScrollFade>
            ) : (
              vendorProducts.map((product: Product) => {
                return (
                  <ScrollFade>
                    <MyPageProductCard
                      product={product}
                      deleteProductHandler={deleteProductHandler}
                      updateProductHandler={updateProductHandler}
                      key={product._id}
                    />
                  </ScrollFade>
                );
              })
            )}
          </Stack>
        </ScrollFade>
      </Stack>
    </div>
  );
};

MyProducts.defaultProps = {
  initialInput: {
    page: 1,
    limit: 100000,
    sort: "createdAt",
    search: {
      productStatus: "ACTIVE",
    },
  },
};

export default MyProducts;
