// @ts-nocheck
import { MemberStatus, MemberType } from "@/libs/enums/member.enum";
import { REACT_APP_API_URL } from "@/libs/types/config";
import { Member } from "@/libs/types/member/member";
import { Product } from "@/libs/types/product/product";
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

interface MemberHorizontalCardProps {
  member?: Member;
  product?: Product;
  menuIconClickHandler: any;
  anchorEl: any;
  updateMemberHandler: any;
  menuIconCloseHandler: any;
  index: number;
}

const MemberHorizontalCard = (props: MemberHorizontalCardProps) => {
  const {
    menuIconClickHandler,
    member,
    anchorEl,
    updateMemberHandler,
    menuIconCloseHandler,
    index,
  } = props;
  return (
    <div className="member-horiz-card-main">
      <Box className="id-container">
        <span className="id">{member?._id}</span>
      </Box>
      <Stack className="nick-img-container">
        <img
          src={
            member?.memberImage
              ? `${REACT_APP_API_URL}/${member?.memberImage}`
              : `/img/profile/defaultImg.jpg`
          }
          alt=""
        />
        <span className="nick">{member?.memberNick}</span>
      </Stack>
      <Box className="phone-container">
        <span className="tel">{member?.memberPhone}</span>
      </Box>

      <Box className="status-container">
        <Button
          onClick={(e: any) => menuIconClickHandler(e, member?._id)}
          className={"status-change-btn badge success"}
        >
          {member?.memberStatus}
        </Button>

        <Menu
          className={"menu-modal"}
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl[member?._id]}
          open={Boolean(anchorEl[member?._id])}
          onClose={menuIconCloseHandler}
          TransitionComponent={Fade}
          sx={{ p: 1 }}
        >
          {Object.values(MemberStatus)
            .filter((ele: string) => ele !== member?.memberStatus)
            .map((status: string) => (
              <MenuItem
                onClick={() =>
                  updateMemberHandler({
                    _id: member?._id,
                    memberStatus: status,
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
      </Box>
      <Box className="type-container">
        <Button
          onClick={(e: any) => menuIconClickHandler(e, index)}
          className={"type-change-btn badge success"}
        >
          {member?.memberType}
        </Button>

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
          {Object.values(MemberType)
            .filter((ele) => ele !== member?.memberType)
            .map((type: string) => (
              <MenuItem
                onClick={() =>
                  updateMemberHandler({ _id: member._id, memberType: type })
                }
                key={type}
              >
                <Typography variant={"subtitle1"} component={"span"}>
                  {type}
                </Typography>
              </MenuItem>
            ))}
        </Menu>
      </Box>
    </div>
  );
};

export default MemberHorizontalCard;
