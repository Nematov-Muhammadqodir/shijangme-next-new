import { Stack } from "@mui/material";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { useEffect } from "react";
import { getJwtToken, updateUserInfo } from "@/libs/auth";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);
    return (
      <>
        <Head>
          <title>Kadai</title>
        </Head>
        <Stack id="pc-wrap">
          <Stack>
            <Top />
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

export default withLayoutMain;
