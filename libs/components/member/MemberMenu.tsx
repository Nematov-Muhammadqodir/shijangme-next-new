import { Box, Button, List, ListItem, Stack, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// import HomeIcon from "@mui/icons-material/Home";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { Member } from "@/libs/types/member/member";
import { GET_MEMBER } from "@/apollo/user/query";
import { useQuery } from "@apollo/client";
import { T } from "@/libs/types/common";
import { REACT_APP_API_URL } from "@/libs/types/config";
import { MemberType } from "@/libs/enums/member.enum";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ScrollFade from "@/libs/components/common/MotionWrapper";

interface MemberMenuProps {
  subscribeHandler: any;
  unsubscribeHandler: any;
}
const MemberMenu = (props: MemberMenuProps) => {
  const { subscribeHandler, unsubscribeHandler } = props;
  const router = useRouter();
  const category: any = router.query?.category;
  const [member, setMember] = useState<Member | null>(null);
  const { memberId } = router.query;

  /** APOLLO REQUESTS **/
  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: memberId },
    skip: !memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("memberData", data?.getMember);
      setMember(data?.getMember);
    },
  });

  useEffect(() => {
    getMemberRefetch({ input: memberId });
  }, [router.query.memberId]);
  return (
    <Stack width={"100%"} padding={"30px 24px"}>
      <ScrollFade>
        <Stack className={"profile"}>
          <Box component={"div"} className={"profile-img"}>
            <img
              src={
                member?.memberImage
                  ? `${REACT_APP_API_URL}/${member?.memberImage}`
                  : "/img/profile/defaultImg.jpg"
              }
              alt={"member-photo"}
            />
          </Box>

          <Stack className={"user-info"}>
            <Typography className={"user-name"}>
              {member?.memberNick}
            </Typography>
            <Box component={"div"} className={"user-phone"}>
              <CallIcon />
              <Typography className={"p-number"}>
                {member?.memberPhone}
              </Typography>
            </Box>
            <Typography className={"view-list"}>
              {member?.memberType}
            </Typography>
          </Stack>
        </Stack>
      </ScrollFade>

      <ScrollFade>
        <Stack className="follow-button-box">
          {member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
            <>
              <Button
                variant="outlined"
                sx={{
                  background: "#b9b9b9",
                  ":hover": { background: "#fff", color: "black" },
                }}
                onClick={() =>
                  unsubscribeHandler(member?._id, getMemberRefetch, memberId)
                }
              >
                Unfollow
              </Button>
              <Typography>Following</Typography>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                background: "#ff5d18",
                ":hover": { background: "#fff", color: "black" },
              }}
              onClick={() =>
                subscribeHandler(member?._id, getMemberRefetch, memberId)
              }
            >
              Follow
            </Button>
          )}
        </Stack>
      </ScrollFade>
      <ScrollFade>
        <Stack className={"sections"}>
          <Stack className={"section"}>
            <Typography className="title" variant={"h5"}>
              Details
            </Typography>
            <List className={"sub-section"}>
              {member?.memberType === MemberType.VENDOR && (
                <ListItem className={category === "products" ? "focus" : ""}>
                  <Link
                    href={{
                      pathname: "/member",
                      query: { ...router.query, category: "products" },
                    }}
                    scroll={false}
                    style={{ width: "100%" }}
                  >
                    <div className={"flex-box flex-box-mine-follower"}>
                      {category === "products" ? (
                        <AutoAwesomeIcon style={{ color: "black" }} />
                      ) : (
                        <AutoAwesomeIcon style={{ color: "white" }} />
                      )}
                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        Products
                      </Typography>
                      <Typography className="count-title" variant="subtitle1">
                        {member.memberProducts}
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
              )}
              <ListItem className={category === "followers" ? "focus" : ""}>
                <Link
                  href={{
                    pathname: "/member",
                    query: { ...router.query, category: "followers" },
                  }}
                  scroll={false}
                  style={{ width: "100%" }}
                >
                  <div className={"flex-box flex-box-mine-follower"}>
                    {category === "followers" ? (
                      <AutoAwesomeIcon style={{ color: "black" }} />
                    ) : (
                      <AutoAwesomeIcon style={{ color: "white" }} />
                    )}
                    <Typography
                      className={"sub-title"}
                      variant={"subtitle1"}
                      component={"p"}
                    >
                      Followers
                    </Typography>
                    <Typography className="count-title" variant="subtitle1">
                      {member?.memberFollowers}
                    </Typography>
                  </div>
                </Link>
              </ListItem>
              <ListItem className={category === "followings" ? "focus" : ""}>
                <Link
                  href={{
                    pathname: "/member",
                    query: { ...router.query, category: "followings" },
                  }}
                  scroll={false}
                  style={{ width: "100%" }}
                >
                  <div className={"flex-box flex-box-mine-follower"}>
                    {category === "followings" ? (
                      <AutoAwesomeIcon style={{ color: "black" }} />
                    ) : (
                      <AutoAwesomeIcon style={{ color: "white" }} />
                    )}
                    <Typography
                      className={"sub-title"}
                      variant={"subtitle1"}
                      component={"p"}
                    >
                      Followings
                    </Typography>
                    <Typography className="count-title" variant="subtitle1">
                      {member?.memberFollowings}
                    </Typography>
                  </div>
                </Link>
              </ListItem>
            </List>
          </Stack>
          <Stack className={"section"} sx={{ marginTop: "130px" }}>
            <div>
              <Typography className="title" variant={"h5"}>
                Community
              </Typography>
              <List className={"sub-section"}>
                <ListItem className={category === "articles" ? "focus" : ""}>
                  <Link
                    href={{
                      pathname: "/member",
                      query: { ...router.query, category: "articles" },
                    }}
                    scroll={false}
                    style={{ width: "100%" }}
                  >
                    <div className={"flex-box flex-box-mine-follower"}>
                      {category === "articles" ? (
                        <AutoAwesomeIcon style={{ color: "black" }} />
                      ) : (
                        <AutoAwesomeIcon style={{ color: "white" }} />
                      )}

                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        Articles
                      </Typography>
                      <Typography className="count-title" variant="subtitle1">
                        {member?.memberArticles}
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
              </List>
            </div>
          </Stack>
        </Stack>
      </ScrollFade>
    </Stack>
  );
};

export default MemberMenu;
