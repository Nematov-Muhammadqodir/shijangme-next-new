import { userVar } from "@/apollo/store";
import Advertisement from "@/libs/components/homePage/Advertisement";
import Banner from "@/libs/components/homePage/Banner";
import Blogs from "@/libs/components/homePage/Blogs";
import Category from "@/libs/components/homePage/Category";
import DiscounProductsList from "@/libs/components/homePage/DiscounProductsList";
import NewProductsList from "@/libs/components/homePage/NewProductsList";
import TrendProductsList from "@/libs/components/homePage/TrendProductsList";
import withLayoutMain from "@/libs/components/layout/LayoutHome";
import { useReactiveVar } from "@apollo/client";
import { Box, Stack } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = () => {
  const user = useReactiveVar(userVar);
  const router = useRouter();

  useEffect(() => {
    console.log("userTypeHome", user?.memberType);
    if (user.memberType === "ADMIN") {
      router.push("/_admin/users");
    }
  }, [user]);

  const fadeUp = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 10, y: 20, transition: { duration: 1.2 } },
  };
  return (
    <Stack className="home-page" sx={{ height: "600px", marginTop: "100px" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <Banner />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <Category />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <DiscounProductsList />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <NewProductsList />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <TrendProductsList />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <Advertisement />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <Blogs />
      </motion.div>
    </Stack>
  );
};

export default withLayoutMain(Home);
