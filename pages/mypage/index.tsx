import { useMutation, useReactiveVar } from "@apollo/client";
import { Stack } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Orderr from "../order";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userVar } from "../../apollo/store";
import {
  LIKE_TARGET_MEMBER,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "../../apollo/user/mutation";
import { Messages } from "../../libs/types/config";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/types/sweetAlert";
import ScrollFade from "../../libs/components/common/MotionWrapper";
import { MemberType } from "../../libs/enums/member.enum";
import MyMenu from "../../libs/components/mypage/MyMenu";
import AddProduct from "../../libs/components/mypage/AddProduct";
import MyProducts from "../../libs/components/mypage/MyProducts";
import MyFavorites from "../../libs/components/mypage/MyFavorites";
import RecentlyVisited from "../../libs/components/mypage/RecentlyVisited";
import MyArticles from "../../libs/components/mypage/MyArticles";
import WriteArticle from "../../libs/components/mypage/WriteArticle";
import MemberFollowers from "../../libs/components/member/MemberFollowers";
import MemberFollowings from "../../libs/components/member/MemberFollowings";
import MyProfile from "../../libs/components/mypage/MyProfile";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

// import { useMutation, useReactiveVar } from "@apollo/client";
// import { Stack } from "@mui/material";
// import { NextPage } from "next";
// import { useRouter } from "next/router";
// import React, { useEffect } from "react";

// import Order from "../order";

// import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const MyPage: NextPage = () => {
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const category: any = router.query?.category ?? "myProfile";

  /** APOLLO REQUESTS **/
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unSubscribe] = useMutation(UNSUBSCRIBE);
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** LIFECYCLES **/
  // useEffect(() => {
  //   if (!user._id) router.push("/").then();
  // }, [user]);

  /** HANDLERS **/
  const subscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      console.log("id", id);
      if (!id) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);

      await subscribe({
        variables: {
          input: id,
        },
      });
      await sweetTopSmallSuccessAlert("Subscribed", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      console.log("id", id);
      if (!id) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);

      await unSubscribe({
        variables: {
          input: id,
        },
      });
      await sweetTopSmallSuccessAlert("Subscribed", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const likeMemberHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      await likeTargetMember({
        variables: {
          input: id,
        },
      });

      await sweetTopSmallSuccessAlert("Success!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      console.log("Error, likeMemberHandler", err);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      console.log("memberId redirect", memberId);
      if (memberId === user?._id)
        await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };
  return (
    <div id="my-page" style={{ position: "relative" }}>
      <div className="container">
        <Stack className={"my-page"}>
          <Stack className={"back-frame"}>
            <ScrollFade>
              <Stack
                className={
                  user.memberType === MemberType.VENDOR
                    ? "left-config increase"
                    : "left-config"
                }
              >
                <MyMenu />
              </Stack>
            </ScrollFade>

            <Stack className="main-config" mb={"76px"}>
              <Stack className={"list-config"}>
                {category === "addProduct" && <AddProduct />}
                {category === "myProducts" && <MyProducts />}
                {category === "myFavorites" && <MyFavorites />}
                {category === "recentlyVisited" && <RecentlyVisited />}
                {category === "myArticles" && <MyArticles />}
                {category === "writeArticle" && <WriteArticle />}
                {category === "myProfile" && <MyProfile />}
                {category === "order" && <Orderr />}
                {category === "followers" && (
                  <MemberFollowers
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}
                {category === "followings" && (
                  <MemberFollowings
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default withLayoutMain(MyPage);
