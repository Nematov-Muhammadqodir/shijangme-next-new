import { Badge, Box, Button, Menu, MenuItem, Stack } from "@mui/material";
import { useRouter, withRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import React from "react";
import { Logout } from "@mui/icons-material";
import StoreIcon from "@mui/icons-material/Store";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { getJwtToken, logOut, updateStorage, updateUserInfo } from "../auth";
import { Product } from "../types/product/product";
import { GET_FAVORITES, GET_MEMBER } from "@/apollo/user/query";
import { T } from "../types/common";
import { useSelector } from "react-redux";
import { wishListValue } from "@/slices/wishListSlice";
import { cartItemsValue } from "@/slices/cartSlice";
import { Messages, REACT_APP_API_URL } from "../types/config";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { Member } from "../types/member/member";
import { UPDATE_MEMBER } from "@/apollo/user/mutation";
import { MemberUpdate } from "../types/member/member.update";
import {
  sweetErrorHandling,
  sweetMixinSuccessAlert,
} from "../types/sweetAlert";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const Navbar = ({ initialValues, ...props }: any) => {
  const user = useReactiveVar(userVar);
  const [myFavorites, setMyFavorites] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFavorites, setSearchFavorites] = useState<T>({
    page: 1,
    limit: 6,
  });
  const wishListAmount = useSelector(wishListValue);
  const cartItems = useSelector(cartItemsValue);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const [colorChange, setColorChange] = useState(false);
  const [languageAnchor, setLanguageAnchor] =
    React.useState<null | HTMLElement>(null);
  const langOpen = Boolean(languageAnchor);
  const logoutOpen = Boolean(logoutAnchor);
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);
  const { t, i18n } = useTranslation("common");
  const [lang, setLang] = useState<string | null>("en");

  /** LIFECYCLES **/
  useEffect(() => {
    if (localStorage.getItem("locale") === null) {
      localStorage.setItem("locale", "en");
      setLang("en");
    } else {
      setLang(localStorage.getItem("locale"));
    }
  }, [router]);

  const langChoice = useCallback(
    async (e: any) => {
      setLang(e.target.id);
      localStorage.setItem("locale", e.target.id);
      setLanguageAnchor(null);
      await router.push(router.asPath, router.asPath, { locale: e.target.id });
    },
    [router]
  );

  /** APOLLO REQUESTS **/
  const [updateMember] = useMutation(UPDATE_MEMBER);
  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: user._id },
    skip: !user._id,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("memberData", data?.getMember);
      setMember(data?.getMember);
    },
  });

  const updateNewProductHandler = useCallback(async () => {
    try {
      if (!member?._id) throw new Error(Messages.error2);

      const updateData: MemberUpdate = {
        _id: member._id,
        newProductAmount: 0, // reset to 0
      };

      const result = await updateMember({
        variables: { input: updateData },
      });

      // @ts-ignore
      const jwtToken = result.data.updateMember?.accessToken;
      await updateStorage({ jwtToken });
      updateUserInfo(jwtToken);

      // Update frontend state so badge immediately shows 0
      const updatedMember = {
        ...member,
        newProductAmount: 0,
      };
      setMember(updatedMember);
      userVar({
        ...userVar(),
        ...updatedMember,
      });

      await sweetMixinSuccessAlert("You can see new products!");
      router.push("/product");
    } catch (err: any) {
      console.log("Error, updateProfileHandler", err);
      sweetErrorHandling(err).then();
    }
  }, [member]);

  const handleMyPage = async () => {
    await router.push(`${router.query.referrer ?? "/mypage"}`);
  };

  const handleWishList = async () => {
    await router.push({
      pathname: "/mypage",
      query: { category: "myFavorites" },
    });
  };
  const handleCart = async () => {
    await router.push({ pathname: "/cart" });
  };

  const handleChat = async () => {
    await router.push({ pathname: "/chat" });
  };

  const {
    loading: loadingFavorites,
    error: errorFavorites,
    data: dataFavorites,
    refetch: refetchFavorites,
  } = useQuery(GET_FAVORITES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: searchFavorites.page,
        limit: searchFavorites.limit,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getFavorites) {
        setMyFavorites(data.getFavorites.list);
        setTotal(data.getFavorites.metaCounter[0].total);
      }
    },
  });

  const imagePath = user.memberImage
    ? `${REACT_APP_API_URL}/${user.memberImage}`
    : "/img/profile/defaultImg.jpg";

  useEffect(() => {
    const changeNavbarColor = () => {
      if (window.scrollY >= 200) {
        setColorChange(true);
      } else {
        setColorChange(false);
      }
    };

    window.addEventListener("scroll", changeNavbarColor);

    return () => {
      window.removeEventListener("scroll", changeNavbarColor);
    };
  }, []);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  return (
    <Stack className={`navbar-main ${colorChange ? "transparent" : ""}`}>
      <Stack className="container">
        <Stack
          className={`top-navbar ${colorChange ? "transparent" : ""}`}
          sx={{
            color: colorChange ? "green" : "transparent",
          }}
        >
          <Box className={`logo-box ${colorChange ? "black" : ""}`}>
            <Link href={"/"}>
              <Stack className="logo-config">
                <Stack className="logo-top">
                  <img src="/img/logo/A.svg" alt="" className="big-a" />
                  <img src="/img/logo/n.svg" alt="" />
                  <img src="/img/logo/n.svg" alt="" />
                  <img src="/img/logo/sma.svg" alt="" />
                  <img src="/img/logo/c.svg" alt="" style={{ width: "15px" }} />
                  <img src="/img/logo/b.svg" alt="" style={{ width: "17px" }} />
                  <img
                    src="/img/logo/i.svg"
                    alt=""
                    style={{
                      width: "7px",
                      height: "25px",
                      paddingTop: "10px",
                      marginRight: "3px",
                    }}
                  />
                </Stack>
                <Stack className="logo-bottom">
                  <img src="/img/logo/wK.svg" alt="" className="big-a" />
                  <img src="/img/logo/wa.svg" alt="" />
                  <img src="/img/logo/wd.svg" alt="" />
                  <img src="/img/logo/wa.svg" alt="" />
                  <img
                    src="/img/logo/wi.svg"
                    alt=""
                    style={{ width: "15px" }}
                  />
                </Stack>
              </Stack>
            </Link>
          </Box>
          <Box className={`router-box ${colorChange ? "black" : ""}`}>
            <Link href={"/"}>
              <div>{t("Home")}</div>
            </Link>
            <Link href={"/product"}>
              <div>{t("Products")}</div>
            </Link>
            <Link href={"/vendor"}>
              <div>{t("Vendors")}</div>
            </Link>
            <Link href={"/community?articleCategory=FREE"}>
              <div>{t("Community")}</div>
            </Link>
            {user?._id && (
              <Link href={"/mypage"}>
                <div> {t("My Page")} </div>
              </Link>
            )}
            <Link href={"/cs"}>
              <div>{t("CS")}</div>
            </Link>
          </Box>
          <Box>
            <Stack className={`get-in-touch ${colorChange ? "black" : ""}`}>
              <Box className="calling-logo">
                <PhoneInTalkIcon />
              </Box>
              <Stack className="phone-number">
                <span>{t("Get In Touch")}</span>
                <span>010 8094 0023</span>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <div className="divider"></div>

        <Stack className="bottom-navbar">
          <Stack className="select-lang-container">
            <Button
              id="basic-button"
              aria-controls={langOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={langOpen ? "true" : undefined}
              onClick={(event: any) => setLanguageAnchor(event.currentTarget)}
              variant="contained"
              endIcon={<LanguageIcon />}
            >
              {lang === "kr"
                ? "한국어"
                : lang === "uz"
                ? "Oʻzbekcha"
                : "English"}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={languageAnchor}
              open={langOpen}
              onClose={() => {
                setLanguageAnchor(null);
              }}
            >
              <MenuItem onClick={langChoice} id="en">
                English
              </MenuItem>
              <MenuItem onClick={langChoice} id="kr">
                Korean
              </MenuItem>
              <MenuItem onClick={langChoice} id="uz">
                Uzbek
              </MenuItem>
            </Menu>
            {user?._id && (
              <Badge
                badgeContent={member?.newProductAmount}
                color="primary"
                onClick={updateNewProductHandler}
              >
                <NotificationsOutlinedIcon className={"notification-icon"} />
              </Badge>
            )}
          </Stack>
          <Stack className="bottom-navbar-info">
            <Box className="about-us">
              <Link href={"/about-us"}>
                <div>
                  <StoreIcon />
                  <div>{t("About Us")}</div>
                </div>
              </Link>
            </Box>
            {user?._id && (
              <Box className="chat" onClick={handleChat}>
                <div>
                  <ForumOutlinedIcon />
                  <div>{t("Chat")}</div>
                </div>
              </Box>
            )}

            {user?._id && (
              <Box className="wish-list" onClick={handleWishList}>
                <Badge badgeContent={wishListAmount} color="primary">
                  <FavoriteBorderIcon />
                </Badge>
                <span>{t("Wish List")}</span>
              </Box>
            )}

            {user?._id && (
              <Box className="cart" onClick={handleCart}>
                <Badge badgeContent={cartItems.length} color="primary">
                  <AddShoppingCartIcon />
                </Badge>
                <span>{t("Cart")}</span>
              </Box>
            )}

            {user?._id ? (
              <>
                <div
                  className={"login-user"}
                  onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
                >
                  <img
                    className="navbar-profile-image"
                    src={imagePath}
                    alt=""
                  />
                </div>
                <Menu
                  id="basic-menu"
                  anchorEl={logoutAnchor}
                  open={logoutOpen}
                  onClose={() => {
                    setLogoutAnchor(null);
                  }}
                >
                  <MenuItem onClick={() => handleMyPage()}>My Page</MenuItem>
                  <MenuItem onClick={() => logOut()}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Link href={"/account/join"}>
                <div className={"join-box"}>
                  <AccountCircleOutlinedIcon />
                  <span>{t("Sign In")}</span>
                </div>
              </Link>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

Navbar.defaultProps = {
  initialValues: {
    _id: "",
    newProductAmount: 0,
  },
};
export default withRouter(Navbar);
