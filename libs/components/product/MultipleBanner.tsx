import { Stack } from "@mui/material";
import React from "react";

const MultipleBanner = () => {
  return (
    <div className="multiple-banner-main" style={{ marginBottom: "150px" }}>
      <Stack className="multiple-banner">
        <Stack className="left">
          <img src="img/about-us/about3.jpg" alt="" />

          <img
            src="img/products/organic.svg"
            alt=""
            className="organic-image"
          />
        </Stack>
        <Stack className="right">
          <div className="top left">
            <img src="img/about-us/about1.jpg" alt="" />
          </div>
          <Stack className="bottom">
            <div className="left">
              <img src="img/about-us/about2.jpg" alt="" />
            </div>
            <div className="right left">
              <img src="img/about-us/about4.jpg" alt="" />
            </div>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default MultipleBanner;
