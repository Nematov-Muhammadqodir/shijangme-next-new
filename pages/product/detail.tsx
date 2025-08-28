import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SendIcon from "@mui/icons-material/Send";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userVar } from "../../apollo/store";
import { Product } from "../../libs/types/product/product";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { Comment } from "../../libs/types/comment/comment";
import { CommentGroup } from "../../libs/enums/comment.enum";
import {
  CREATE_COMMENT,
  LIKE_TARGET_PRODUCT,
} from "../../apollo/user/mutation";
import {
  GET_COMMENTS,
  GET_PRODUCT,
  GET_PRODUCTS,
} from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { Message } from "../../libs/enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/types/sweetAlert";
import ScrollFade from "../../libs/components/common/MotionWrapper";
import { addItem } from "../../slices/cartSlice";
import { REACT_APP_API_URL } from "../../libs/types/config";
import Review from "../../libs/components/product/Review";
import BannerCard from "../../libs/components/product/BannerCard";
import HorizontalCard from "../../libs/components/product/HorizontalCard";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const ProductDetail: NextPage = ({ initialComment, ...props }: any) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [slideImage, setSlideImage] = useState<string>("");
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [productComments, setProductComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.PRODUCT,
    commentContent: "",
    commentRefId: "",
  });
  const dispatch = useDispatch();

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const [createComment] = useMutation(CREATE_COMMENT);

  const {
    loading: getProductLoading,
    data: getProductData,
    error: getProductError,
    refetch: getProductRefetch,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "network-only",
    variables: { input: productId },
    skip: !productId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getProduct) setProduct(data.getProduct);
      if (data?.getProduct) setSlideImage(data.getProduct.productImages[0]);
    },
  });

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 4,
        sort: "createdAt",
        direction: "DESC",
        search: {
          productCollection: product?.productCollection
            ? [product.productCollection]
            : [],
        },
      },
    },
    skip: !productId && !product,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getProducts?.list)
        setCollectionProducts(data?.getProducts?.list);
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: "network-only",
    variables: { input: initialComment },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getComments?.list) setProductComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
      console.log("comments", data?.getComments?.list);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.id) {
      setProductId(router.query.id as string);
      setCommentInquiry({
        ...commentInquiry,
        search: {
          commentRefId: router.query.id as string,
        },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: router.query.id as string,
      });
    }
  }, [router]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ input: commentInquiry });
    }
  }, [commentInquiry]);

  /** HANDLERS **/

  const likeProductHandler = async (user: T, id: string) => {
    console.log("likeRefid", user._id);
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetProduct({ variables: { input: id } });

      await getProductsRefetch({
        input: {
          page: 1,
          limit: 4,
          sort: "createdAt",
          direction: "DESC",
          search: { productCollection: [product?.productCollection] },
        },
      });

      await getProductRefetch({
        input: productId,
      });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("Error, likePropertyHandler", err);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const createCommentHandler = async () => {
    try {
      if (!productId) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      // execute likeTargetProduct Mutation
      await createComment({
        variables: {
          input: insertCommentData,
        },
      });
      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      await getCommentsRefetch({ input: commentInquiry });
      if (commentTotal === 0) {
        window.location.reload();
      }

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("Error, createCommentHandler", err);
      await sweetMixinErrorAlert(err.message).then();
    }
  };
  const changeImageHandler = (image: string) => {
    setSlideImage(image);
  };

  const commentPaginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    commentInquiry.page = value;
    setCommentInquiry({ ...commentInquiry });
  };

  if (getProductLoading) {
    return (
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "1080px",
        }}
      >
        <CircularProgress size={"4rem"} />
      </Stack>
    );
  }

  return (
    <div className="product-detail-main-container">
      <Stack className="container">
        <Stack className="product-detail-config">
          <ScrollFade>
            <Stack className="product-detail-intro">
              <Stack className="product-name">
                <Stack className="product-main-details">
                  <span className="name">{product?.productName}</span>
                  <Stack className="product-type">
                    <span>{product?.productOrigin}</span>
                    <span>{product?.productCollection}</span>
                  </Stack>
                </Stack>
                <Stack className="product-ratings">
                  <Box className="view">
                    <RemoveRedEyeIcon />
                    <span>{product?.productViews}</span>
                  </Box>
                  <Box
                    className="like" // @ts-ignore
                    onClick={() => likeProductHandler(user, product?._id)}
                  >
                    {product?.meLiked && product.meLiked[0]?.myFavorite ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}

                    <span>{product?.productLikes}</span>
                  </Box>
                </Stack>
              </Stack>
              <div className="divider"></div>
              <Stack className="bottom-details">
                <Stack className="detail">
                  <span className="discount">
                    <span className="bold">Discount:</span>{" "}
                    {product?.productDiscountRate}%
                  </span>
                  <span className="left-count">
                    <span className="bold">Left Count:</span>{" "}
                    {product?.productLeftCount}
                  </span>
                  <span className="volume">
                    <span className="bold">Volume:</span>{" "}
                    {product?.productVolume}
                  </span>
                  <span className="volume">
                    <span className="bold">Vendor:</span>{" "}
                    {product?.productOwnerData?.memberNick}
                  </span>
                </Stack>
                <Box className="price-container">
                  <span className="price">{product?.productPrice}￦</span>
                </Box>
              </Stack>
            </Stack>
          </ScrollFade>
          <ScrollFade>
            <Stack className="product-images">
              <Stack className="product-main-image-container">
                <div className="description-container">
                  <span className="description">{product?.productDesc}</span>
                  <Button
                    className="description-btn"
                    endIcon={<KeyboardDoubleArrowRightIcon />}
                    onClick={() =>
                      dispatch(
                        addItem({
                          _id: product?._id,
                          quantity: 1,
                          price: Number(product?.productPrice),
                          name: product?.productName,
                          image: product?.productImages[0],
                          discountRate: product?.productDiscountRate,
                        })
                      )
                    }
                  >
                    Add To Cart
                  </Button>
                </div>

                <div className="image">
                  <img
                    className="product-image"
                    src={
                      slideImage
                        ? `${REACT_APP_API_URL}/${slideImage}`
                        : "/img/products/pinapple.png"
                    }
                    alt={"main-image"}
                  />
                  <div className="tag">
                    <img
                      src={"/img/products/detail-star.svg"}
                      alt={"main-image"}
                    />
                    <span className="tag-price">
                      <p>{product?.productPrice}￦</p>
                    </span>
                  </div>
                </div>
              </Stack>
              <Stack className="product-sub-image-container">
                {product?.productImages.map((subImg: string) => {
                  const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
                  return (
                    <div
                      className="sub-img-box"
                      onClick={() => changeImageHandler(subImg)}
                      key={subImg}
                    >
                      <img src={imagePath} alt="" />
                    </div>
                  );
                })}
              </Stack>
            </Stack>
          </ScrollFade>
          {/* @ts-ignore */}
          {product?.productComments > 0 && (
            <ScrollFade>
              <Stack className="reviews-main-container">
                <Stack className="filter-box">
                  <RateReviewIcon />
                  <span>{product?.productComments} Reviews</span>
                </Stack>
                <Stack className="review-list">
                  {productComments?.map((comment: Comment, index) => {
                    return <Review key={comment?._id} comment={comment} />;
                  })}
                </Stack>
              </Stack>
            </ScrollFade>
          )}
          <ScrollFade>
            <Stack className="leave-review-section-main">
              <Typography className="main-title">Leave a Review</Typography>
              <Typography className="review-title">Review</Typography>
              <textarea
                onChange={({ target: { value } }: any) => {
                  setInsertCommentData({
                    ...insertCommentData,
                    commentContent: value,
                  });
                }}
                value={insertCommentData.commentContent}
                placeholder="Write a Review"
              ></textarea>
              <Button
                className="submit-review-btn"
                endIcon={<SendIcon />}
                disabled={
                  insertCommentData.commentContent === "" || user?._id === ""
                }
                onClick={createCommentHandler}
              >
                Submit Review
              </Button>
            </Stack>
          </ScrollFade>
          {collectionProducts.length !== 0 && (
            <ScrollFade>
              <Stack className="similar-products-list-main">
                <BannerCard />
                <Stack className="similar-products-list-container">
                  {collectionProducts.map((product: Product) => {
                    return (
                      <HorizontalCard
                        product={product}
                        likeProductHandler={likeProductHandler}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </ScrollFade>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

ProductDetail.defaultProps = {
  initialComment: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    direction: "DESC",
    search: {
      commentRefId: "",
    },
  },
};

export default withLayoutMain(ProductDetail);
