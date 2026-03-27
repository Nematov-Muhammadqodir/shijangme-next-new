import { useReactiveVar } from "@apollo/client";
import { Stack } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userVar } from "../apollo/store";
import Banner from "../libs/components/homePage/Banner";
import DiscounProductsList from "../libs/components/homePage/DiscounProductsList";
import NewProductsList from "../libs/components/homePage/NewProductsList";
import TrendProductsList from "../libs/components/homePage/TrendProductsList";
import Advertisement from "../libs/components/homePage/Advertisement";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import Blogs from "../libs/components/homePage/Blogs";
import Category from "../libs/components/homePage/Category";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = () => {
  const user = useReactiveVar(userVar);
  const router = useRouter();

  useEffect(() => {
    if (user?.memberType === "ADMIN") {
      router.push("/_admin/users");
    }
  }, [user, router]);

  return (
    <Stack className="home-page" sx={{ minHeight: "600px", marginTop: "100px" }}>
      <Banner />

      <Category />

      <DiscounProductsList />

      <NewProductsList />

      <TrendProductsList />

      <Advertisement />

      <Blogs />
    </Stack>
  );
};

export default withLayoutMain(Home);
