import { Stack } from "@mui/material";
import React from "react";

const OurBrands = () => {
  return (
    <div className="our-brands-main-container">
      <Stack className="container">
        <Stack className="brands-layout">
          <span className="brands-title">Our Top Brands</span>
          <Stack className="brands-list">
            <img className="size" src="/img/general/first-brand.svg" alt="" />
            <img className="size" src="/img/general/second-brand.svg" alt="" />
            <img className="size" src="/img/general/third-brand.svg" alt="" />
            <img className="size" src="/img/general/forth-brand.svg" alt="" />
            <img className="size" src="/img/general/fifth-brand.svg" alt="" />
            <img className="size" src="/img/general/sixth-brand.svg" alt="" />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default OurBrands;
