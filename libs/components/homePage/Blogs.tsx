import { Button, Stack } from "@mui/material";
import React, { useState } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import BlogsCard from "./BlogsCard";
import { useRouter } from "next/router";
import { GET_BOARD_ARTICLES } from "@/apollo/user/query";
import { useQuery } from "@apollo/client";
import { BoardArticle } from "@/libs/types/board-article/board-article";

const Blogs = () => {
  const blogs = [1, 2, 3];
  const router = useRouter();
  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const {
    loading: boardArticlesLoading,
    data: boardArticlesData,
    error: boardArticlesError,
    refetch: boardArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 3,
        sort: "createdAt",
        direction: "ASC",
        search: {
          // articleCategory: "FREE",
        },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBoardArticles(data?.getBoardArticles?.list);
      setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
    },
  });
  const handleCommunityPage = () => {
    router.push("/community");
  };
  return (
    <div className="blogs-main-container">
      <Stack className="container">
        <Stack className="blogs-intro">
          <h2>News & Articles</h2>
        </Stack>
        <Stack className="blog-cards-list-container">
          {boardArticles.map((boardArticle) => {
            return (
              <BlogsCard key={boardArticle._id} boardArticle={boardArticle} />
            );
          })}
        </Stack>

        <Stack className="btn-container">
          <Button
            endIcon={<KeyboardDoubleArrowRightIcon />}
            variant="contained"
            onClick={handleCommunityPage}
          >
            View All Blogs
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default Blogs;
