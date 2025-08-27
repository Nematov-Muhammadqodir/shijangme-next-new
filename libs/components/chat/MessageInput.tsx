// @ts-nocheck
import React, { useRef, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { Send } from "@mui/icons-material";
import { T } from "@/libs/types/common";
import { sweetErrorHandling } from "@/libs/types/sweetAlert";
import { Messages } from "@/libs/types/config";
import { useChatStore } from "@/store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: T) => {
    const file = e.target.files?.[0];

    const fileType = file?.type,
      validateImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else {
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !fileInputRef.current?.files?.[0]) return;

    try {
      const formData = new FormData();
      formData.append("text", text.trim());
      if (fileInputRef.current?.files?.[0]) {
        formData.append("chatImage", fileInputRef.current.files[0]);
      }

      await sendMessage(formData);

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <div className="message-input-main">
        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message..."
            className="message-text-input"
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
          />

          <div className="message-sender">
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden-file-input"
              hidden
            />

            {/* MUI Image icon */}
            <ImageIcon
              style={{
                cursor: "pointer",
                color: imagePreview ? "#10b981" : "#888",
              }}
              onClick={handleImageIconClick}
            />
          </div>
          <button type="submit" className="btn btn-sm btn-circle">
            <Send />
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
