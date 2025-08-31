import { Stack } from "@mui/material";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import LeftNavbar from "../admin/LeftNavbar";
import { getJwtToken, updateUserInfo } from "../../auth";
import { MemberType } from "../../../libs/enums/member.enum";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";

const withLayoutAdmin = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const user = useReactiveVar(userVar);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    useEffect(() => {
      if (!loading && user.memberType !== MemberType.ADMIN) {
        router.push("/").then();
      }
    }, []);
    return (
      <>
        <Head>
          <title>ShijangMe Admin Page</title>
        </Head>
        <Stack id="pc-wrap">
          <Stack className="container">
            <Stack className="left-navbar-container">
              <LeftNavbar />
            </Stack>
            <Stack className="right-content-container">
              <Component {...props} />
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutAdmin;
