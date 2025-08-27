import { BoardArticle } from "@/libs/types/board-article/board-article";
import { formatDate, REACT_APP_API_URL } from "@/libs/types/config";
import { Box, Stack } from "@mui/material";
import React from "react";

interface BlogCardProps {
  boardArticle: BoardArticle;
}

const BlogsCard = (props: BlogCardProps) => {
  const { boardArticle } = props;

  const imagePath: string = boardArticle?.articleImage
    ? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
    : "/img/homePage/article-default.jpg";

  return (
    <div className="blog-card-main-container">
      <Stack className="blog-card">
        <Stack className="blog-img-container">
          <img src={imagePath} alt="blog-image" />
        </Stack>
        <Stack className="blog-info-container">
          <Stack className="blog-intro">
            <Box className="blog-type">{boardArticle.articleCategory}</Box>
            <span className="date">{formatDate(boardArticle.createdAt)}</span>
          </Stack>
          <p className="blog-title">{boardArticle.articleTitle}</p>
          <div className="divider"></div>
          <p className="blog-content">{boardArticle.articleContent}</p>
        </Stack>
      </Stack>
    </div>
  );
};

export default BlogsCard;
