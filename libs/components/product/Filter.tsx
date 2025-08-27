// @ts-nocheck

import {
  Checkbox,
  IconButton,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { useRouter } from "next/router";
import {
  ProductCollection,
  ProductFrom,
  ProductVolume,
} from "@/libs/enums/product.enum";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface FilterType {
  searchFilter: ProductsInquiry;
  setSearchFilter: any;
  initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
  const { searchFilter, setSearchFilter, initialInput } = props;
  const router = useRouter();
  const [productOrigin, setProductOrigin] = useState<ProductFrom[]>(
    Object.values(ProductFrom)
  );
  const [productCollection, setProductCollection] = useState<
    ProductCollection[]
  >(Object.values(ProductCollection));
  const productVolumes = Object.values(ProductVolume).filter(
    (v) => typeof v === "number"
  ) as ProductVolume[];
  const [productVolume, setProductVolume] =
    useState<ProductVolume[]>(productVolumes);

  const [searchText, setSearchText] = useState<string>("");
  const [showMoreOrigin, setShowMoreOrigin] = useState(false);
  const [showMoreCollection, setShowMoreCollection] = useState(false);
  const [showMoreVolume, setShowMoreVolume] = useState(false);
  const selectedVolumes = (searchFilter?.search?.productVolume || []).map((v) =>
    typeof v === "string" ? parseFloat(v) : v
  );

  useEffect(() => {
    if (searchFilter?.search?.productOrigin?.length == 0) {
      delete searchFilter.search.productOrigin;
      setShowMoreOrigin(false);
      router
        .push(
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          { scroll: false }
        )
        .then();
    }
    if (searchFilter?.search?.productCollection?.length == 0) {
      delete searchFilter.search.productCollection;
      router
        .push(
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          { scroll: false }
        )
        .then();
    }
  }, [searchFilter]);

  const refreshHandler = async () => {
    try {
      setSearchText("");
      await router.push(
        `/product?input=${JSON.stringify(initialInput)}`,
        `/product?input=${JSON.stringify(initialInput)}`,
        { scroll: false }
      );
    } catch (err: any) {
      console.log("ERROR, refreshHandler:", err);
    }
  };

  const productOriginSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        if (isChecked) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productOrigin: [
                  ...(searchFilter?.search?.productOrigin || []),
                  value,
                ],
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productOrigin: [
                  ...(searchFilter?.search?.productOrigin || []),
                  value,
                ],
              },
            })}`,
            { scroll: false }
          );
        } else if (searchFilter?.search?.productOrigin?.includes(value)) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productOrigin: searchFilter?.search?.productOrigin?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productOrigin: searchFilter?.search?.productOrigin?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            { scroll: false }
          );
        }

        // if (searchFilter?.search?.productCollection?.length == 0) {
        //   alert("error");
        // }

        console.log("productOriginSelectHandler:", e.target.value);
      } catch (err: any) {
        console.log("ERROR, productOriginSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const productCollectionSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        if (isChecked) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productCollection: [
                  ...(searchFilter?.search?.productCollection || []),
                  value,
                ],
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productCollection: [
                  ...(searchFilter?.search?.productCollection || []),
                  value,
                ],
              },
            })}`,
            { scroll: false }
          );
        } else if (searchFilter?.search?.productCollection?.includes(value)) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productCollection:
                  searchFilter?.search?.productCollection?.filter(
                    (item: string) => item !== value
                  ),
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productCollection:
                  searchFilter?.search?.productCollection?.filter(
                    (item: string) => item !== value
                  ),
              },
            })}`,
            { scroll: false }
          );
        }

        // if (searchFilter?.search?.productCollection?.length == 0) {
        //   alert("error");
        // }

        console.log("productCollectionSelectHandler:", e.target.value);
      } catch (err: any) {
        console.log("ERROR, productCollectionSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const productVolumeSelectHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      const value = parseFloat(e.target.value); // volumes are numbers

      try {
        if (isChecked) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productVolume: [
                  ...(searchFilter?.search?.productVolume || []),
                  value,
                ],
              },
            })}`,
            undefined,
            { scroll: false }
          );
        } else {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                productVolume: searchFilter?.search?.productVolume?.filter(
                  (item: number) => item !== value
                ),
              },
            })}`,
            undefined,
            { scroll: false }
          );
        }
      } catch (err) {
        console.error("ERROR, productVolumeSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const productPriceHandler = useCallback(
    async (value: number, type: string) => {
      if (type == "start") {
        await router.push(
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              productPrice: {
                ...searchFilter.search.productPrice,
                start: value * 1,
              },
            },
          })}`,
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              productPrice: {
                ...searchFilter.search.productPrice,
                start: value * 1,
              },
            },
          })}`,
          { scroll: false }
        );
      } else {
        await router.push(
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              productPrice: {
                ...searchFilter.search.productPrice,
                end: value * 1,
              },
            },
          })}`,
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              productPrice: {
                ...searchFilter.search.productPrice,
                end: value * 1,
              },
            },
          })}`,
          { scroll: false }
        );
      }
    },
    [searchFilter]
  );

  return (
    <Stack className="filter-main-container">
      <Stack className="search-by-text-container">
        <Typography className="title">Search product by name</Typography>
        <Stack className="search-details-container">
          <OutlinedInput
            value={searchText}
            type="text"
            className="search-input"
            placeholder="What are you looking for?"
            onChange={(e: any) => setSearchText(e.target.value)}
            onKeyDown={(event: any) => {
              if (event.key == "Enter") {
                setSearchFilter({
                  ...searchFilter,
                  search: { ...searchFilter.search, text: searchText },
                });
              }
            }}
            endAdornment={
              <>
                <CancelRoundedIcon
                  onClick={() => {
                    setSearchText("");
                    setSearchFilter({
                      ...searchFilter,
                      search: { ...searchFilter.search, text: "" },
                    });
                  }}
                />
              </>
            }
          />
          {/* <img src={"/img/products/search_icon.png"} alt={""} /> */}
          <Tooltip title="Reset">
            <IconButton onClick={refreshHandler} sx={{ color: "white" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack className="find-by-origin-main" mb={"30px"}>
        <p className="title">Product Origin</p>
        <Stack
          className="product-origin"
          style={{ height: showMoreOrigin ? "310px" : "115px" }}
          onMouseEnter={() => setShowMoreOrigin(true)}
          onMouseLeave={() => {
            if (!searchFilter?.search?.productOrigin) {
              setShowMoreOrigin(false);
            }
          }}
        >
          {productOrigin.map((origin) => {
            return (
              <Stack className={"input-box"} key={origin}>
                <Checkbox
                  id={origin}
                  className="product-checkbox"
                  color="default"
                  size="small"
                  value={origin}
                  checked={(searchFilter?.search?.productOrigin || []).includes(
                    origin as ProductFrom
                  )}
                  onChange={productOriginSelectHandler}
                  icon={<RadioButtonUncheckedIcon fontSize="small" />}
                  checkedIcon={<CheckCircleIcon fontSize="small" />}
                />
                <label htmlFor={origin} style={{ cursor: "pointer" }}>
                  <Typography className="product-origin-item">
                    {origin}
                  </Typography>
                </label>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Stack className="find-by-collection-main" mb={"30px"}>
        <p className="title">Product Collection</p>
        <Stack
          className="product-collection"
          style={{ height: showMoreCollection ? "255px" : "115px" }}
          onMouseEnter={() => setShowMoreCollection(true)}
          onMouseLeave={() => {
            if (!searchFilter?.search?.productCollection) {
              setShowMoreCollection(false);
            }
          }}
        >
          {productCollection.map((collection) => {
            return (
              <Stack className={"input-box"} key={collection}>
                <Checkbox
                  id={collection}
                  className="collection-checkbox"
                  color="default"
                  size="small"
                  value={collection}
                  checked={(
                    searchFilter?.search?.productCollection || []
                  ).includes(collection as ProductCollection)}
                  onChange={productCollectionSelectHandler}
                  icon={<RadioButtonUncheckedIcon fontSize="small" />}
                  checkedIcon={<CheckCircleIcon fontSize="small" />}
                />
                <label htmlFor={collection} style={{ cursor: "pointer" }}>
                  <Typography className="product-collection-item">
                    {collection}
                  </Typography>
                </label>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Stack className="find-by-volume-main" mb={"30px"}>
        <p className="title">Product Volume</p>
        <Stack className="product-volume" style={{ height: "200px" }}>
          {productVolume.map((volume) => {
            const volumeId = String(volume);
            return (
              <Stack className="input-box" key={volumeId}>
                <Checkbox
                  id={volumeId}
                  className="volume-checkbox"
                  color="default"
                  size="small"
                  value={volume}
                  checked={selectedVolumes.includes(volume)}
                  onChange={productVolumeSelectHandler}
                  icon={<RadioButtonUncheckedIcon fontSize="small" />}
                  checkedIcon={<CheckCircleIcon fontSize="small" />}
                />
                <label htmlFor={volumeId} style={{ cursor: "pointer" }}>
                  <Typography className="product-volume-item">
                    {volume}
                  </Typography>
                </label>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Stack className={"find-your-product"}>
        <Typography className={"price-range-title"}>Price Range</Typography>
        <Stack className="product-price-input">
          <input
            type="number"
            placeholder="$ min"
            min={0}
            value={searchFilter?.search?.productPrice?.start ?? 0}
            onChange={(e: any) => {
              if (e.target.value >= 0) {
                productPriceHandler(e.target.value, "start");
              }
            }}
          />
          <div className="central-divider"></div>
          <input
            type="number"
            placeholder="$ max"
            value={searchFilter?.search?.productPrice?.end ?? 0}
            onChange={(e: any) => {
              if (e.target.value >= 0) {
                productPriceHandler(e.target.value, "end");
              }
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Filter;
//productDiscountRate
