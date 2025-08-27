// components/ScrollFade.tsx
import { motion } from "framer-motion";
import React from "react";

interface ScrollFadeProps {
  children: React.ReactNode;
  y?: number;
  duration?: number;
}

const ScrollFade: React.FC<ScrollFadeProps> = ({
  children,
  y = 80,
  duration = 1.2,
}) => {
  //   const fadeUp = {
  //     hidden: { opacity: 0, y },
  //     visible: { opacity: 1, y: 0, transition: { duration } },
  //   };
  const fadeUp = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 10, y: 20, transition: { duration: 1.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFade;
