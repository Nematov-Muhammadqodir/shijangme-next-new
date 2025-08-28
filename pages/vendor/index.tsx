import { Box, Button, Menu, MenuItem, Pagination, Stack } from "@mui/material";
import { useRouter } from "next/router";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Member } from "../../libs/types/member/member";
import { LIKE_TARGET_MEMBER } from "../../apollo/user/mutation";
import { GET_VENDORS } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { Messages } from "../../libs/types/config";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/types/sweetAlert";
import VendorCard from "../../libs/components/vendor/VendorCard";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const VendorList = ({ initialInput, ...props }: any) => {
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<any>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput
  );
  const [vendors, setVendors] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [filterSortName, setFilterSortName] = useState("Recent");
  const [sortingOpen, setSortingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(vendors.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);

  /** APOLLO REQUESTS **/
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
  console.log("searchFilter get_vendors", searchFilter);
  const {
    loading: getVendorsLoading,
    data: getVendorsData,
    error: getVendorsError,
    refetch: getVendorsRefetch,
  } = useQuery(GET_VENDORS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("data?.getVendors?.list", data?.getVendors?.list);
      setVendors(data?.getVendors?.list);
      setTotal(data?.getVendors?.metaCounter[0].total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.input) {
      const input_obj = JSON.parse(router?.query?.input as string);
      setSearchFilter(input_obj);
    } else
      router.replace(
        `/vendor?input=${JSON.stringify(searchFilter)}`,
        `/vendor?input=${JSON.stringify(searchFilter)}`
      );

    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router.isReady, router.query.input]);

  /** HANDLERS **/
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Optional: Scroll to top of the list when page changes for better UX
    window.scrollTo({ top: 700, behavior: "smooth" });
  };
  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
    const value = e.currentTarget.id;
    if (e.currentTarget.id === "recent") {
      await router.push(
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          sort: "createdAt",
          direction: "DESC",
        })}`,
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            sort: "createdAt",
            direction: "DESC",
          },
        })}`,
        { scroll: false }
      );
    } else if (e.currentTarget.id === "old") {
      await router.push(
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          sort: "createdAt",
          direction: "ASC",
        })}`,
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          sort: "createdAt",
          direction: "ASC",
        })}`,
        { scroll: false }
      );
    } else if (e.currentTarget.id === "likes") {
      await router.push(
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          sort: "memberLikes",
          direction: "DESC",
        })}`,
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          sort: "memberLikes",
          direction: "DESC",
        })}`,
        { scroll: false }
      );
    } else if (e.currentTarget.id === "views") {
      await router.push(
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          sort: "memberViews",
          direction: "DESC",
        })}`,
        `/vendor?input=${JSON.stringify({
          ...searchFilter,
          sort: "memberViews",
          direction: "DESC",
        })}`,
        { scroll: false }
      );
    }
    setSortingOpen(false);
    setAnchorEl2(null);
  };

  const likeMemberHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user) throw new Error(Messages.error2);

      await likeTargetMember({ variables: { input: id } });

      await getVendorsRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("Error, likeMemberHandler", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };
  return (
    <Stack className="agents-list-main-container">
      <Stack className="container">
        <Stack className={"filter"}>
          <Box component={"div"} className={"left"}>
            <input
              type="text"
              placeholder={"Search for an agent"}
              value={searchText}
              onChange={(e: any) => setSearchText(e.target.value)}
              onKeyDown={(event: any) => {
                if (event.key == "Enter") {
                  setSearchFilter({
                    ...searchFilter,
                    search: { ...searchFilter.search, text: searchText },
                  });
                }
              }}
            />
          </Box>
          <Box component={"div"} className={"right"}>
            <span>Sort by</span>
            <div>
              <Button
                onClick={sortingClickHandler}
                endIcon={<KeyboardArrowDownRoundedIcon />}
              >
                {filterSortName}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={sortingOpen}
                onClose={sortingCloseHandler}
                sx={{ paddingTop: "5px" }}
              >
                <MenuItem onClick={sortingHandler} id={"recent"} disableRipple>
                  Recent
                </MenuItem>
                <MenuItem onClick={sortingHandler} id={"old"} disableRipple>
                  Oldest
                </MenuItem>
                <MenuItem onClick={sortingHandler} id={"likes"} disableRipple>
                  Likes
                </MenuItem>
                <MenuItem onClick={sortingHandler} id={"views"} disableRipple>
                  Views
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Stack>
        <Stack className={"card-wrap"}>
          {vendors?.length === 0 ? (
            <div className={"no-data"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>No vendors found!</p>
            </div>
          ) : (
            vendors
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((vendor, index) => {
                return (
                  <VendorCard
                    key={index}
                    vendor={vendor}
                    likeMemberHandler={likeMemberHandler}
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
    </Stack>
  );
};

VendorList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    search: {},
  },
};

export default withLayoutMain(VendorList);
