// @ts-nocheck
import { formatDate } from "@/libs/types/config";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import React, { useEffect, useRef } from "react";

const ChatContainer = () => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    console.log("userID", selectedUser._id);
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  console.log("messages", messages);

  return (
    <div className="chat-main-container" ref={scrollableContainerRef}>
      {messages.map((message: any, i) => (
        <div
          className={`message-item ${
            message.senderId === authUser._id ? "end" : "start"
          }`}
          key={i}
          ref={messageEndRef}
        >
          <img
            src={
              message.senderId === authUser._id
                ? authUser?.profilePic
                  ? `http://72.60.41.172:4008/${authUser.profilePic}`
                  : "/img/profile/defaultImg.jpg"
                : selectedUser?.profilePic
                ? `http://72.60.41.172:4008/${selectedUser.profilePic}`
                : "/img/profile/defaultImg.jpg"
            }
            alt=""
          />
          <div className="message-item-text">
            <span>{message?.createdAt?.split("T")[0]}</span>
            <div className="text-container">
              <div>
                {message.image && (
                  <img
                    src={`${"http://72.60.41.172:4008"}${message.image}`}
                    alt="Attachment"
                    className="attached-image"
                  />
                )}
                {message.text && <p className="message-text">{message.text}</p>}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Optional: you can keep a dummy div to scroll to */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatContainer;
