import {
  Box,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import PortraitIcon from "@mui/icons-material/Portrait";
import React from "react";

import { useReactiveVar } from "@apollo/client";

import CallIcon from "@mui/icons-material/Call";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { sweetConfirmAlert } from "../../types/sweetAlert";
import { userVar } from "../../../apollo/store";
import { logOut } from "../../auth";
import { REACT_APP_API_URL } from "../../types/config";
import ScrollFade from "../common/MotionWrapper";

const MyMenu = () => {
  const router = useRouter();
  const pathname = router.query.category ?? "myProfile";
  const category: any = router.query?.category ?? "myProfile";
  const user = useReactiveVar(userVar);

  /** HANDLERS **/
  const logoutHandler = async () => {
    if (await sweetConfirmAlert("Do you want to logout?")) {
      logOut();
    }
  };
  return (
    <Stack width={"100%"} padding={"30px 24px"}>
      <ScrollFade>
        <Stack className={"profile"}>
          <Box component={"div"} className={"profile-img"}>
            <img
              src={
                user?.memberImage
                  ? `${REACT_APP_API_URL}/${user?.memberImage}`
                  : `/img/profile/defaultImg.jpg`
              }
              alt={"member-photo"}
            />
          </Box>
          <Stack className={"user-info"}>
            <Typography className={"user-name"}>{user?.memberNick}</Typography>

            <Box component={"div"} className={"user-phone"}>
              <CallIcon />
              <Typography className={"p-number"}>
                {user?.memberPhone}
              </Typography>
            </Box>
            {user?.memberType === "vendor" ? (
              <a href="/_admin/users" target={"_blank"}>
                <Typography className={"view-list"}>
                  {user?.memberType}
                </Typography>
              </a>
            ) : (
              <Typography className={"view-list"}>
                {user?.memberType}
              </Typography>
            )}
          </Stack>
        </Stack>
      </ScrollFade>
      <ScrollFade>
        <Stack className={"sections"}>
          <ScrollFade>
            <Stack
              className={"section"}
              style={{
                height: user.memberType === "VENDOR" ? "318px" : "153px",
              }}
            >
              <Typography className="title" variant={"h5"}>
                MANAGE LISTINGS
              </Typography>

              <List className={"sub-section"}>
                {user?.memberType === "VENDOR" && (
                  <>
                    <ListItem
                      className={pathname === "addProduct" ? "focus" : ""}
                    >
                      <Link
                        href={{
                          pathname: "/mypage",
                          query: { category: "addProduct" },
                        }}
                        scroll={false}
                      >
                        <div className={"flex-box"}>
                          {category === "addProduct" ? (
                            <LibraryAddIcon style={{ color: "black" }} />
                          ) : (
                            <LibraryAddIcon style={{ color: "white" }} />
                          )}
                          <Typography
                            className={"sub-title"}
                            variant={"subtitle1"}
                            component={"p"}
                          >
                            Add Product
                          </Typography>
                        </div>
                      </Link>
                    </ListItem>
                    <ListItem
                      className={pathname === "myProducts" ? "focus" : ""}
                    >
                      <Link
                        href={{
                          pathname: "/mypage",
                          query: { category: "myProducts" },
                        }}
                        scroll={false}
                      >
                        <div className={"flex-box"}>
                          {category === "myProducts" ? (
                            <LocalMallIcon style={{ color: "black" }} />
                          ) : (
                            <LocalMallIcon style={{ color: "white" }} />
                          )}
                          <Typography
                            className={"sub-title"}
                            variant={"subtitle1"}
                            component={"p"}
                          >
                            My Products
                          </Typography>
                        </div>
                      </Link>
                    </ListItem>
                  </>
                )}
                <ListItem className={pathname === "myFavorites" ? "focus" : ""}>
                  <Link
                    href={{
                      pathname: "/mypage",
                      query: { category: "myFavorites" },
                    }}
                    scroll={false}
                  >
                    <div className={"flex-box"}>
                      {category === "myFavorites" ? (
                        <AutoAwesomeIcon style={{ color: "black" }} />
                      ) : (
                        <AutoAwesomeIcon style={{ color: "white" }} />
                      )}

                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        My Favorites
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className={pathname === "recentlyVisited" ? "focus" : ""}
                >
                  <Link
                    href={{
                      pathname: "/mypage",
                      query: { category: "recentlyVisited" },
                    }}
                    scroll={false}
                  >
                    <div className={"flex-box"}>
                      {category === "recentlyVisited" ? (
                        <BrowseGalleryIcon style={{ color: "black" }} />
                      ) : (
                        <BrowseGalleryIcon style={{ color: "white" }} />
                      )}

                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        Recently Visited
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem className={pathname === "followers" ? "focus" : ""}>
                  <Link
                    href={{
                      pathname: "/mypage",
                      query: { category: "followers" },
                    }}
                    scroll={false}
                  >
                    <div className={"flex-box"}>
                      {category === "followers" ? (
                        <PersonAddIcon style={{ color: "black" }} />
                      ) : (
                        <PersonAddIcon style={{ color: "white" }} />
                      )}
                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        My Followers
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem className={pathname === "followings" ? "focus" : ""}>
                  <Link
                    href={{
                      pathname: "/mypage",
                      query: { category: "followings" },
                    }}
                    scroll={false}
                  >
                    <div className={"flex-box"}>
                      {category === "followings" ? (
                        <PersonRemoveIcon style={{ color: "black" }} />
                      ) : (
                        <PersonRemoveIcon style={{ color: "white" }} />
                      )}

                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        My Followings
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem className={pathname === "order" ? "focus" : ""}>
                  <Link
                    href={{
                      pathname: "/mypage",
                      query: { category: "order" },
                    }}
                    scroll={false}
                  >
                    <div className={"flex-box"}>
                      {category === "order" ? (
                        <DeliveryDiningIcon style={{ color: "black" }} />
                      ) : (
                        <DeliveryDiningIcon style={{ color: "white" }} />
                      )}

                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        My Orders
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
              </List>
            </Stack>
          </ScrollFade>
          <ScrollFade>
            <Stack className={"section"} sx={{ marginTop: "50px" }}>
              <div style={{ marginTop: "30px" }}>
                <Typography className="title" variant={"h5"}>
                  Community
                </Typography>

                <List className={"sub-section"}>
                  <ListItem
                    className={pathname === "myArticles" ? "focus" : ""}
                  >
                    <Link
                      href={{
                        pathname: "/mypage",
                        query: { category: "myArticles" },
                      }}
                      scroll={false}
                    >
                      <div className={"flex-box"}>
                        {category === "myArticles" ? (
                          <CardMembershipIcon style={{ color: "black" }} />
                        ) : (
                          <CardMembershipIcon style={{ color: "white" }} />
                        )}

                        <Typography
                          className={"sub-title"}
                          variant={"subtitle1"}
                          component={"p"}
                        >
                          Articles
                        </Typography>
                      </div>
                    </Link>
                  </ListItem>

                  <ListItem
                    className={pathname === "writeArticle" ? "focus" : ""}
                  >
                    <Link
                      href={{
                        pathname: "/mypage",
                        query: { category: "writeArticle" },
                      }}
                      scroll={false}
                    >
                      <div className={"flex-box"}>
                        {category === "writeArticle" ? (
                          <HistoryEduIcon style={{ color: "black" }} />
                        ) : (
                          <HistoryEduIcon style={{ color: "white" }} />
                        )}
                        <Typography
                          className={"sub-title"}
                          variant={"subtitle1"}
                          component={"p"}
                        >
                          Write Article
                        </Typography>
                      </div>
                    </Link>
                  </ListItem>
                </List>
              </div>
            </Stack>
          </ScrollFade>
          <ScrollFade>
            <Stack className={"section"} sx={{ marginTop: "30px" }}>
              <ScrollFade>
                <Typography className="title" variant={"h5"}>
                  MANAGE ACCOUNT
                </Typography>
              </ScrollFade>
              <ScrollFade>
                <List className={"sub-section"}>
                  <ListItem className={pathname === "myProfile" ? "focus" : ""}>
                    <Link
                      href={{
                        pathname: "/mypage",
                        query: { category: "myProfile" },
                      }}
                      scroll={false}
                    >
                      <div
                        className={"flex-box"}
                        style={{
                          paddingLeft: category === "myProfile" ? "10px" : "",
                        }}
                      >
                        {category === "myProfile" ? (
                          <AssignmentIndIcon style={{ color: "black" }} />
                        ) : (
                          <AssignmentIndIcon style={{ color: "white" }} />
                        )}
                        <Typography
                          className={"sub-title"}
                          variant={"subtitle1"}
                          component={"p"}
                        >
                          My Profile
                        </Typography>
                      </div>
                    </Link>
                  </ListItem>
                  <ListItem onClick={logoutHandler}>
                    <div className={"flex-box"}>
                      <MeetingRoomIcon style={{ color: "white" }} />
                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                        // onClick={logoutHandler}
                      >
                        Logout
                      </Typography>
                    </div>
                  </ListItem>
                </List>
              </ScrollFade>
            </Stack>
          </ScrollFade>
        </Stack>
      </ScrollFade>
    </Stack>
  );
};

export default MyMenu;
