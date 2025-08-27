import { Box, Fade, Pagination, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import NewProductCard from "./NewProductCard";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { Product } from "@/libs/types/product/product";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/query";
import { T } from "@/libs/types/common";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { Message } from "@/libs/enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/libs/types/sweetAlert";
import {
  wishListDecrement,
  wishListIncrement,
  resetWishListAmount,
  wishListValue,
} from "@/slices/wishListSlice";
import { useSelector, useDispatch } from "react-redux";

interface NewProductsListProps {
  initialInput: ProductsInquiry;
}

const NewProductsList = ({ initialInput }: NewProductsListProps) => {
  const finalInput = initialInput ?? {
    page: 1,
    limit: 4,
    sort: "productDiscountRate",
    direction: "DESC",
    search: {},
  };
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const dispatch = useDispatch();
  const wishListAmount = useSelector(wishListValue);

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const {
    loading: getNewProductsLoading,
    data: getNewProductsData,
    error: getNewProductsError,
    refetch: getNewProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: finalInput,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("newProductsData", data?.getProducts?.list);
      setNewProducts(data?.getProducts?.list);
      setTotalProducts(data?.getProducts?.metaCounter?.[0]?.total || 0);
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
      // execute getPropertiesRefetch
      await getNewProductsRefetch({ input: finalInput });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("Error, likeProductHandler", err);
      sweetMixinErrorAlert(err.message).then();
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

  //& PAGINATION START
  const [page, setPage] = useState(finalInput.page);
  const itemsPerPage = finalInput.limit;
  const pageCount = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToDisplay = newProducts;
  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    await getNewProductsRefetch({
      input: {
        ...finalInput,
        page: value,
      },
    });
    // Optional: window.scrollTo({ top: 0, behavior: "smooth" });
  };
  //& PAGINATION END
  return (
    <div className="new-products-list-main-container">
      <Stack className="container">
        <Stack className="new-products-list">
          <Stack className="new-products-intro">
            <div className="horizontal-line"></div>
            <span>New Products</span>
            <div className="horizontal-line"></div>
          </Stack>
          <Stack
            className={`new-product-card-main-container ${
              productsToDisplay.length < 4 ? "flex-left" : ""
            }`}
          >
            {productsToDisplay.length === 0 ? (
              <Box
                component={"div"}
                className={"empty-list"}
                sx={{ gridColumn: "1 / -1" }}
              >
                No Discounted Products Available
              </Box>
            ) : (
              productsToDisplay.map((product, key) => (
                <Fade in={true} timeout={1000} key={key}>
                  <Box>
                    <NewProductCard
                      product={product}
                      likeProductHandler={likeProductHandler}
                    />
                  </Box>
                </Fade>
              ))
            )}
          </Stack>

          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

NewProductsList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 4,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default NewProductsList;
