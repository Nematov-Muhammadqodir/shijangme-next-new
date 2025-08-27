import { Badge, Box, Button, Link, Menu, MenuItem, Stack } from "@mui/material";
import { withRouter } from "next/router";
import { useState } from "react";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import React from "react";
import { Logout } from "@mui/icons-material";
import StoreIcon from "@mui/icons-material/Store";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const Navbar = () => {
  const [user, setUser] = useState(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const [colorChange, setColorChange] = useState(false);
  const [languageAnchor, setLanguageAnchor] =
    React.useState<null | HTMLElement>(null);
  const langOpen = Boolean(languageAnchor);
  const logoutOpen = Boolean(logoutAnchor);

  const changeNavbarColor = () => {
    if (window.scrollY >= 150) {
      setColorChange(true);
    } else {
      setColorChange(false);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", changeNavbarColor);
  }
  return (
    <Stack
      className={`navbar-main ${colorChange ? "transparent" : ""}`}
      style={{ height: "100px" }}
    >
      <Stack className="container">
        <Stack className="top-navbar">
          <Box className="logo-box">
            <Link href={"/"}>
              {/* <img src="/img/logo/logoWhite.svg" alt="" /> */}
              Logo will be here
            </Link>
          </Box>
          <Box className="router-box">
            <Link href={"/"}>
              <div>Home</div>
            </Link>
            <Link href={"/product"}>
              <div>Products</div>
            </Link>
            <Link href={"/vendor"}>
              <div>Vendors</div>
            </Link>
            <Link href={"/community?articleCategory=FREE"}>
              <div>Community</div>
            </Link>
            {user && (
              <Link href={"/mypage"}>
                <div> My Page </div>
              </Link>
            )}
            <Link href={"/cs"}>
              <div>CS</div>
            </Link>
            {/* {user ? (
              <>
                <div
                  className={"login-user"}
                  onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
                >
                  <img
                    className="navbar-profile-image"
                    src={"/img/profile/defaultImg.jpg"}
                    alt=""
                  />
                </div>
                <Menu
                  id="basic-menu"
                  anchorEl={logoutAnchor}
                  open={logoutOpen}
                  onClose={() => {
                    setLogoutAnchor(null);
                  }}
                >
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>My account</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Link href={"/account/join"}>
                <div
                  className={"join-box"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "white",
                  }}
                >
                  <AccountCircleOutlinedIcon />
                  <span>Sign In</span>
                </div>
              </Link>
            )} */}
          </Box>
          <Box>
            <Stack className="get-in-touch">
              <Box className="calling-logo">
                <PhoneInTalkIcon />
              </Box>
              <Stack className="phone-number">
                <span>Get In Touch</span>
                <span>+58 6548 2365</span>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default withRouter(Navbar);
