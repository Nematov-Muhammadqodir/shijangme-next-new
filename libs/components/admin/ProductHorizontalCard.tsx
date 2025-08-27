import { MemberStatus, MemberType } from "@/libs/enums/member.enum";
import {
  ProductCollection,
  ProductFrom,
  ProductStatus,
} from "@/libs/enums/product.enum";
import { Member } from "@/libs/types/member/member";
import { Product } from "@/libs/types/product/product";
import {
  Box,
  Button,
  Fade,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

interface MemberHorizontalCardProps {
  product: Product;
  menuIconClickHandler: any;
  anchorEl: any;
  updateMemberHandler: any;
  menuIconCloseHandler: any;
  index: number;
}

const MemberHorizontalCard = (props: MemberHorizontalCardProps) => {
  const {
    menuIconClickHandler,
    product,
    anchorEl,
    updateMemberHandler,
    menuIconCloseHandler,
    index,
  } = props;

  return (
    <div className="member-horiz-card-main">
      <Box className="id-container">
        <span className="id">{product?._id}</span>
      </Box>
      <Stack className="nick-img-container">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${product.productImages[0]}`}
          alt=""
        />
        <span className="nick">{product?.productName}</span>
      </Stack>
      <Box className="phone-container">
        <span className="tel">{product?.productPrice}</span>
      </Box>

      <Box className="status-container">
        <Button
          onClick={(e: any) => menuIconClickHandler(e, product?._id)}
          className={"status-change-btn badge success"}
        >
          {product?.productStatus}
        </Button>

        {product?.productStatus === ProductStatus.ACTIVE && (
          <Menu
            className={"menu-modal"}
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl[product?._id]}
            open={Boolean(anchorEl[product?._id])}
            onClose={menuIconCloseHandler}
            TransitionComponent={Fade}
            sx={{ p: 1 }}
          >
            {Object.values(ProductStatus)
              .filter((ele: string) => ele !== product?.productStatus)
              .map((status: string) => (
                <MenuItem
                  onClick={() =>
                    updateMemberHandler({
                      _id: product?._id,
                      productStatus: status,
                    })
                  }
                  key={status}
                >
                  <Typography variant={"subtitle1"} component={"span"}>
                    {status}
                  </Typography>
                </MenuItem>
              ))}
          </Menu>
        )}
      </Box>
      <Box className="type-container">
        <Button
          onClick={(e: any) => menuIconClickHandler(e, index)}
          className={"type-change-btn badge success"}
        >
          {product?.productOrigin}
        </Button>

        {product?.productStatus === ProductStatus.ACTIVE && (
          <Menu
            className={"menu-modal"}
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl[index]}
            open={Boolean(anchorEl[index])}
            onClose={menuIconCloseHandler}
            TransitionComponent={Fade}
            sx={{ p: 1 }}
          >
            {Object.values(ProductFrom)
              .filter((ele) => ele !== product?.productOrigin)
              .map((type: string) => (
                <MenuItem
                  onClick={() =>
                    updateMemberHandler({
                      _id: product._id,
                      productOrigin: type,
                    })
                  }
                  key={type}
                >
                  <Typography variant={"subtitle1"} component={"span"}>
                    {type}
                  </Typography>
                </MenuItem>
              ))}
          </Menu>
        )}
      </Box>
    </div>
  );
};

export default MemberHorizontalCard;
