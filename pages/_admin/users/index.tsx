import TopNavigation from "@/libs/components/admin/TopNavigation";
import withLayoutAdmin from "@/libs/components/layout/AdminLayout";
import { MembersInquiry } from "@/libs/types/member/member.input";
import {
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Member } from "@/libs/types/member/member";
import { T } from "@/libs/types/common";
import { GET_ALL_MEMBERS_BY_ADMIN } from "@/apollo/admin/query";
import { MemberStatus, MemberType } from "@/libs/enums/member.enum";
import MemberHorizontalCard from "@/libs/components/admin/MemberHorizontalCard";
import { MemberUpdate } from "@/libs/types/member/member.update";
import { UPDATE_MEMBER_BY_ADMIN } from "@/apollo/admin/mutation";
import { sweetErrorHandling } from "@/libs/types/sweetAlert";

const Users = ({ initialInquiry, ...props }: any) => {
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [membersInquiry, setMembersInquiry] =
    useState<MembersInquiry>(initialInquiry);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersTotal, setMembersTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("ALL");
  const [value, setValue] = useState(
    membersInquiry?.search?.memberStatus
      ? membersInquiry?.search?.memberStatus
      : "ALL"
  );

  //APOLLO REQUESTS
  /** APOLLO REQUESTS **/
  const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);
  console.log("membersInquery", membersInquiry);
  const {
    loading: getAllMembersLoading,
    data: getAllMembersData,
    error: getAllMembersError,
    refetch: getAllMembersRefetch,
  } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: membersInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("getAllMembersData: ", data);
      setMembers(data?.getAllMembersByAdmin?.list);
      setMembersTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  //HANDLERS
  const textHandler = useCallback((value: string) => {
    try {
      setSearchText(value);
    } catch (err: any) {
      console.log("textHandler: ", err.message);
    }
  }, []);

  const searchTextHandler = () => {
    try {
      setMembersInquiry({
        ...membersInquiry,
        search: {
          ...membersInquiry.search,
          text: searchText,
        },
      });
    } catch (err: any) {
      console.log("searchTextHandler: ", err.message);
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    console.log("new Value", newValue);
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setMembersInquiry({
          ...membersInquiry,
          page: 1,
          search: {
            ...membersInquiry.search,
            memberType: newValue as MemberType,
          },
        });
      } else {
        delete membersInquiry?.search?.memberType;
        setMembersInquiry({ ...membersInquiry });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };
  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const updateMemberHandler = async (updateData: MemberUpdate) => {
    try {
      await updateMemberByAdmin({
        variables: { input: updateData },
      });
      menuIconCloseHandler();
      await getAllMembersRefetch({ input: membersInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);
    setSearchText("");

    setMembersInquiry({ ...membersInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ALL":
        setMembersInquiry({
          ...membersInquiry,
          search: {},
        });
        break;
      case "ACTIVE":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.ACTIVE },
        });
        break;
      case "BLOCK":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.BLOCK },
        });
        break;
      case "DELETE":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.DELETE },
        });
        break;
      default:
        delete membersInquiry?.search?.memberStatus;
        setMembersInquiry({ ...membersInquiry });
        break;
    }
  };

  /** LIFECYCLES **/
  useEffect(() => {
    getAllMembersRefetch({ input: membersInquiry });
  }, [membersInquiry]);

  return (
    <div className="users-page">
      <Stack className="users-page-intro">
        <span className="page-name">Users Page</span>
        <span className="page-desc">View and Manage All Users</span>
      </Stack>
      <div className="top-navigation">
        <List className={"tab-menu"}>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "ALL")}
            value="ALL"
            className={value === "ALL" ? "li on" : "li"}
          >
            All
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
            value="ACTIVE"
            className={value === "ACTIVE" ? "li on" : "li"}
          >
            Active
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "BLOCK")}
            value="BLOCK"
            className={value === "BLOCK" ? "li on" : "li"}
          >
            Blocked
          </ListItem>
          <ListItem
            onClick={(e: any) => tabChangeHandler(e, "DELETE")}
            value="DELETE"
            className={value === "DELETE" ? "li on" : "li"}
          >
            Deleted
          </ListItem>
        </List>
      </div>
      <Stack className="members-list-main-container">
        <Stack className="search-container">
          <OutlinedInput
            value={searchText}
            onChange={(e: any) => textHandler(e.target.value)}
            sx={{ width: "100%" }}
            className={"search"}
            placeholder="Search user name"
            onKeyDown={(event) => {
              if (event.key == "Enter") searchTextHandler();
            }}
            endAdornment={
              <>
                {searchText && (
                  <CancelRoundedIcon
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      setSearchText("");
                      setMembersInquiry({
                        ...membersInquiry,
                        search: {
                          ...membersInquiry.search,
                          text: "",
                        },
                      });
                      await getAllMembersRefetch({ input: membersInquiry });
                    }}
                  />
                )}
                <InputAdornment
                  position="end"
                  onClick={() => searchTextHandler()}
                >
                  <img src="/img/icons/search_icon.png" alt={"searchIcon"} />
                </InputAdornment>
              </>
            }
          />
          <Select
            sx={{ width: "160px", ml: "20px" }}
            value={searchType}
            className="select-container"
          >
            <MenuItem value={"ALL"} onClick={() => "ALL"}>
              All
            </MenuItem>
            <MenuItem value={"USER"} onClick={() => searchTypeHandler("USER")}>
              User
            </MenuItem>
            <MenuItem
              value={"VENDOR"}
              onClick={() => searchTypeHandler("VENDOR")}
            >
              Vendor
            </MenuItem>
            <MenuItem
              value={"ADMIN"}
              onClick={() => searchTypeHandler("ADMIN")}
            >
              Admin
            </MenuItem>
          </Select>
        </Stack>
        <Stack className="members-list-container">
          <Stack className="member-list-header">
            <span className="mb-id">Member ID</span>
            <span className="nickname">Nick Name</span>
            <span className="phone">Phone Number</span>
            <span className="type">Status</span>
            <span className="state">Member Type</span>
          </Stack>
          <Stack className="members-list">
            {members.map((member, index) => {
              return (
                <MemberHorizontalCard
                  menuIconClickHandler={menuIconClickHandler}
                  anchorEl={anchorEl}
                  updateMemberHandler={updateMemberHandler}
                  menuIconCloseHandler={menuIconCloseHandler}
                  index={index}
                  member={member}
                  key={member?._id}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

Users.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 1000,
    search: {},
  },
};

export default withLayoutAdmin(Users);
