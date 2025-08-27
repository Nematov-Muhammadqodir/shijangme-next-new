import withLayoutAdmin from "@/libs/components/layout/AdminLayout";
import { ProductCollection, ProductStatus } from "@/libs/enums/product.enum";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import {
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import MemberHorizontalCard from "@/libs/components/admin/MemberHorizontalCard";
import { Product } from "@/libs/types/product/product";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_PRODUCT_BY_ADMIN } from "@/apollo/admin/mutation";
import { GET_ALL_PRODUCTS_BY_ADMIN } from "@/apollo/admin/query";
import { T } from "@/libs/types/common";
import ProductHorizontalCard from "@/libs/components/admin/ProductHorizontalCard";
import { ProductUpdate } from "@/libs/types/product/product.update";
import { sweetErrorHandling } from "@/libs/types/sweetAlert";

const Products = ({ initialInquiry, ...props }: any) => {
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("ALL");
  const [productsInquiry, setProductsInquiry] =
    useState<ProductsInquiry>(initialInquiry);
  const [value, setValue] = useState(
    productsInquiry?.search?.productStatus
      ? productsInquiry?.search?.productStatus
      : "ALL"
  );
  /** APOLLO REQUESTS **/
  const [updateProductByAdmin] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
  console.log("GET_ALL_PRODUCTS_BY_ADMIN Inquery", productsInquiry);
  const {
    loading: getAllProductsLoading,
    data: getAllProductsData,
    error: getAllProductsError,
    refetch: getAllProductsRefetch,
  } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: productsInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("GET_ALL_PRODUCTS_BY_ADMIN DATA: ", data);
      setProducts(data?.getAllProductsByAdmin?.list);
      setProductsTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  //HANDLERS
  const textHandler = useCallback((value: string) => {
    try {
      setSearchText(value);
    } catch (err: any) {
      console.log("textHandler: ", err.message);
    }
  }, []);

  const searchTypeHandler = async (newValue: string) => {
    console.log("new Value", newValue);
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setProductsInquiry({
          ...productsInquiry,
          page: 1,
          search: {
            ...productsInquiry.search,
            productCollection: newValue as ProductCollection,
          },
        });
      } else {
        delete productsInquiry?.search?.productCollection;
        setProductsInquiry({ ...productsInquiry });
        await getAllProductsRefetch({ input: productsInquiry });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };
  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const updateMemberHandler = async (updateData: ProductUpdate) => {
    console.log("updateData:", updateData);
    try {
      await updateProductByAdmin({
        variables: { input: updateData },
      });
      menuIconCloseHandler();
      await getAllProductsRefetch({ input: productsInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  useEffect(() => {
    setProductsInquiry({
      ...productsInquiry,
      search: {
        ...productsInquiry.search,
        text: searchText,
      },
    });
  }, [searchText]);

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    setProductsInquiry({ ...productsInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ALL":
        setProductsInquiry({
          ...productsInquiry,
          search: {},
        });
        break;
      case "ACTIVE":
        setProductsInquiry({
          ...productsInquiry,
          search: { productStatus: ProductStatus.ACTIVE },
        });
        break;
      case "SOLD":
        setProductsInquiry({
          ...productsInquiry,
          search: { productStatus: ProductStatus.SOLD },
        });
        break;
      case "DELETE":
        setProductsInquiry({
          ...productsInquiry,
          search: { productStatus: ProductStatus.DELETE },
        });
        break;
      default:
        delete productsInquiry?.search?.productStatus;
        setProductsInquiry({ ...productsInquiry });
        break;
    }
  };
  return (
    <div className="products-page">
      <Stack className="products-page-intro">
        <span className="page-name">Products Page</span>
        <span className="page-desc">View and Manage All Products</span>
      </Stack>
      <div className="top-navigation">
        <List className={"tab-menu"}>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "ALL")}
            value="ALL"
            className={value === "ALL" ? "li on" : "li"}
          >
            All
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
            value="ACTIVE"
            className={value === "ACTIVE" ? "li on" : "li"}
          >
            Active
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "SOLD")}
            value="SOLD"
            className={value === "SOLD" ? "li on" : "li"}
          >
            Sold
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "DELETE")}
            value="DELETE"
            className={value === "DELETE" ? "li on" : "li"}
          >
            Deleted
          </ListItem>
        </List>
      </div>
      <Stack className="members-list-main-container">
        <Stack className="search-container">
          <OutlinedInput
            value={searchText}
            onChange={(e: any) => textHandler(e.target.value)}
            sx={{ width: "100%" }}
            className={"search"}
            placeholder="Search product name"
            endAdornment={
              <>
                {searchText && (
                  <CancelRoundedIcon
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      setSearchText("");
                      setProductsInquiry({
                        ...productsInquiry,
                        search: {
                          ...productsInquiry.search,
                          text: "",
                        },
                      });
                      await getAllProductsRefetch({ input: productsInquiry });
                    }}
                  />
                )}
                <InputAdornment position="end">
                  <img src="/img/icons/search_icon.png" alt={"searchIcon"} />
                </InputAdornment>
              </>
            }
          />
          <Select
            sx={{ width: "160px", ml: "20px" }}
            value={searchType}
            className="select-container"
          >
            <MenuItem value={"ALL"} onClick={() => searchTypeHandler("ALL")}>
              All
            </MenuItem>
            <MenuItem
              value={"FRUITS"}
              onClick={() => searchTypeHandler("FRUITS")}
            >
              Fruits
            </MenuItem>
            <MenuItem
              value={"MASHROOMS"}
              onClick={() => searchTypeHandler("MASHROOMS")}
            >
              Mashrooms
            </MenuItem>
            <MenuItem
              value={"GREENS"}
              onClick={() => searchTypeHandler("GREENS")}
            >
              Greens
            </MenuItem>
            <MenuItem
              value={"VEGETABLES"}
              onClick={() => searchTypeHandler("VEGETABLES")}
            >
              Vegetables
            </MenuItem>
            <MenuItem
              value={"HERBS"}
              onClick={() => searchTypeHandler("HERBS")}
            >
              Herbs
            </MenuItem>
            <MenuItem value={"NUTS"} onClick={() => searchTypeHandler("NUTS")}>
              Nuts
            </MenuItem>
            <MenuItem
              value={"GRAINS"}
              onClick={() => searchTypeHandler("GRAINS")}
            >
              Grains
            </MenuItem>
            <MenuItem
              value={"MEAT_EGGS"}
              onClick={() => searchTypeHandler("MEAT_EGGS")}
            >
              Meat & Eggs
            </MenuItem>
            <MenuItem
              value={"MILK_BEVARAGES"}
              onClick={() => searchTypeHandler("MILK_BEVARAGES")}
            >
              Milk & Bevarages
            </MenuItem>
          </Select>
        </Stack>
        <Stack className="members-list-container">
          <Stack className="member-list-header">
            <span className="mb-id">Product ID</span>
            <span className="nickname">Product Name</span>
            <span className="phone">Product Price</span>
            <span className="type">Status</span>
            <span className="state">Product Type</span>
          </Stack>
          <Stack className="members-list">
            {products.map((product, index) => {
              return (
                <ProductHorizontalCard
                  menuIconClickHandler={menuIconClickHandler}
                  anchorEl={anchorEl}
                  updateMemberHandler={updateMemberHandler}
                  menuIconCloseHandler={menuIconCloseHandler}
                  index={index}
                  product={product}
                  key={product?._id}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

Products.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 1000,
    search: {},
  },
};

export default withLayoutAdmin(Products);
