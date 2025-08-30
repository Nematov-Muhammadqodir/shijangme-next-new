// @ts-nocheck
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/useAuthStore";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { MemberType } from "@/libs/enums/member.enum";
import CreateIcon from "@mui/icons-material/Create";

const ChatNavbar = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const handleHomeClick = () => {
    if (user.memberType === MemberType.ADMIN) {
      router.push("/_admin/users");
    } else {
      router.push("/");
    }
  };

  const handleProfilePage = () => {
    router.push("/chat/profile");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/chat/login");
  };

  const backToChat = router.pathname === "/chat";

  return (
    <div className="chat-navbar-main-container">
      <div className="chat-navbar-container">
        <div className="chat-logo-container" onClick={handleHomeClick}>
          <SendIcon />
          <span>Chatty</span>
        </div>
        <div className="chat-settings-container">
          {!backToChat && (
            <Button variant="outlined" onClick={() => router.push("/chat")}>
              <CreateIcon />
              <span>Chat</span>
            </Button>
          )}

          <Button variant="outlined" onClick={handleProfilePage}>
            <AdminPanelSettingsIcon />
            <span>Profile</span>
          </Button>

          <Button onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatNavbar;
