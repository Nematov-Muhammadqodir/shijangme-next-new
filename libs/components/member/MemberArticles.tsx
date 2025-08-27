import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Pagination, Stack, Typography } from "@mui/material";

import { useRouter } from "next/router";
import CommunityCard from "../common/CommunityCard";
import { T } from "../../types/common";
import { BoardArticle } from "../../types/board-article/board-article";
import { BoardArticlesInquiry } from "../../types/board-article/board-article.input";
import { useMutation, useQuery } from "@apollo/client";

import { Messages } from "@/libs/types/config";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/libs/types/sweetAlert";
import { LIKE_TARGET_BOARD_ARTICLE } from "@/apollo/user/mutation";
import { GET_BOARD_ARTICLES } from "@/apollo/user/query";
import ScrollFade from "@/libs/components/common/MotionWrapper";

const MemberArticles: NextPage = ({ initialInput, ...props }: any) => {
  // const device = useDeviceDetect();
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const { memberId } = router.query;
  const [searchFilter, setSearchFilter] =
    useState<BoardArticlesInquiry>(initialInput);
  const [memberBoArticles, setMemberBoArticles] = useState<BoardArticle[]>([]);

  /** APOLLO REQUESTS **/
  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

  const {
    loading: boardArticlesLoading,
    data: boardArticles,
    error: getboardArticlesError,
    refetch: boardArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMemberBoArticles(data?.getBoardArticles?.list);
      setTotal(data?.getBoardArticles?.metaCounter[0]?.total || 0);
    },
  });
  /** LIFECYCLES **/
  useEffect(() => {
    if (memberId)
      setSearchFilter({ ...initialInput, search: { memberId: memberId } });
  }, [memberId]);

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const likeArticleHandler = async (e: any, user: any, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      await likeTargetBoardArticle({
        variables: {
          input: id,
        },
      });

      await boardArticlesRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert("Success!", 800);
    } catch (err: any) {
      console.log("Error, likeMemberHandler", err);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  return (
    <div id="member-articles-page">
      <Stack className="main-title-box">
        <ScrollFade>
          <Stack className="right-box">
            <Typography className="main-title">Articles</Typography>
          </Stack>
        </ScrollFade>
      </Stack>
      <Stack className="articles-list-box">
        {memberBoArticles?.length === 0 && (
          <div className={"no-data"}>
            <ScrollFade>
              <img src="/img/icons/icoAlert.svg" alt="" />
            </ScrollFade>
            <ScrollFade>
              <p>No Articles found!</p>
            </ScrollFade>
          </div>
        )}
        {memberBoArticles?.map((boardArticle: BoardArticle) => {
          return (
            <ScrollFade>
              <CommunityCard
                likeArticleHandler={likeArticleHandler}
                boardArticle={boardArticle}
                key={boardArticle?._id}
                size={"small"}
              />
            </ScrollFade>
          );
        })}
      </Stack>
      {memberBoArticles?.length !== 0 && (
        <ScrollFade>
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(total / searchFilter.limit) || 1}
                page={searchFilter.page}
                shape="circular"
                color="primary"
                onChange={paginationHandler}
              />
            </Stack>
            <Stack className="total-result">
              <Typography>{total} property available</Typography>
            </Stack>
          </Stack>
        </ScrollFade>
      )}
    </div>
  );
};

MemberArticles.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default MemberArticles;
