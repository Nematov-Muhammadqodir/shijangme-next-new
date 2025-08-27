import { Stack } from "@mui/material";
import React from "react";

const BannerCard = () => {
  return (
    <div className="banner-card-main">
      <Stack className="banner-card-layout">
        <span className="title-main">
          Recommended <br /> For You!
        </span>
        <span className="title-secondary">
          Frequently Bought <br /> Together
        </span>
        <span className="recommendation-text">
          Explore Items That Complement Your Purchase
        </span>
        <div className="banner-tag-container">
          <img
            className="banner-tag"
            src="/img/products/yellow-star.svg"
            alt=""
          />
          <div className="tag-detail-container">
            <span className="tag-intro">STARTING AT</span>
            <span className="tag-price">$59.99</span>
            <span className="tag-text">Trusted by Hundreds</span>
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default BannerCard;
