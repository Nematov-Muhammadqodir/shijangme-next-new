import withLayoutMain from "@/libs/components/layout/LayoutHome";
import { Box, Button, Pagination, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import VendorProductCard from "@/libs/components/common/VendorProductCard";
import StarIcon from "@mui/icons-material/Star";
import VendorReviewCard from "@/libs/components/vendor/VendorReviewCard";
import { CommentGroup } from "@/libs/enums/comment.enum";
import {
  CommentInput,
  CommentsInquiry,
} from "@/libs/types/comment/comment.input";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import DoubleCardBanner from "@/libs/components/common/DoubleCardBanner";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { CREATE_COMMENT, LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { GET_COMMENTS, GET_MEMBER, GET_PRODUCTS } from "@/apollo/user/query";
import { userVar } from "@/apollo/store";
import { Member } from "@/libs/types/member/member";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { NextPage } from "next";
import { Product } from "@/libs/types/product/product";
import { T } from "@/libs/types/common";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/libs/types/sweetAlert";
import { Messages, REACT_APP_API_URL } from "@/libs/types/config";
import { Comment } from "@/libs/types/comment/comment";
import { useDispatch } from "react-redux";

const VendorDetail: NextPage = ({
  initialInput,
  initialComment,
  ...props
}: any) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [vendor, setVendor] = useState<Member | null>(null);
  const [searchFilter, setSearchFilter] =
    useState<ProductsInquiry>(initialInput);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [productTotal, setProductTotal] = useState<number>(0);
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [vendorComments, setVendorComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(1);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.MEMBER,
    commentContent: "",
    commentRefId: "",
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const pageCount = Math.ceil(vendorProducts.length / itemsPerPage);

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const [createComment] = useMutation(CREATE_COMMENT);

  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: vendorId },
    skip: !vendorId,
    onCompleted(data: T) {
      setVendor(data?.getMember);
      setSearchFilter({
        ...searchFilter,
        search: {
          productOwnerId: data?.getMember?._id,
        },
      });
      setCommentInquiry({
        ...commentInquiry,
        search: {
          commentRefId: data?.getMember?._id,
        },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: data?.getMember?._id,
      });
    },
  });

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setVendorProducts(data?.getProducts?.list);
      setProductTotal(data?.getProducts?.metaCounter[0]?.total);
    },
  });
  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: "network-only",
    variables: { input: commentInquiry },
    skip: !commentInquiry?.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setVendorComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.vendorId) setVendorId(router.query.vendorId as string);
  }, [router]);

  useEffect(() => {
    if (searchFilter.search.productOwnerId) {
      getProductsRefetch({ variables: { input: searchFilter } }).then();
    }
  }, [searchFilter]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ variables: { input: commentInquiry } }).then();
    }
  }, [commentInquiry]);
  /** HANDLERS **/
  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user._id)
        await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Optional: Scroll to top of the list when page changes for better UX
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const createCommentHandler = async () => {
    try {
      if (!user._id) return;
      if (user._id === vendorId)
        throw new Error("Can not write a review for yourself!");
      // execute likeTargetMember Mutation
      await createComment({
        variables: {
          input: insertCommentData,
        },
      });
      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      await getCommentsRefetch({ input: commentInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const likeProductHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user) throw new Error(Messages.error2);

      await likeTargetProduct({ variables: { input: id } });

      await getProductsRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("Error, likePropertyHandler", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const imagePath = vendor?.memberImage
    ? `${REACT_APP_API_URL}/${vendor.memberImage}`
    : "/img/profile/defaultImg.jpg";
  return (
    <div style={{ marginTop: "30px" }} className="vendor-detail-main-container">
      <Stack className="container">
        <Stack className="vendor-info">
          <Box className="vendor-image">
            <img src={imagePath} alt="" />
          </Box>
          <Stack
            className="vendor-details"
            onClick={() => redirectToMemberPageHandler(vendor?._id as string)}
          >
            <span className="vendor-name">{vendor?.memberNick}</span>
            <div className="vendor-phone">
              <PhoneIcon />
              <span>{vendor?.memberPhone}</span>
            </div>
          </Stack>
        </Stack>
        <Stack className="vendor-home-list">
          <Stack className="card-wrap">
            {vendorProducts?.length === 0 ? (
              <div className={"no-data"}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No products found!</p>
              </div>
            ) : (
              vendorProducts
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((product) => {
                  return (
                    <VendorProductCard
                      key={product._id}
                      likeProductHandler={likeProductHandler}
                      product={product}
                    />
                  );
                })
            )}
          </Stack>
          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Stack>

        <DoubleCardBanner />

        <Stack className={"review-box"}>
          <Stack className={"main-intro"}>
            <span>Reviews</span>
            <p>we are glad to see you again</p>
          </Stack>
          {commentTotal !== 0 && (
            <Stack className={"review-wrap"}>
              <Box component={"div"} className={"title-box"}>
                <StarIcon />
                <span>
                  {commentTotal} review{commentTotal > 1 ? "s" : ""}
                </span>
              </Box>
              <Stack className="reviews-list-container">
                {vendorComments.map((vendorComment: Comment) => {
                  return (
                    <VendorReviewCard
                      vendorComment={vendorComment}
                      key={vendorComment._id}
                    />
                  );
                })}
              </Stack>
            </Stack>
          )}
          <Stack className="leave-review-config">
            <Typography className={"main-title"}>Leave A Review</Typography>
            <Typography className={"review-title"}>Review</Typography>
            <textarea
              onChange={({ target: { value } }: any) => {
                setInsertCommentData({
                  ...insertCommentData,
                  commentContent: value,
                });
              }}
              value={insertCommentData.commentContent}
              placeholder="Write a Review "
            ></textarea>
            <Box className={"submit-btn"} component={"div"}>
              <Button
                className={"submit-review"}
                // disabled={
                //   insertCommentData.commentContent === "" || user?._id === ""
                // }
                onClick={createCommentHandler}
                endIcon={<ArrowOutwardIcon />}
              >
                Submit Review
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

VendorDetail.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    search: {
      memberId: "",
    },
  },
  initialComment: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    direction: "ASC",
    search: {
      commentRefId: "",
    },
  },
};

export default withLayoutMain(VendorDetail);
