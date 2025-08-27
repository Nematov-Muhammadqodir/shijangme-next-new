// @ts-nocheck
import React from "react";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

const MessageNavbar = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  if (!selectedUser) return <div>User not selected...</div>;
  return (
    <div className="chosen-user-main-header">
      <div className="chosen">
        <img
          src={
            `${"http://localhost:3002"}/${selectedUser?.profilePic}` ||
            "/img/profile/defaultImg.jpg"
          }
          alt=""
        />
        <div className="user-status">
          <span style={{ fontWeight: "600", fontSize: "16px" }}>
            {selectedUser.fullName}
          </span>
          <span style={{ fontStyle: "italic" }}>
            {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
          </span>
        </div>
      </div>
      <div onClick={() => setSelectedUser(null)}>
        <CancelScheduleSendIcon />
      </div>
    </div>
  );
};

export default MessageNavbar;
