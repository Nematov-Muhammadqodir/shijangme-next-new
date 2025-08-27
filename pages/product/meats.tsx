import withLayoutMain from "@/libs/components/layout/LayoutHome";
import { Box, Container, Stack } from "@mui/material";
import { NextPage } from "next";
import React from "react";

const Meats: NextPage = () => {
  return (
    <Container>
      <Stack>Meats</Stack>
    </Container>
  );
};

export default withLayoutMain(Meats);
