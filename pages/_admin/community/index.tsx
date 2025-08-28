import { useMutation, useQuery } from "@apollo/client";
import {
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { AllBoardArticlesInquiry } from "../../../libs/types/board-article/board-article.input";
import { BoardArticle } from "../../../libs/types/board-article/board-article";
import {
  REMOVE_BOARD_ARTICLE_BY_ADMIN,
  UPDATE_BOARD_ARTICLE_BY_ADMIN,
} from "../../../apollo/admin/mutation";
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from "../../../apollo/admin/query";
import {
  BoardArticleCategory,
  BoardArticleStatus,
} from "../../../libs/enums/board-article.enum";
import { BoardArticleUpdate } from "../../../libs/types/board-article/board-article.update";
import { sweetErrorHandling } from "../../../libs/types/sweetAlert";
import CommunityHorizontalCard from "../../../libs/components/admin/CommunityHorizontalCard";
import withLayoutAdmin from "../../../libs/components/layout/AdminLayout";
import { T } from "../../../libs/types/common";

const Community = ({ initialInquiry, ...props }: any) => {
  const [anchorEl, setAnchorEl] = useState<any>([]);
  const [communityInquiry, setCommunityInquiry] =
    useState<AllBoardArticlesInquiry>(initialInquiry);
  const [articles, setArticles] = useState<BoardArticle[]>([]);
  const [articleTotal, setArticleTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState(
    communityInquiry?.search?.articleStatus
      ? communityInquiry?.search?.articleStatus
      : "ALL"
  );
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/
  const [updateBoardArticleAdmin] = useMutation(UPDATE_BOARD_ARTICLE_BY_ADMIN);
  const [removeBoardArticleByAdmin] = useMutation(
    REMOVE_BOARD_ARTICLE_BY_ADMIN
  );

  const {
    loading: getAllBoardArticlesByAdminLoading,
    data: getAllBoardArticlesByAdminData,
    error: getAllBoardArticlesByAdminError,
    refetch: getAllBoardArticlesByAdminRefetch,
  } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: communityInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setArticles(data?.getAllBoardArticlesByAdmin?.list);
      setArticleTotal(
        data?.getAllBoardArticlesByAdmin?.metaCounter[0]?.total ?? 0
      );
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
  }, [communityInquiry]);

  const textHandler = useCallback((value: string) => {
    try {
      setSearchText(value);
    } catch (err: any) {
      console.log("textHandler: ", err.message);
    }
  }, []);

  useEffect(() => {
    setCommunityInquiry({
      ...communityInquiry,
      search: {
        ...communityInquiry.search,
        text: searchText,
      },
    });
  }, [searchText]);

  const searchTypeHandler = async (newValue: string) => {
    console.log("new Value", newValue);
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setCommunityInquiry({
          ...communityInquiry,
          page: 1,
          search: {
            ...communityInquiry.search,
            articleCategory: newValue as BoardArticleCategory,
          },
        });
      } else {
        delete communityInquiry?.search?.articleCategory;
        setCommunityInquiry({ ...communityInquiry });
        await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };
  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };
  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const updateMemberHandler = async (updateData: BoardArticleUpdate) => {
    console.log("updateData:", updateData);
    try {
      await updateBoardArticleAdmin({
        variables: { input: updateData },
      });
      menuIconCloseHandler();
      await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    setCommunityInquiry({ ...communityInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ACTIVE":
        setCommunityInquiry({
          ...communityInquiry,
          search: { articleStatus: BoardArticleStatus.ACTIVE },
        });
        break;
      case "DELETE":
        setCommunityInquiry({
          ...communityInquiry,
          search: { articleStatus: BoardArticleStatus.DELETE },
        });
        break;
      default:
        delete communityInquiry?.search?.articleStatus;
        setCommunityInquiry({ ...communityInquiry });
        break;
    }
  };
  return (
    <div className="community-page">
      <Stack className="community-page-intro">
        <span className="page-name">Community Page</span>
        <span className="page-desc">View and Manage All Articles</span>
      </Stack>
      <div className="top-navigation">
        <List className={"tab-menu"}>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "ALL")}
            value="ALL"
            className={value === "ALL" ? "li on" : "li"}
          >
            All
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
            value="ACTIVE"
            className={value === "ACTIVE" ? "li on" : "li"}
          >
            Active
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "DELETE")}
            value="DELETE"
            className={value === "DELETE" ? "li on" : "li"}
          >
            Deleted
          </ListItem>
        </List>
      </div>
      <Stack className="community-list-main-container">
        <Stack className="search-container">
          <OutlinedInput
            value={searchText}
            onChange={(e: any) => textHandler(e.target.value)}
            sx={{ width: "100%" }}
            className={"search"}
            placeholder="Search product name"
            endAdornment={
              <>
                {searchText && (
                  <CancelRoundedIcon
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      setSearchText("");
                      setCommunityInquiry({
                        ...communityInquiry,
                        search: {
                          ...communityInquiry.search,
                          text: "",
                        },
                      });
                      await getAllBoardArticlesByAdminRefetch({
                        input: communityInquiry,
                      });
                    }}
                  />
                )}
                <InputAdornment position="end">
                  <img src="/img/icons/search_icon.png" alt={"searchIcon"} />
                </InputAdornment>
              </>
            }
          />
          <Select
            sx={{ width: "160px", ml: "20px" }}
            value={searchType}
            className="select-container"
          >
            <MenuItem value={"ALL"} onClick={() => searchTypeHandler("ALL")}>
              All
            </MenuItem>
            <MenuItem value={"FREE"} onClick={() => searchTypeHandler("FREE")}>
              Free
            </MenuItem>
            <MenuItem
              value={"RECOMMEND"}
              onClick={() => searchTypeHandler("RECOMMEND")}
            >
              Recommend
            </MenuItem>
            <MenuItem value={"NEWS"} onClick={() => searchTypeHandler("NEWS")}>
              News
            </MenuItem>
            <MenuItem
              value={"HUMOR"}
              onClick={() => searchTypeHandler("HUMOR")}
            >
              Humor
            </MenuItem>
          </Select>
        </Stack>
        <Stack className="community-list-container">
          <Stack className="community-list-header">
            <span className="mb-id">Article ID</span>
            <span className="nickname">Writer</span>
            <span className="phone">Article Title</span>
            <span className="type">Article Status</span>
            <span className="state">Article Type</span>
          </Stack>
          <Stack className="community-list">
            {articles.map((article, index) => {
              return (
                <CommunityHorizontalCard
                  article={article}
                  menuIconClickHandler={menuIconClickHandler}
                  anchorEl={anchorEl}
                  updateMemberHandler={updateMemberHandler}
                  menuIconCloseHandler={menuIconCloseHandler}
                  index={index}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

Community.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 1000,
    search: {},
  },
};

export default withLayoutAdmin(Community);
