import { Stack } from "@mui/material";
import React from "react";

const AboutUsBanner = () => {
  return (
    <div className="about-us-banner">
      <Stack className="content-container">
        <span className="intro-title">
          Fresh, premium products sourced with care.
        </span>
        <span className="intro-subtitle">
          Committed to quality, sustainability,
          <br /> and customer satisfaction.
        </span>
      </Stack>
    </div>
  );
};

export default AboutUsBanner;
