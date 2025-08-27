import { userVar } from "@/apollo/store";
import { useReactiveVar } from "@apollo/client";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Moment from "react-moment";
import { Comment } from "../../types/comment/comment";
import { REACT_APP_API_URL } from "@/libs/types/config";

interface ReviewProps {
  comment: Comment;
}

const Review = (props: ReviewProps) => {
  const { comment } = props;
  console.log("reviews", comment);
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [value, setValue] = React.useState<number | null>(2);
  const imagePath: string = comment?.memberData?.memberImage
    ? `${REACT_APP_API_URL}/${comment?.memberData?.memberImage}`
    : "/img/profile/defaultImg.jpg";

  /** HANDLERS **/
  const goMemberPage = (id: string) => {
    if (id === user?._id) router.push("/mypage");
    else router.push(`/member?memberId=${id}`);
  };
  return (
    <Stack className="review-config">
      <Stack className={"review-mb-info"}>
        <Stack className={"img-name-box"}>
          <img src={imagePath} alt="" className={"img-box"} />
          <Stack className="info-cont">
            <Stack>
              <Typography className={"description"}>
                {comment.commentContent}
              </Typography>
            </Stack>
            <Typography
              className={"name"}
              onClick={() => goMemberPage(comment?.memberData?._id as string)}
            >
              {comment.memberData?.memberNick}
            </Typography>
            <Typography className={"date"}>
              <Moment format={"DD MMMM, YYYY"}>{comment.createdAt}</Moment>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Review;
