import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaidIcon from "@mui/icons-material/Paid";
import { userVar } from "../../../apollo/store";
import {
  GET_MY_LOANS,
  GET_GIVEN_LOANS,
  GET_INCOMING_REQUESTS,
} from "../../../apollo/vendor/query";
import {
  APPROVE_BORROW_REQUEST,
  REJECT_BORROW_REQUEST,
  MARK_LOAN_PAID,
} from "../../../apollo/vendor/mutation";
import { Loan, BorrowRequest } from "../../types/vendor/loan";
import { LoanStatus, BorrowRequestStatus } from "../../enums/vendor.enum";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
  sweetMixinSuccessAlert,
} from "../../types/sweetAlert";
import { T } from "../../types/common";
import { REACT_APP_API_URL } from "../../types/config";

const VendorLoans = () => {
  const user = useReactiveVar(userVar);
  const [tab, setTab] = useState(0);
  const [loanStatusFilter, setLoanStatusFilter] = useState("ALL");

  // Borrowed loans
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [borrowedTotal, setBorrowedTotal] = useState(0);

  // Lent loans
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [lentTotal, setLentTotal] = useState(0);

  // Requests
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [requestsTotal, setRequestsTotal] = useState(0);

  /** APOLLO **/
  const [approveBorrowRequest] = useMutation(APPROVE_BORROW_REQUEST);
  const [rejectBorrowRequest] = useMutation(REJECT_BORROW_REQUEST);
  const [markLoanPaid] = useMutation(MARK_LOAN_PAID);

  const loanSearch: any = {
    page: 1,
    limit: 100,
    sort: "createdAt",
    direction: "DESC",
    search: {
      ...(loanStatusFilter !== "ALL" && { status: loanStatusFilter }),
    },
  };

  const { refetch: refetchBorrowed } = useQuery(GET_MY_LOANS, {
    fetchPolicy: "network-only",
    variables: { input: loanSearch },
    onCompleted: (data: T) => {
      setBorrowedLoans(data?.getMyLoans?.list || []);
      setBorrowedTotal(data?.getMyLoans?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const { refetch: refetchLent } = useQuery(GET_GIVEN_LOANS, {
    fetchPolicy: "network-only",
    variables: { input: loanSearch },
    onCompleted: (data: T) => {
      setLentLoans(data?.getGivenLoans?.list || []);
      setLentTotal(data?.getGivenLoans?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const { refetch: refetchRequests } = useQuery(GET_INCOMING_REQUESTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: { status: BorrowRequestStatus.PENDING },
      },
    },
    onCompleted: (data: T) => {
      setRequests(data?.getIncomingRequests?.list || []);
      setRequestsTotal(data?.getIncomingRequests?.metaCounter?.[0]?.total ?? 0);
    },
  });

  /** HANDLERS **/
  const handleApprove = async (requestId: string) => {
    try {
      if (await sweetConfirmAlert("Approve this borrow request?")) {
        await approveBorrowRequest({ variables: { requestId } });
        await sweetMixinSuccessAlert("Approved!");
        await refetchRequests();
        await refetchLent();
      }
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      if (await sweetConfirmAlert("Reject this borrow request?")) {
        await rejectBorrowRequest({ variables: { requestId } });
        await sweetMixinSuccessAlert("Rejected");
        await refetchRequests();
      }
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handleMarkPaid = async (loanId: string) => {
    try {
      if (await sweetConfirmAlert("Mark this loan as paid?")) {
        await markLoanPaid({ variables: { loanId } });
        await sweetMixinSuccessAlert("Marked as paid!");
        await refetchLent();
      }
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const getStatusChip = (status: string) => {
    const colorMap: Record<string, "warning" | "success" | "error"> = {
      OPEN: "warning",
      PAID: "success",
      OVERDUE: "error",
    };
    return (
      <Chip
        label={status}
        size="small"
        color={colorMap[status] || "default"}
      />
    );
  };

  const renderLoanTable = (loans: Loan[], isLender: boolean) => (
    <TableContainer sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#f5f5f5" }}>
            <TableCell>{isLender ? "Borrower" : "Lender"}</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            {isLender && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No loans found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            loans.map((loan) => {
              const counterparty = isLender
                ? loan.borrowerData
                : loan.lenderData;
              return (
                <TableRow key={loan._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        src={
                          counterparty?.memberImage
                            ? `${REACT_APP_API_URL}/${counterparty.memberImage}`
                            : undefined
                        }
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography fontWeight={600}>
                        {counterparty?.memberNick || "Unknown"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {loan.items.map((item, i) => (
                      <Typography variant="body2" key={i}>
                        {item.productName} x{item.quantity} {item.unit}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={700} color="primary">
                      ₩{loan.totalAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(loan.status)}</TableCell>
                  <TableCell>
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </TableCell>
                  {isLender && (
                    <TableCell align="center">
                      {loan.status === LoanStatus.OPEN && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          startIcon={<PaidIcon />}
                          onClick={() => handleMarkPaid(loan._id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div id="vendor-loans-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Loans & Borrowing</Typography>
          <Typography className="sub-title">
            Manage loans between vendors
          </Typography>
        </Stack>
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Borrowed (${borrowedTotal})`} />
        <Tab label={`Lent (${lentTotal})`} />
        <Tab label={`Requests (${requestsTotal})`} />
      </Tabs>

      {/* Status filter for Borrowed/Lent tabs */}
      {tab < 2 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {["ALL", "OPEN", "PAID", "OVERDUE"].map((s) => (
            <Chip
              key={s}
              label={s}
              onClick={() => setLoanStatusFilter(s)}
              color={loanStatusFilter === s ? "primary" : "default"}
              variant={loanStatusFilter === s ? "filled" : "outlined"}
            />
          ))}
        </Stack>
      )}

      {/* Borrowed Tab */}
      {tab === 0 && renderLoanTable(borrowedLoans, false)}

      {/* Lent Tab */}
      {tab === 1 && renderLoanTable(lentLoans, true)}

      {/* Requests Tab */}
      {tab === 2 && (
        <TableContainer
          sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#f5f5f5" }}>
                <TableCell>Requester</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No pending requests
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req._id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={
                            req.requesterData?.memberImage
                              ? `${REACT_APP_API_URL}/${req.requesterData.memberImage}`
                              : undefined
                          }
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography fontWeight={600}>
                          {req.requesterData?.memberNick || "Unknown"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{req.productName}</TableCell>
                    <TableCell align="right">{req.quantity}</TableCell>
                    <TableCell>{req.unit}</TableCell>
                    <TableCell align="right">
                      ₩{req.unitPrice?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {req.message || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleApprove(req._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleReject(req._id)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default VendorLoans;
