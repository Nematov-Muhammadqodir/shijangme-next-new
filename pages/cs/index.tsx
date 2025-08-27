import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Stack } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import withLayoutMain from "@/libs/components/layout/LayoutHome";
import Notice from "@/libs/components/cs/Notice";
import Faq from "@/libs/components/cs/Faq";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CS: NextPage = () => {
  const router = useRouter();

  /** HANDLERS **/
  const changeTabHandler = (tab: string) => {
    router.push(
      {
        pathname: "/cs",
        query: { tab: tab },
      },
      undefined,
      { scroll: false }
    );
  };
  const tab = router.query.tab ?? "notice";

  return (
    <Stack className={"cs-page"}>
      <Stack className={"container"}>
        <Box component={"div"} className={"cs-main-info"}>
          <Box component={"div"} className={"info"}>
            <span>CS center</span>
            <p>I will answer your questions</p>
          </Box>
          <Box component={"div"} className={"btns"}>
            <div
              className={tab == "notice" ? "active" : ""}
              onClick={() => {
                changeTabHandler("notice");
              }}
            >
              Notice
            </div>
            <div
              className={tab == "faq" ? "active" : ""}
              onClick={() => {
                changeTabHandler("faq");
              }}
            >
              FAQ
            </div>
          </Box>
        </Box>

        <Box component={"div"} className={"cs-content"}>
          {tab === "notice" && <Notice />}

          {tab === "faq" && <Faq />}
        </Box>
      </Stack>
    </Stack>
  );
};

export default withLayoutMain(CS);
