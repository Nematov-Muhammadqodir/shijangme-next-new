import { useMutation } from "@apollo/client";
import { Button, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { NoticeInput } from "../../../libs/types/cs/notice.input";
import {
  NoticeCategory,
  NoticeFor,
  NoticeStatus,
} from "../../../libs/enums/notice.enum";
import { CREATE_NOTICE } from "../../../apollo/admin/mutation";
import {
  sweetErrorHandling,
  sweetMixinSuccessAlert,
} from "../../../libs/types/sweetAlert";
import withLayoutAdmin from "../../../libs/components/layout/AdminLayout";

const CS = ({ initialValues, ...props }: any) => {
  const [insertNoticeData, setInsertNoticeData] =
    useState<NoticeInput>(initialValues);

  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory[]>(
    Object.values(NoticeCategory)
  );
  const [noticeStatus, setNoticeStatus] = useState<NoticeStatus[]>(
    Object.values(NoticeStatus)
  );
  const [noticeFor, setNoticeFor] = useState<NoticeFor[]>(
    Object.values(NoticeFor)
  );

  /** APOLLO REQUESTS **/
  const [createNotice] = useMutation(CREATE_NOTICE);

  const insertNoticeHandler = useCallback(async () => {
    try {
      const result = await createNotice({
        variables: { input: insertNoticeData },
      });

      await sweetMixinSuccessAlert(
        "This notice has been created successfully!"
      );
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  }, [insertNoticeData]);

  const doDisabledCheck = () => {
    if (
      insertNoticeData.noticeTitle === "" ||
      insertNoticeData.noticeContent === "" || // @ts-ignore
      insertNoticeData.noticeCategory === "" || // @ts-ignore
      insertNoticeData.noticeStatus === "" || // @ts-ignore
      insertNoticeData.noticeFor === ""
    ) {
      return true;
    }
  };
  return (
    <div className="cs-page">
      <Stack className="products-page-intro">
        <span className="page-name">Customer Service Center</span>
        <span className="page-desc">Manage Your Customer Services Here</span>
      </Stack>

      <div>
        <Stack className="cs-config">
          <Stack className="cs-description-box">
            <Stack className="cs-config-column">
              <Typography className="title">Title</Typography>
              <input
                type="text"
                className="description-input"
                placeholder={"Title"}
                value={insertNoticeData.noticeTitle}
                onChange={({ target: { value } }) =>
                  setInsertNoticeData({
                    ...insertNoticeData,
                    noticeTitle: value,
                  })
                }
              />
              <Typography className="title">Notice Content</Typography>
              <input
                type="text"
                className="description-input"
                placeholder={"Notice Content"}
                value={insertNoticeData.noticeContent}
                onChange={({ target: { value } }) =>
                  setInsertNoticeData({
                    ...insertNoticeData,
                    noticeContent: value,
                  })
                }
              />
            </Stack>
            <Stack className="cs-config-row">
              <Stack className="price-year-after-price">
                <Typography className="title">Notice Category</Typography>
                <select
                  className={"select-description"}
                  defaultValue={insertNoticeData.noticeCategory || "select"}
                  value={insertNoticeData.noticeCategory || "select"}
                  onChange={({ target: { value } }) =>
                    // @ts-ignore
                    setInsertNoticeData({
                      ...insertNoticeData,
                      noticeCategory: value as NoticeCategory,
                    })
                  }
                >
                  <>
                    <option selected={true} disabled={true} value={"select"}>
                      Select
                    </option>
                    {noticeCategory.map((category: any) => (
                      <option value={`${category}`} key={category}>
                        {category}
                      </option>
                    ))}
                  </>
                </select>
              </Stack>
              <Stack className="price-year-after-price">
                <Typography className="title">Notice For?</Typography>
                <select
                  className={"select-description"}
                  defaultValue={insertNoticeData.noticeFor || "select"}
                  value={insertNoticeData.noticeFor || "select"}
                  onChange={({ target: { value } }) =>
                    // @ts-ignore
                    setInsertNoticeData({
                      ...insertNoticeData,
                      noticeFor: value as NoticeFor,
                    })
                  }
                >
                  <>
                    <option selected={true} disabled={true} value={"select"}>
                      Select
                    </option>
                    {noticeFor.map((category: any) => (
                      <option value={`${category}`} key={category}>
                        {category}
                      </option>
                    ))}
                  </>
                </select>
              </Stack>
            </Stack>
            <Stack className="cs-buttons-row">
              <Button
                className="next-button"
                disabled={doDisabledCheck()}
                onClick={insertNoticeHandler}
              >
                <Typography className="next-button-text">Save</Typography>
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

CS.defaultProps = {
  initialValues: {
    noticeTitle: "",
    noticeContent: "",
    noticeFor: NoticeFor.PRODUCT,
    noticeStatus: NoticeStatus.ACTIVE,
    noticeCategory: NoticeCategory.FAQ,
  },
};

export default withLayoutAdmin(CS);
