import React from "react";
import { Box, Button, Stack } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { userVar } from "../../../apollo/store";
import { logOut } from "../../auth";
import { REACT_APP_API_URL } from "../../types/config";

const LeftNavbar = () => {
  const router = useRouter();
  const currentPath = router.pathname; // gets current URL path
  const user = useReactiveVar(userVar);
  console.log("AdminUser", user);

  const handleRouteChange = (route: string) => {
    router.push(`/_admin/${route}`);
  };

  const handleChat = (route: string) => {
    router.push("/chat");
  };

  const handleLogout = () => {
    router.push("/product");
    logOut();
  };

  const handleLogin = () => {
    router.push("/account/join");
  };

  return (
    <div className="left-navbar-main">
      <Stack className="admin-info-box">
        <Box className="admin-profile-img">
          <img
            src={
              user?.memberImage
                ? `${REACT_APP_API_URL}/${user?.memberImage}`
                : `/img/profile/defaultImg.jpg`
            }
            alt={"member-photo"}
          />
        </Box>
        <Stack className="admin-info">
          <span className="name">{user?.memberNick}</span>
          <span className="phone">{user?.memberPhone}</span>
        </Stack>
      </Stack>

      <div className="divider"></div>

      <Stack className="menu-main-container">
        <span className="menu-title">Menu</span>
        <Stack className="menu-list">
          <Button
            className={
              currentPath === "/_admin/users" ? "users-btn-active" : "users-btn"
            }
            onClick={() => handleRouteChange("users")}
          >
            <GroupIcon className="icon" />
            <span className="text">Users</span>
          </Button>

          <Button
            className={
              currentPath === "/_admin/products"
                ? "users-btn-active"
                : "users-btn"
            }
            onClick={() => handleRouteChange("products")}
          >
            <LocalMallIcon className="icon" />
            <span className="text">Products</span>
          </Button>
          <Button
            className={
              currentPath === "/_admin/orders"
                ? "users-btn-active"
                : "users-btn"
            }
            onClick={() => handleRouteChange("orders")}
          >
            <DeliveryDiningIcon className="icon" />
            <span className="text">Orders</span>
          </Button>
          <Button
            className={
              currentPath === "/chat" ? "users-btn-active" : "users-btn"
            }
            onClick={() => router.push("/chat")}
          >
            <MarkChatUnreadIcon className="icon" />
            <span className="text">Chat</span>
          </Button>

          <Button
            className={
              currentPath === "/_admin/community"
                ? "users-btn-active"
                : "users-btn"
            }
            onClick={() => handleRouteChange("community")}
          >
            <SignLanguageIcon className="icon" />
            <span className="text">Community</span>
          </Button>

          <Button
            className={
              currentPath === "/_admin/cs" ? "users-btn-active" : "users-btn"
            }
            onClick={() => handleRouteChange("cs")}
          >
            <SupportAgentIcon className="icon" />
            <span className="text">Customer Service</span>
          </Button>
        </Stack>
      </Stack>

      <Stack className="logout-container">
        <Stack className="logo-container">
          <Stack className="logo-top">
            <img src="/img/logo/A.svg" alt="" className="big-a" />
            <img src="/img/logo/n.svg" alt="" />
            <img src="/img/logo/n.svg" alt="" />
            <img src="/img/logo/sma.svg" alt="" />
            <img src="/img/logo/c.svg" alt="" style={{ width: "15px" }} />
            <img src="/img/logo/b.svg" alt="" style={{ width: "17px" }} />
            <img
              src="/img/logo/i.svg"
              alt=""
              style={{
                width: "7px",
                height: "25px",
                paddingTop: "10px",
                marginRight: "3px",
              }}
            />
          </Stack>
        </Stack>
        {user._id ? (
          <Button
            className="logout-btn"
            endIcon={<MeetingRoomIcon />}
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        ) : (
          <Button
            className="logout-btn"
            endIcon={<MeetingRoomIcon />}
            onClick={() => handleLogin()}
          >
            Login
          </Button>
        )}
      </Stack>
    </div>
  );
};

export default LeftNavbar;
