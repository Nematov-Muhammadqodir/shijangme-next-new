import { register } from "module";

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",
  REMOVE_FAILED = "Remove failed!",
  UPLOAD_FAILED = "Upload is failed!",
  BAD_REQUEST = "Bad Request",

  USED_MEMBER_NICK_OR_PHONE = "Already used member nick, phone or vendor number!",
  NO_MEMBER_NICK = "No member with that member nick!",
  USED_NICK_PHONE = "You are inserting already used nick or phone!",
  WRONG_PASSWORD = "Wrong password, please try again!",
  NOT_AUTHENTICATED = "You are not authenticated, Please log in first!",
  TOKEN_NOT_EXIST = "Bearer Token is not provided",
  ONLY_SPECIFIC_ROLES_ALLOWED = "Allowed only for members with specific roles!",
  NOT_ALLOWED_REQUEST = "Not Allowed Request!",
  PROVIDE_ALLOWED_FORMAT = "Please provide jpg, jpeg or png images!",
  SELF_SUBSCRIPTION_DENIED = "Self subscription is denied!",
  BLOCKED_USER = "You have been blocked, contact restaurant!",
  TOKEN_CRAETION_FAILED = "Token creation error!",
  INSERT_ALL_INPUTS = "Please provide all inputs",
  VENDOR_EXISTS = "Vendor under this number already exists!",
  CREATE_ORDER_FAILED = "Create order failed! Please try again!",
}

export enum Direction {
  ASC = "ASC",
  DESC = "DESC",
}
