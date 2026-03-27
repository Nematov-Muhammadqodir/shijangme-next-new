import { useQuery, useReactiveVar } from "@apollo/client";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useRouter } from "next/router";
import { userVar } from "../../../apollo/store";
import { GET_VENDORS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { REACT_APP_API_URL } from "../../types/config";

interface Vendor {
  _id: string;
  memberNick: string;
  memberImage: string;
  memberAddress: string;
  memberProducts: number;
}

const BrowseVendors = () => {
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useQuery(GET_VENDORS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 50,
        sort: "createdAt",
        direction: "DESC",
        search: {
          ...(searchText && { text: searchText }),
        },
      },
    },
    onCompleted: (data: T) => {
      const list = data?.getVendors?.list || [];
      // Filter out self
      setVendors(list.filter((v: Vendor) => v._id !== user._id));
    },
  });

  const handleVendorClick = (vendorId: string) => {
    router.push({
      pathname: "/mypage",
      query: { category: "vendorFridge", vendorId },
    });
  };

  return (
    <div id="browse-vendors-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Browse Vendors</Typography>
          <Typography className="sub-title">
            Find vendors to view stock and request borrowing
          </Typography>
        </Stack>
      </Stack>

      <TextField
        size="small"
        placeholder="Search vendors..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 3, minWidth: 300 }}
      />

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={2}
        useFlexGap
      >
        {vendors.length === 0 ? (
          <Typography color="text.secondary">No vendors found</Typography>
        ) : (
          vendors.map((vendor) => (
            <Card
              key={vendor._id}
              sx={{ width: 280, borderRadius: 2 }}
              elevation={2}
            >
              <CardActionArea onClick={() => handleVendorClick(vendor._id)}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={
                        vendor.memberImage
                          ? `${REACT_APP_API_URL}/${vendor.memberImage}`
                          : undefined
                      }
                      sx={{ width: 56, height: 56 }}
                    >
                      <StorefrontIcon />
                    </Avatar>
                    <Stack>
                      <Typography fontWeight={600}>
                        {vendor.memberNick}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vendor.memberAddress || "No address"}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {vendor.memberProducts} products
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        )}
      </Stack>
    </div>
  );
};

export default BrowseVendors;
