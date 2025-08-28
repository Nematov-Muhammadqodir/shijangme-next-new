import { Stack } from "@mui/material";
import Head from "next/head";
import React, { useEffect } from "react";
import LeftNavbar from "../admin/LeftNavbar";
import { getJwtToken, updateUserInfo } from "../../auth";

const withLayoutAdmin = (Component: any) => {
  return (props: any) => {
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
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
