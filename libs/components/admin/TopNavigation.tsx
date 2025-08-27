import { MemberStatus } from "@/libs/enums/member.enum";
import { MembersInquiry } from "@/libs/types/member/member.input";
import { List, ListItem } from "@mui/material";
import React, { useState } from "react";

interface TopNavigationProps {
  type: string;
  initialInquiry?: any;
}
const TopNavigation = (props: TopNavigationProps) => {
  const { initialInquiry, type } = props;
  const [membersInquiry, setMembersInquiry] =
    useState<MembersInquiry>(initialInquiry);
  const [value, setValue] = useState(
    membersInquiry?.search?.memberStatus
      ? membersInquiry?.search?.memberStatus
      : "ALL"
  );
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("ALL");
  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);
    setSearchText("");

    setMembersInquiry({ ...membersInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
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
  return (
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
          {type === "users" ? "Blocked" : "Sold"}
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
  );
};

export default TopNavigation;
