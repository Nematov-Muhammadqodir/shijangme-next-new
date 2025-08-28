import {
  NoticeCategory,
  NoticeFor,
  NoticeStatus,
} from "../../enums/notice.enum";

export interface NoticeInput {
  noticeCategory: NoticeCategory;
  noticeStatus: NoticeStatus;
  noticeFor: NoticeFor;
  noticeTitle: string;
  noticeContent: string;
  memberId?: string;
}
