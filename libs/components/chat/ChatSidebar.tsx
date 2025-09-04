// @ts-nocheck
import React, { useEffect, useState } from "react";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import { Box, Button } from "@mui/material";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

const ChatSidebar = () => {
  const { getUsers, users, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  console.log("users", users);

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <div className="sidebar-main-container">
      <div className="sidebar-header">
        <ContactMailOutlinedIcon />
        <span>Contacts</span>
      </div>
      <div className="border"></div>
      <div className="contact-list-container">
        {filteredUsers.map((user) => {
          return (
            <Button
              className={`user-container-btn ${
                selectedUser?._id === user._id ? "selected" : ""
              }`}
              key={user._id}
              onClick={() => setSelectedUser(user)}
              fullWidth
              sx={{
                p: 1.5, // padding similar to p-3 (12px)
                display: "flex",
                alignItems: "center",
                gap: 1.5, // gap-3 (12px)
                transition: "background-color 0.3s ease",
                bgcolor:
                  selectedUser?._id === user._id
                    ? "background.paper"
                    : "transparent", // or use your theme color like "action.hover"
                borderRadius: 1, // optional, to give some rounding if needed
                boxShadow:
                  selectedUser?._id === user._id
                    ? "0 0 0 1px rgba(144, 238, 144, 0.3)" // simulating ring-1 effect
                    : "none",
                "&:hover": {
                  bgcolor: "action.hover", // or your desired hover bg color
                },
              }}
            >
              <img
                src={
                  user?.profilePic
                    ? `${process.env.NEXT_PUBLIC_CHAT_URL}/${user.profilePic}`
                    : "/img/profile/defaultImg.jpg"
                }
                alt=""
              />
              <div className="user-info-container">
                <span style={{ fontWeight: "600", fontSize: "16px" }}>
                  {user.fullName}
                </span>
                {onlineUsers.includes(user._id) && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12, // size-3 is 0.75rem = 12px
                      height: 12,
                      bgcolor: "green", // or use a green color code like '#22c55e'
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: "background.paper", // similar to ring-zinc-900 (dark ring), adjust if needed
                      boxSizing: "content-box",
                    }}
                  />
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
