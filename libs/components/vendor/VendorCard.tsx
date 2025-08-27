import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box } from "@mui/material";
import Link from "next/link";
import { Member } from "@/libs/types/member/member";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { REACT_APP_API_URL } from "@/libs/types/config";

interface VendorCardProps {
  vendor: Member;
  likeMemberHandler: any;
}

const VendorCard = (props: VendorCardProps) => {
  const { vendor, likeMemberHandler } = props;
  const user = useReactiveVar(userVar);

  const imagePath = vendor?.memberImage
    ? `${REACT_APP_API_URL}/${vendor.memberImage}`
    : "/img/profile/defaultImg.jpg";
  return (
    <div className="vendor-card-main">
      <div className="vendor-card">
        <Link
          href={{
            pathname: "/vendor/detail",
            query: { vendorId: vendor._id },
          }}
        >
          <Box className="vendor-img-container" component={"div"}>
            <img src={imagePath} alt="" />
            <div className="vendor-product-count">
              {vendor.memberProducts} products
            </div>
          </Box>
        </Link>

        <div className="vendor-info-container">
          <Link
            href={{
              pathname: "/agent/detail",
              query: { agentId: "jghbuhku" },
            }}
          >
            <span className="vendor-name">{vendor.memberNick}</span>
          </Link>

          <span className="broker-of">
            Vendor of: <span className="section">Meats</span>
          </span>
          <div className="view-like-container">
            <div
              className="like"
              onClick={() => likeMemberHandler(user, vendor._id)}
            >
              {vendor.meLiked && vendor.meLiked[0]?.myFavorite ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>
            <div className="view">
              <RemoveRedEyeIcon />
              <span>{vendor.memberViews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
