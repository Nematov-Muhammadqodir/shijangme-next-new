import { Box, Button, Stack } from "@mui/material";
import React from "react";

const DoubleCardBanner = () => {
  return (
    <div className="double-card-main">
      <Stack className="container">
        <Box className="left-banner">
          <img src="/img/products/fruits-in-basket.png" alt="" />
          <Stack className="banner-info">
            <span className="title">Fresh Picks of the Season</span>
            <span className="desc">Nature’s Sweetness, Delivered Fresh</span>
            <span className="price">
              Starts From <span className="amount">$2.99 - 5.99</span>
            </span>
            <Button className="left-btn">Shop Now</Button>
          </Stack>
        </Box>
        <Box className="right-banner">
          <img src="/img/products/meat-with-knife.png" alt="" />
          <Stack className="right-banner-info">
            <span className="intro">
              From Farm to Table,
              <br /> Perfect Cuts
            </span>
            <span className="price">
              Gourmet Cuts From <span className="amount"> $7.99</span>
            </span>
            <Button className="right-btn">Shop Now</Button>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

export default DoubleCardBanner;
