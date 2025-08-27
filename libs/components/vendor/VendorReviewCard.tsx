import { Box, Stack } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Comment } from "@/libs/types/comment/comment";
import React from "react";
import { formatDate } from "@/libs/types/config";

interface VendorReviewCardProps {
  vendorComment: Comment;
}

const VendorReviewCard = (props: VendorReviewCardProps) => {
  const { vendorComment } = props;
  const like = true;
  return (
    <div className="vendor-review-card-main">
      <Stack className="review-card-layout">
        <Stack className="user-detail">
          <img src="/img/profile/defaultImg.jpg" alt="" />
          <Stack className="user-info">
            <span className="user-name">
              {vendorComment.memberData?.memberNick}
            </span>
            {/* @ts-ignore */}
            <span className="date">{formatDate(vendorComment.createdAt)}</span>
          </Stack>
        </Stack>
        <span className="review-content">{vendorComment.commentContent}</span>
        <div className="divider"></div>
      </Stack>
    </div>
  );
};

export default VendorReviewCard;
