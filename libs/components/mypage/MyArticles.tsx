import React, { useState } from "react";
import { NextPage } from "next";

import { Pagination, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { T } from "../../types/common";
import { BoardArticle } from "../../types/board-article/board-article";
import { GET_BOARD_ARTICLES } from "../../../apollo/user/query";
import { LIKE_TARGET_BOARD_ARTICLE } from "../../../apollo/user/mutation";

import CommunityCard from "../common/CommunityCard";
import { Messages } from "../../types/config";
import { sweetErrorAlert } from "../../types/sweetAlert";
import ScrollFade from "../common/MotionWrapper";

const MyArticles: NextPage = ({ initialInput, ...props }: T) => {
  const user = useReactiveVar(userVar);
  const [searchCommunity, setSearchCommunity] = useState({
    ...initialInput,
    search: { memberId: user._id },
  });
  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

  const {
    loading: getBoardArticlesLoading,
    data: getBoardArticlesData,
    error: getBoardArticlesError,
    refetch: getBoardArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: {
      input: searchCommunity,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBoardArticles(data?.getBoardArticles?.list);
      setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchCommunity({ ...searchCommunity, page: value });
  };

  const likeArticleHandler = async (e: any, user: any, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetBoardArticle({ variables: { input: id } });

      await getBoardArticlesRefetch({ input: searchCommunity });
    } catch (error: any) {
      console.log("Error, likeBoardArticleHandler", error);
      await sweetErrorAlert(error).then();
    }
  };

  return (
    <div id="my-articles-page">
      <ScrollFade>
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">Article</Typography>
            <Typography className="sub-title">
              We are glad to see you again!
            </Typography>
          </Stack>
        </Stack>
      </ScrollFade>
      <ScrollFade>
        <Stack className="article-list-box">
          {boardArticles?.length > 0 ? (
            boardArticles?.map((boardArticle: BoardArticle) => {
              return (
                <CommunityCard
                  likeArticleHandler={likeArticleHandler}
                  boardArticle={boardArticle}
                  key={boardArticle?._id}
                  size={"small"}
                />
              );
            })
          ) : (
            <div className={"no-data"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>No Articles found!</p>
            </div>
          )}
        </Stack>
      </ScrollFade>

      {boardArticles?.length > 0 && (
        <ScrollFade>
          <Stack className="pagination-conf">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(totalCount / searchCommunity.limit)}
                page={searchCommunity.page}
                shape="circular"
                onChange={paginationHandler}
              />
            </Stack>
            <Stack className="total">
              <Typography>
                Total {totalCount ?? 0} article(s) available
              </Typography>
            </Stack>
          </Stack>
        </ScrollFade>
      )}
    </div>
  );
};

MyArticles.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default MyArticles;
