import { Box, Button, Stack } from "@mui/material";
import React from "react";
import CallIcon from "@mui/icons-material/Call";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const Advertisement = () => {
  return (
    <div className="advertisement-main-container">
      <Stack className="container">
        <Stack className="left">
          <img
            src="/img/homePage/basket-of-products.png"
            alt="advertising-image"
          />
        </Stack>
        <Stack className="right">
          <Stack className="left-intro">
            <span className="title">Fresh & Healthy</span>
            <h1 className="motto">Fast grocery deliveries is our passion</h1>
            <span className="description">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour.
            </span>
            <Stack className="ordering">
              <Button
                className="button"
                variant="contained"
                endIcon={<ArrowRightAltIcon />}
              >
                Order Now
              </Button>
              <Stack className="phone-number-container">
                <Box>
                  <CallIcon />
                </Box>
                <Stack className="call-now">
                  <span className="text">Call Now</span>
                  <span className="number">+58 6548 2365</span>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack className="right-image">
            <img
              src="/img/homePage/basket-holding-girl.png"
              alt="advertising-image"
            />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default Advertisement;
