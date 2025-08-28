import { Stack } from "@mui/material";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Introduction from "../../libs/components/about-us/Introduction";
import MultipleBanner from "../../libs/components/product/MultipleBanner";
import MissionCardList from "../../libs/components/product/MissionCardList";
import OurBrands from "../../libs/components/OurBrands";
import AboutUsBanner from "../../libs/components/about-us/AboutUsBanner";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <Stack className="container">
        <Stack className="about-us-container">
          <Introduction />
          <MultipleBanner />
          <MissionCardList />
          <OurBrands />
        </Stack>
      </Stack>
      <AboutUsBanner />
    </div>
  );
};

export default withLayoutMain(AboutUs);
