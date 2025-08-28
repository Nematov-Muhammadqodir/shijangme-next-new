import {
  Box,
  Button,
  Fade,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import {
  BoardArticleCategory,
  BoardArticleStatus,
} from "../../enums/board-article.enum";
import { BoardArticle } from "../../types/board-article/board-article";

interface MemberHorizontalCardProps {
  article: BoardArticle;
  menuIconClickHandler: any;
  anchorEl: any;
  updateMemberHandler: any;
  menuIconCloseHandler: any;
  index: number;
}

const CommunityHorizontalCard = (props: MemberHorizontalCardProps) => {
  const {
    menuIconClickHandler,
    article,
    anchorEl,
    updateMemberHandler,
    menuIconCloseHandler,
    index,
  } = props;
  return (
    <div className="community-horiz-card-main">
      <Box className="id-container">
        <span className="id">{article?._id}</span>
      </Box>
      <Stack className="nick-img-container">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${article?.memberData?.memberImage}`}
          alt=""
        />
        <span className="nick">{article?.memberData?.memberNick}</span>
      </Stack>
      <Box className="phone-container">
        <span className="tel">{article?.articleTitle}</span>
      </Box>

      <Box className="status-container">
        <Button
          onClick={(e: any) => menuIconClickHandler(e, article?._id)}
          className={"status-change-btn badge success"}
        >
          {article?.articleStatus}
        </Button>

        {article?.articleStatus === BoardArticleStatus.ACTIVE && (
          <Menu
            className={"menu-modal"}
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl[article?._id]}
            open={Boolean(anchorEl[article?._id])}
            onClose={menuIconCloseHandler}
            TransitionComponent={Fade}
            sx={{ p: 1 }}
          >
            {Object.values(BoardArticleStatus)
              .filter((ele: string) => ele !== article?.articleStatus)
              .map((status: string) => (
                <MenuItem
                  onClick={() =>
                    updateMemberHandler({
                      _id: article?._id,
                      articleStatus: status,
                    })
                  }
                  key={status}
                >
                  <Typography variant={"subtitle1"} component={"span"}>
                    {status}
                  </Typography>
                </MenuItem>
              ))}
          </Menu>
        )}
      </Box>
      <Box className="type-container">
        <Button
          onClick={(e: any) => menuIconClickHandler(e, index)}
          className={"type-change-btn badge success"}
        >
          {article?.articleCategory}
        </Button>

        {article?.articleStatus === BoardArticleStatus.ACTIVE && (
          <Menu
            className={"menu-modal"}
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl[index]}
            open={Boolean(anchorEl[index])}
            onClose={menuIconCloseHandler}
            TransitionComponent={Fade}
            sx={{ p: 1 }}
          >
            {Object.values(BoardArticleCategory)
              .filter((ele) => ele !== article?.articleCategory)
              .map((type: string) => (
                <MenuItem
                  onClick={() =>
                    updateMemberHandler({
                      _id: article._id,
                      articleCategory: type,
                    })
                  }
                  key={type}
                >
                  <Typography variant={"subtitle1"} component={"span"}>
                    {type}
                  </Typography>
                </MenuItem>
              ))}
          </Menu>
        )}
      </Box>
    </div>
  );
};

export default CommunityHorizontalCard;
