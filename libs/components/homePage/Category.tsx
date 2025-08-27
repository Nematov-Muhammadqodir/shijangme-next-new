import { Box, Stack } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

const Category = () => {
  const router = useRouter();
  const handleAllProducts = () => {
    router.push({ pathname: "product" });
  };
  const handleDirection = (category: string) => {
    router.push({
      pathname: "/product",
      query: {
        input: JSON.stringify({
          page: 1,
          limit: 6,
          sort: "createdAt",
          direction: "DESC",
          search: { productCollection: [category] },
        }),
      },
    });
  };
  ///product?input={"page":1,"limit":6,"sort":"createdAt","direction":"DESC","search":{"productCollection":["FRUITS"]}}
  return (
    <div className="category-main-container">
      <Stack className="container">
        <Stack className="categories">
          <Stack className="category-item" onClick={handleAllProducts}>
            <div className="category-img">
              <span>🛒</span>
            </div>
            <span className="category-name">All</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("VEGETABLES")}
          >
            <div className="category-img">
              <span>🍆</span>
            </div>
            <span className="category-name">Vegetables</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("FRUITS")}
          >
            <Box className="category-img">
              <span>🍓</span>
            </Box>
            <span className="category-name">Fruits</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("MEAT_EGGS")}
          >
            <Box className="category-img">
              <span>🥩</span>
            </Box>
            <span className="category-name">Meat & Eggs</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("MASHROOMS")}
          >
            <Box className="category-img">
              <span>🍄‍🟫</span>
            </Box>
            <span className="category-name">Mushrooms</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("MILK_BEVARAGES")}
          >
            <Box className="category-img">
              <span>🥛</span>
            </Box>
            <span className="category-name">Milk & Bevarages</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("HERBS")}
          >
            <Box className="category-img">
              <span>🌿</span>
            </Box>
            <span className="category-name">Herbs</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("NUTS")}
          >
            <Box className="category-img">
              <span>🥜</span>
            </Box>
            <span className="category-name">Nuts</span>
          </Stack>
          <Stack
            className="category-item"
            onClick={() => handleDirection("GRAINS")}
          >
            <Box className="category-img">
              <span>🌾</span>
            </Box>
            <span className="category-name">Grains</span>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default Category;
// 🍓🥩🥛🥛🍄‍🟫🧅🍆
