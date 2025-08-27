import { Stack } from "@mui/material";
import React from "react";

const Introduction = () => {
  return (
    <div className="about-us-introduction">
      <Stack className="introduction-main-layout">
        <Stack className="intro-left-config">
          <span className="left-top">Our Stories</span>
          <span className="left-bottom">
            Exquisite Electrical For <br /> Solutions Discerning Clients
          </span>
        </Stack>
        <Stack className="intro-right-config">
          <span className="right-top">
            we believe that every great product carries a story — a story of
            passion, dedication, and trust. What started as a small idea has now
            grown into a vision to serve people with products and services that
            truly make a difference in their everyday lives.
          </span>
          <span className="right-bottom">
            From the very beginning, our goal has been simple: to create an
            experience where quality meets reliability. We understand that
            today’s customers are not just looking for something to buy; they
            are searching for something they can believe in
          </span>
        </Stack>
      </Stack>
    </div>
  );
};

export default Introduction;
