import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const MissionCardList = () => {
  return (
    <div className="mission-card-list">
      <Stack className="mission-card">
        <Box className="mission-img-container">
          <img src="img/about-us/arrow.svg" alt="" />
        </Box>
        <span className="goal">Our Goal</span>
        <span className="goal-desc">
          Mauris aliquet sed neque ut sagittis. Nullam eu urna ris. Aenean
          convallis fringilla dui id dictum. Aliquam sitam euismod arcu, at
          cursus sapien.
        </span>
      </Stack>
      <Stack className="mission-card">
        <Box className="mission-img-container">
          <img src="img/about-us/light.svg" alt="" />
        </Box>
        <span className="goal">Our Mission</span>
        <span className="goal-desc">
          Mauris aliquet sed neque ut sagittis. Nullam eu urna ris. Aenean
          convallis fringilla dui id dictum. Aliquam sitam euismod arcu, at
          cursus sapien.
        </span>
      </Stack>
      <Stack className="mission-card">
        <Box className="mission-img-container">
          <img src="img/about-us/hand.svg" alt="" />
        </Box>
        <span className="goal">Our Ideology</span>
        <span className="goal-desc">
          Mauris aliquet sed neque ut sagittis. Nullam eu urna ris. Aenean
          convallis fringilla dui id dictum. Aliquam sitam euismod arcu, at
          cursus sapien.
        </span>
      </Stack>
    </div>
  );
};

export default MissionCardList;
