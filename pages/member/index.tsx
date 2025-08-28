import { useMutation, useReactiveVar } from "@apollo/client";
import { Box, Container, Stack } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
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
import MemberMenu from "../../libs/components/member/MemberMenu";
import MemberProducts from "../../libs/components/member/MemberProducts";
import MemberFollowers from "../../libs/components/member/MemberFollowers";
import MemberFollowings from "../../libs/components/member/MemberFollowings";
import MemberArticles from "../../libs/components/member/MemberArticles";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Members: NextPage = () => {
  const router = useRouter();
  const category: any = router.query?.category;
  const user = useReactiveVar(userVar);

  /** APOLLO REQUESTS **/
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unSubscribe] = useMutation(UNSUBSCRIBE);
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;
    if (!category) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, category: "followers" },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [category, router]);

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
      if (memberId === user?._id)
        await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };
  return (
    <div id="member-page" style={{ position: "relative" }}>
      <div className="container">
        <Stack className={"member-page"}>
          <Stack className={"back-frame"}>
            <Stack className={"left-config"}>
              <MemberMenu
                subscribeHandler={subscribeHandler}
                unsubscribeHandler={unsubscribeHandler}
              />
            </Stack>
            <Stack className="main-config" mb={"76px"}>
              <Stack className={"list-config"}>
                {category === "products" && <MemberProducts />}
                {category === "followers" && (
                  <MemberFollowers
                    subscribeHandler={subscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}
                {category === "followings" && (
                  <MemberFollowings
                    subscribeHandler={subscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}
                {category === "articles" && <MemberArticles />}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default withLayoutMain(Members);
