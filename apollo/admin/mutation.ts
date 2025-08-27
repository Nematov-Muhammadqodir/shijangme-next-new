import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberDesc
      memberProducts
      memberArticles
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberViews
      memberComments
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
      meFollowed {
        followingId
        followerId
        myFollowing
      }
    }
  }
`;

/**************************
 *        PRODUCT       *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
  mutation UpdateProductByAdmin($input: ProductUpdate!) {
    updateProductByAdmin(input: $input) {
      _id
      productCollection
      productStatus
      productName
      productPrice
      productOriginPrice
      productViews
      productLikes
      productComments
      productRank
      productVolume
      productLeftCount
      productSoldCount
      productOrigin
      productDiscountRate
      productImages
      productDesc
      productOwnerId
      deletedAt
      createdAt
      updatedAt
      productOwnerData {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProducts
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const REMOVE_PRODUCT_BY_ADMIN = gql`
  mutation DeleteProductByAdmin($input: String!) {
    deleteProductByAdmin(productId: $input) {
      _id
      productCollection
      productStatus
      productName
      productPrice
      productOriginPrice
      productViews
      productLikes
      productComments
      productRank
      productVolume
      productLeftCount
      productSoldCount
      productOrigin
      productDiscountRate
      productImages
      productDesc
      productOwnerId
      deletedAt
      createdAt
      updatedAt
      productOwnerData {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProducts
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/
export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
    updateBoardArticleByAdmin(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticleByAdmin($input: String!) {
    removeBoardArticleByAdmin(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/
export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ORDER_BY_ADMIN = gql`
  mutation UpdateOrderByAdmin($input: OrderUpdateInput!) {
    updateOrderByAdmin(input: $input) {
      _id
      orderTotal
      orderDelivery
      orderStatus
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_NOTICE = gql`
  mutation CreateNotice($input: NoticeInput!) {
    createNotice(input: $input) {
      _id
      noticeCategory
      noticeStatus
      noticeFor
      noticeTitle
      noticeContent
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NOTICE = gql`
  mutation UpdateNotice($input: NoticeUpdate!) {
    updateNotice(input: $input) {
      _id
      noticeCategory
      noticeStatus
      noticeTitle
      noticeContent
      memberId
      createdAt
      updatedAt
    }
  }
`;
