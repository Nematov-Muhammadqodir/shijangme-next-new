import { Stack } from "@mui/material";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import SmalTop from "./SmalTop";
import { useEffect } from "react";
import { getJwtToken, updateUserInfo } from "../../auth";

const withLayoutBasic = (Component: any) => {
  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);
  return (props: any) => {
    return (
      <>
        <Head>
          <title>Kadai</title>
        </Head>
        <Stack id="pc-wrap">
          <Stack>
            <SmalTop />
          </Stack>

          <Stack>
            <Component {...props} />
          </Stack>

          <Stack>
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
