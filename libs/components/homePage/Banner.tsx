import { Box, Button, Stack } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="banner-main-container">
      <Box className="container">
        <Box className="banner">
          <Stack className="banner-left">
            <h4>FARM-FRESH</h4>
            <h1>
              Organic Goodness <br /> Everyday Greatness
            </h1>
            <p>
              There are many variations of passages of Lorem Ipsum available but
              the majority have suffered alteration in some.
            </p>
            <Link href={"/product"}>
              <Button
                className="banner-btn"
                variant="contained"
                sx={{ borderRadius: "24px" }}
                endIcon={<ArrowRightAltIcon />}
              >
                Shop Now
              </Button>
            </Link>
          </Stack>
          <Stack className="banner-right">
            <Box className="banner-right-image">
              <img src="/img/homePage/banner-products.png" alt="banner-image" />
            </Box>
            <Box className="banner-discount">
              <p>Save Upto</p>
              <span>
                50% <br /> OFF
              </span>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Banner;
