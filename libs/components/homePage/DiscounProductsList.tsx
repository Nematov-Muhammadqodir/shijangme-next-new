import { Box, Stack, Pagination, Fade } from "@mui/material"; // Import Pagination and Box
import React, { useEffect, useState } from "react";
import DiscountProductCart from "./DiscountProductCart";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/query";
import { Product } from "@/libs/types/product/product";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { T } from "@/libs/types/common";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { Message } from "@/libs/enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/libs/types/sweetAlert";
import { useSelector, useDispatch } from "react-redux";
import {
  wishListDecrement,
  wishListIncrement,
  resetWishListAmount,
  wishListValue,
} from "@/slices/wishListSlice";

interface DiscountProductsProps {
  initialInput: ProductsInquiry;
}

const DiscounProductsList = ({ initialInput }: DiscountProductsProps) => {
  const finalInput = initialInput ?? {
    page: 1,
    limit: 4,
    sort: "productDiscountRate",
    direction: "DESC",
    search: {},
  };
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const dispatch = useDispatch();
  const wishListAmount = useSelector(wishListValue);
  let likeResult: any = null;

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const {
    loading: getDiscountedProductsLoading,
    data: getDiscountedProductsData,
    error: getDiscountedProductsError,
    refetch: getDiscountedProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: finalInput,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("discountedPrpductsData", data?.getProducts?.list);
      setDiscountedProducts(data?.getProducts?.list);
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
      likeResult = await likeTargetProduct({ variables: { input: id } });

      if (likeResult.data.likeTargetProduct.productLikes > likeAmount) {
        dispatch(wishListIncrement());
      } else {
        dispatch(wishListDecrement());
      }
      // execute getPropertiesRefetch
      await getDiscountedProductsRefetch({ input: finalInput });

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
  const [page, setPage] = useState(initialInput.page);
  const itemsPerPage = initialInput.limit;
  const pageCount = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToDisplay = discountedProducts;
  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    await getDiscountedProductsRefetch({
      input: {
        ...finalInput,
        page: value,
      },
    });
    // Optional: window.scrollTo({ top: 0, behavior: "smooth" });
  };
  //& PAGINATION END

  return (
    <div className="discount-products-list-main-countainer">
      <Stack className="container">
        <Stack className="discount-products-list">
          <Stack className="discount-products-intro">
            <div className="horizontal-line"></div>
            <span>Discounted Products</span>
            <div className="horizontal-line"></div>
          </Stack>
          <Stack className="discount-card-main-container">
            {productsToDisplay.length === 0 ? (
              <Box
                component={"div"}
                className={"empty-list"}
                sx={{ gridColumn: "1 / -1" }}
              >
                No Discounted Products Available
              </Box>
            ) : (
              productsToDisplay
                .filter((product) => product.productDiscountRate > 0)
                .map((product: Product) => (
                  <Fade in={true} timeout={1000} key={product._id}>
                    <Box>
                      <DiscountProductCart
                        product={product}
                        likeProductHandler={likeProductHandler}
                      />
                    </Box>
                  </Fade>
                ))
            )}
          </Stack>

          {pageCount > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 3 }}
            >
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

DiscounProductsList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 4,
    sort: "productDiscountRate",
    direction: "DESC",
    search: {},
  },
};

export default DiscounProductsList;
