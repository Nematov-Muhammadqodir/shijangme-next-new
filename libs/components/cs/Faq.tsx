import React, { SyntheticEvent, useEffect, useState } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { AccordionDetails, Box, Stack, Typography } from "@mui/material";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { NoticeFor } from "../../enums/notice.enum";
import { Notice } from "../../types/cs/notice";
import { GET_NOTICES } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { useQuery } from "@apollo/client";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: "1.4rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#fff",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const Faq = () => {
  const router = useRouter();
  const [category, setCategory] = useState<string>(NoticeFor.PRODUCT);
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [notices, setNotices] = useState<Notice[]>([]);

  /** APOLLO REQUESTS **/

  const {
    loading: noticesLoading,
    data: noticesData,
    error: noticesError,
    refetch: noticesRefetch,
  } = useQuery(GET_NOTICES, {
    fetchPolicy: "network-only",
    variables: {
      input: { noticeFor: category },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("GET_NOTICES data", data);
      setNotices(data?.getNotices);
    },
  });

  /** LIFECYCLES **/

  /** HANDLERS **/
  const changeCategoryHandler = async (category: string) => {
    setCategory(category);
    await noticesRefetch({ input: { noticeFor: category } });
  };

  const handleChange =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Stack className={"faq-content"}>
      <Box className={"categories"} component={"div"}>
        <div
          className={category === NoticeFor.PRODUCT ? "active" : ""}
          onClick={() => {
            changeCategoryHandler("PRODUCT");
          }}
        >
          Product
        </div>
        <div
          className={category === NoticeFor.PAYMENT ? "active" : ""}
          onClick={() => {
            changeCategoryHandler("PAYMENT");
          }}
        >
          Payment
        </div>
        <div
          className={category === NoticeFor.FOR_BUYERS ? "active" : ""}
          onClick={() => {
            changeCategoryHandler("FOR_BUYERS");
          }}
        >
          Foy Buyers
        </div>
        <div
          className={category === NoticeFor.COMMUNITY ? "active" : ""}
          onClick={() => {
            changeCategoryHandler("COMMUNITY");
          }}
        >
          Community
        </div>
        <div
          className={category === NoticeFor.OTHER ? "active" : ""}
          onClick={() => {
            changeCategoryHandler("OTHER");
          }}
        >
          Other
        </div>
      </Box>
      <Box className={"wrap"} component={"div"}>
        {notices.map((notice: Notice) => (
          <Accordion
            expanded={expanded === notice?._id}
            onChange={handleChange(notice?._id)}
            key={notice?._id}
          >
            <AccordionSummary
              id="panel1d-header"
              className="question"
              aria-controls="panel1d-content"
            >
              <Typography className="badge" variant={"h4"}>
                Q
              </Typography>
              <Typography> {notice.noticeTitle}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack className={"answer flex-box"}>
                <Typography className="badge" variant={"h4"} color={"primary"}>
                  A
                </Typography>
                <Typography> {notice.noticeContent}</Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
};

export default Faq;
