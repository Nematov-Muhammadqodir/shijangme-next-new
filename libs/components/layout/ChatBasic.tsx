import { Stack } from "@mui/system";
import Head from "next/head";
import ChatNavbar from "../chat/ChatNavbar";
import { Toaster } from "react-hot-toast";

const withLayoutChat = (Component: any) => {
  return (props: any) => {
    return (
      <>
        <Head>
          <title>Shijangme Chat</title>
        </Head>
        <Stack id="pc-wrap">
          <Stack>
            <ChatNavbar />
          </Stack>

          <Stack>
            <Component {...props} />
          </Stack>
          <Toaster />
        </Stack>
      </>
    );
  };
};

export default withLayoutChat;
