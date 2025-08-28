import { Box, Button, Pagination, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useQuery, useReactiveVar } from "@apollo/client";
import { FollowInquiry } from "../../types/follow/follow.input";
import { userVar } from "../../../apollo/store";
import { Follower } from "../../types/follow/follow";
import { GET_MEMBER_FOLLOWERS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import ScrollFade from "../common/MotionWrapper";
import { REACT_APP_API_URL } from "../../types/config";

interface MemberFollowsProps {
  initialInput: FollowInquiry;
  subscribeHandler: any;
  unsubscribeHandler: any;
  redirectToMemberPageHandler: any;
  likeMemberHandler: any;
}

const MemberFollowers = (props: MemberFollowsProps) => {
  const {
    initialInput,
    subscribeHandler,
    unsubscribeHandler,
    redirectToMemberPageHandler,
    likeMemberHandler,
  } = props;
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();
  const category: any = router.query?.category ?? "products";
  const [followInquiry, setFollowInquiry] =
    useState<FollowInquiry>(initialInput);
  const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);
  const user = useReactiveVar(userVar);
  console.log("MFuser", user);

  /** APOLLO REQUESTS **/

  console.log("Apollo Inquery", followInquiry);
  const {
    loading: getMemberFollowersLoading,
    data: getMemberFollowersData,
    error: getMemberFollowersError,
    refetch: getMemberFollowersRefetch,
  } = useQuery(GET_MEMBER_FOLLOWERS, {
    fetchPolicy: "network-only",
    variables: { input: followInquiry },
    skip: !followInquiry.search.followingId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("memberFollowers", data?.getMemberFollowers);
      setMemberFollowers(data?.getMemberFollowers?.list);
      setTotal(data?.getMemberFollowers?.metaCounter[0]?.total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.memberId)
      setFollowInquiry({
        ...followInquiry,
        search: { followingId: router.query.memberId as string },
      });
    else
      setFollowInquiry({
        ...followInquiry,
        search: { followingId: user?._id },
      });
  }, [router]);

  useEffect(() => {
    getMemberFollowersRefetch({ input: followInquiry });
  }, [followInquiry]);
  /** HANDLERS **/
  const paginationHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    followInquiry.page = value;
    setFollowInquiry({ ...followInquiry });
  };
  return (
    <div id="member-follows-page">
      <Stack className="main-title-box">
        <ScrollFade>
          <Stack className="right-box">
            <Typography className="main-title">
              {category === "followers" ? "Followers" : "Followings"}
            </Typography>
          </Stack>
        </ScrollFade>
      </Stack>

      <Stack className="follows-list-box">
        <ScrollFade>
          <Stack className="listing-title-box">
            <Typography className="title-text">Name</Typography>
            <Typography className="title-text">Details</Typography>
            <Typography className="title-text">Subscription</Typography>
          </Stack>
        </ScrollFade>
        {memberFollowers?.length === 0 && (
          <div className={"no-data"}>
            <img src="/img/icons/icoAlert.svg" alt="" />
            <p>No Followers yet!</p>
          </div>
        )}
        {memberFollowers.map((follower: Follower) => {
          console.log("followerImage", follower);
          const imagePath: string = follower?.followerData?.memberImage
            ? `${REACT_APP_API_URL}/${follower?.followerData?.memberImage}`
            : "/img/profile/defaultImg.jpg";
          return (
            <Stack className="follows-card-box" key={follower._id}>
              <Stack
                className={"info"}
                onClick={() =>
                  redirectToMemberPageHandler(follower?.followerData?._id)
                }
              >
                <Box className="image-box">
                  <img src={imagePath} alt="" />
                </Box>
                <Box className="information-box">
                  <Typography className="name">
                    {follower?.followerData?.memberNick}
                  </Typography>
                </Box>
              </Stack>
              <Stack className={"details-box"}>
                <Box className={"info-box"} component={"div"}>
                  <p>Followers</p>
                  <span>({follower?.followerData?.memberFollowers})</span>
                </Box>
                <Box className={"info-box"} component={"div"}>
                  <p>Followings</p>
                  <span>({follower?.followerData?.memberFollowings})</span>
                </Box>
                <Box className={"info-box"} component={"div"}>
                  {follower?.meLiked && follower?.meLiked[0]?.myFavorite ? (
                    <FavoriteIcon
                      color="primary"
                      onClick={() =>
                        likeMemberHandler(
                          follower?.followerData?._id,
                          getMemberFollowersRefetch,
                          followInquiry
                        )
                      }
                    />
                  ) : (
                    <FavoriteBorderIcon
                      onClick={() =>
                        likeMemberHandler(
                          follower?.followerData?._id,
                          getMemberFollowersRefetch,
                          followInquiry
                        )
                      }
                    />
                  )}
                  <span>({follower?.followerData?.memberLikes})</span>
                </Box>
              </Stack>
              {user?._id !== follower?.followerId && (
                <Stack className="action-box">
                  {follower.meFollowed &&
                  follower.meFollowed[0]?.myFollowing ? (
                    <>
                      <Typography>Following</Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          background: "#ed5858",
                          ":hover": { background: "#ee7171" },
                        }}
                        onClick={() =>
                          unsubscribeHandler(
                            follower?.followerData?._id,
                            getMemberFollowersRefetch,
                            followInquiry
                          )
                        }
                      >
                        Unfollow
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        color: "white !important",
                        background: "#280559",
                        borderRadius: "15px",
                        width: "150px",
                        height: "40px",
                        ":hover": { background: "#3c1475" },
                      }}
                      onClick={() =>
                        subscribeHandler(
                          follower?.followerData?._id,
                          getMemberFollowersRefetch,
                          followInquiry
                        )
                      }
                    >
                      Follow
                    </Button>
                  )}
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
      {memberFollowers.length !== 0 && (
        <Stack className="pagination-config">
          <Stack className="pagination-box">
            <Pagination
              page={followInquiry.page}
              count={Math.ceil(total / followInquiry.limit)}
              onChange={paginationHandler}
              shape="circular"
              color="primary"
            />
          </Stack>
          <Stack className="total-result">
            <Typography>{total} followers</Typography>
          </Stack>
        </Stack>
      )}
    </div>
  );
};

MemberFollowers.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    search: {
      followingId: "",
    },
  },
};

export default MemberFollowers;
