import { Stack } from "@mui/material";
import { Comment } from "../../types/comment/comment";
import React from "react";
import { formatDate } from "../../types/config";

interface VendorReviewCardProps {
  vendorComment: Comment;
}

const VendorReviewCard = (props: VendorReviewCardProps) => {
  const { vendorComment } = props;
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
