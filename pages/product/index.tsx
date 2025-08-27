import withLayoutMain from "@/libs/components/layout/LayoutHome";
import Filter from "@/libs/components/product/Filter";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import {
  Box,
  Button,
  Container,
  Fade,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, MouseEvent, useState, ChangeEvent } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Direction, Message } from "@/libs/enums/common.enum";
import { T } from "@/libs/types/common";
import ProductCard from "@/libs/components/product/ProductCard";
import MultipleBanner from "@/libs/components/product/MultipleBanner";
import OurBrands from "@/libs/components/OurBrands";
import { useMutation, useQuery } from "@apollo/client";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { GET_PRODUCTS } from "@/apollo/user/query";
import { Product } from "@/libs/types/product/product";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/libs/types/sweetAlert";
import { ProductFrom } from "@/libs/enums/product.enum";
import { useDispatch, useSelector } from "react-redux";
import {
  resetWishListAmount,
  wishListDecrement,
  wishListIncrement,
  wishListValue,
} from "@/slices/wishListSlice";
import ProductBanner from "@/libs/components/product/ProductBanner";
import ScrollFade from "@/libs/components/common/MotionWrapper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface ProductsProps {
  initialInput: ProductsInquiry;
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Products = ({ initialInput }: ProductsProps) => {
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput
  );
  const dispatch = useDispatch();
  const wishListAmount = useSelector(wishListValue);
  //*PAGINATION START
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState("New");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToDisplay = products.slice(startIndex, endIndex);
  //*PAGINATION FINISH

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProducts(data?.getProducts?.list);
      setTotal(data?.getProducts?.metaCounter[0]?.total);
    },
  });
  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);
      setSearchFilter(inputObj);
    }

    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  useEffect(() => {
    console.log("seachFilter", searchFilter);
    getProductsRefetch({ input: searchFilter });
  }, [searchFilter]);

  /** HANDLERS **/
  const likeProductHandler = async (
    user: T,
    id: string,
    likeAmount: number
  ) => {
    console.log("likeRefId", id);
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      //executeLikeProductsMutation
      const likeResult = await likeTargetProduct({ variables: { input: id } });
      if (likeResult.data.likeTargetProduct.productLikes > likeAmount) {
        dispatch(wishListIncrement());
      } else {
        dispatch(wishListDecrement());
      }
      //execute getProductsRefetch
      await getProductsRefetch({ input: searchFilter });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("Error, likePropertyHandler", err);
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

  const handlePaginationChange = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    searchFilter.page = value;
    await router.push(
      `/product?input=${JSON.stringify(searchFilter)}`,
      `/product?input=${JSON.stringify(searchFilter)}`,
      {
        scroll: false,
      }
    );
    setCurrentPage(value);
  };

  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    switch (e.currentTarget.id) {
      case "new":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: Direction.ASC,
        });
        setFilterSortName("New");
        break;
      case "lowest":
        setSearchFilter({
          ...searchFilter,
          sort: "productPrice",
          direction: Direction.ASC,
        });
        setFilterSortName("Lowest Price");
        break;
      case "highest":
        setSearchFilter({
          ...searchFilter,
          sort: "productPrice",
          direction: Direction.DESC,
        });
        setFilterSortName("Highest Price");
    }
    setSortingOpen(false);
    setAnchorEl(null);
  };
  return (
    <Stack className="all-products-main-container">
      <Stack className="container">
        {/* <Stack className="introduction-main">
          <Stack className="left-side">
            <span className="main">OUR COLLECTIONS</span>
            <span className="secondary">
              Carefully Curated Selections For Every Lifestyle
            </span>
          </Stack>
          <Stack className="right-side">
            <span className="text">
              Discover a wide range of premium products crafted to elevate your
              daily life. From fresh organic produce to artisanal specialties,
              our collections bring together quality, sustainability, and
              exceptional taste. Explore items that perfectly complement your
              unique preferences.
            </span>
            <span>
              From farm-fresh organics to artisanal delights, our premium
              selections are curated to match the highest standards of quality
              and elegance. Discover essentials that enrich your lifestyle with
              purpose and taste.
            </span>
          </Stack>
        </Stack> */}
        {/* <MultipleBanner /> */}
        <ScrollFade>
          <ProductBanner />
        </ScrollFade>
        <Box component={"div"} className={"right"}>
          <span className="sort-text">Sort by:</span>
          <div className="sorting-container">
            <Button
              onClick={sortingClickHandler}
              endIcon={<KeyboardArrowDownRoundedIcon />}
            >
              {filterSortName}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={sortingOpen}
              onClose={sortingCloseHandler}
              sx={{ paddingTop: "5px", fontWeight: "bold" }}
            >
              <MenuItem
                onClick={sortingHandler}
                id={"new"}
                className="sorting-item"
                disableRipple
                sx={{
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                }}
              >
                New
              </MenuItem>
              <MenuItem
                onClick={sortingHandler}
                id={"lowest"}
                className="sorting-item"
                disableRipple
                sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
              >
                Lowest Price
              </MenuItem>
              <MenuItem
                onClick={sortingHandler}
                id={"highest"}
                className="sorting-item"
                disableRipple
                sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
              >
                Highest Price
              </MenuItem>
            </Menu>
          </div>
        </Box>
        <ScrollFade>
          <Stack className="filtered-products-list">
            <Filter
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              initialInput={initialInput}
            />

            <Stack className="product-cards-list-container">
              <Stack className="product-cards-list">
                {productsToDisplay.length === 0 ? (
                  <Box
                    component={"div"}
                    className={"empty-list"}
                    sx={{ gridColumn: "1 / -1" }}
                  >
                    No Products Found!
                  </Box>
                ) : (
                  productsToDisplay.map((product, key) => (
                    <Fade in={true} timeout={1000} key={key}>
                      <Box>
                        <ProductCard
                          likeProductHandler={likeProductHandler}
                          product={product}
                        />
                      </Box>
                    </Fade>
                  ))
                )}
              </Stack>

              <Stack className="pagination-config">
                {products.length !== 0 && (
                  <Stack className="pagination-box">
                    <Pagination
                      page={currentPage}
                      count={Math.ceil(total / searchFilter.limit)}
                      onChange={handlePaginationChange}
                      shape="circular"
                      color="primary"
                    />
                  </Stack>
                )}

                {products.length !== 0 && (
                  <Stack className="total-result">
                    <Typography>
                      Total {total} product{total > 1 ? "s" : ""} available
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </ScrollFade>
      </Stack>
      <ScrollFade>
        <OurBrands />
      </ScrollFade>
    </Stack>
  );
};

Products.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: "createdAt",
    direction: "DESC",
    search: {
      productPrice: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default withLayoutMain(Products);
