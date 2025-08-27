import { Stack } from "@mui/material";
import React from "react";

const ProductBanner = () => {
  return (
    <div id="pc-wrap">
      <div className="container">
        <Stack className="product-banner">
          <Stack className="banner-text-layout">
            <span className="main-heading">
              The Smart Way to Shop for Groceries
            </span>
            <span className="subheading">
              Straight from trusted farms and brands to your table.
            </span>
            <span className="">Picked at Peak Freshness</span>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

// banner-products
export default ProductBanner;
