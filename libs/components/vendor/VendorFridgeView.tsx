import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { userVar } from "../../../apollo/store";
import { GET_VENDOR_FRIDGE } from "../../../apollo/vendor/query";
import { GET_MEMBER } from "../../../apollo/user/query";
import { CREATE_BORROW_REQUEST } from "../../../apollo/vendor/mutation";
import { FridgeItem } from "../../types/vendor/fridge";
import { BorrowRequestInput } from "../../types/vendor/loan";
import { UNITS } from "../../enums/vendor.enum";
import {
  sweetErrorHandling,
  sweetMixinSuccessAlert,
} from "../../types/sweetAlert";
import { T } from "../../types/common";
import { REACT_APP_API_URL } from "../../types/config";

const VendorFridgeView = () => {
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const vendorId = router.query.vendorId as string;

  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [vendorInfo, setVendorInfo] = useState<any>(null);
  const [openBorrow, setOpenBorrow] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FridgeItem | null>(null);
  const [borrowForm, setBorrowForm] = useState<BorrowRequestInput>({
    targetVendorId: vendorId || "",
    productName: "",
    quantity: 0,
    unit: "kg",
    unitPrice: 0,
    message: "",
  });

  /** APOLLO **/
  const [createBorrowRequest] = useMutation(CREATE_BORROW_REQUEST);

  useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: vendorId },
    skip: !vendorId,
    onCompleted: (data: T) => {
      setVendorInfo(data?.getMember || null);
    },
  });

  useQuery(GET_VENDOR_FRIDGE, {
    fetchPolicy: "network-only",
    variables: {
      vendorId: vendorId,
      input: {
        page: 1,
        limit: 100,
        search: { itemStatus: "ACTIVE" },
      },
    },
    skip: !vendorId,
    onCompleted: (data: T) => {
      setFridgeItems(data?.getVendorFridge?.list || []);
    },
  });

  /** HANDLERS **/
  const handleBorrowClick = (item: FridgeItem) => {
    setSelectedItem(item);
    setBorrowForm({
      targetVendorId: vendorId,
      productName: item.productName,
      quantity: 0,
      unit: item.unit,
      unitPrice: 0,
      message: "",
    });
    setOpenBorrow(true);
  };

  const handleSubmitBorrow = async () => {
    try {
      if (borrowForm.quantity <= 0) return;
      if (selectedItem && borrowForm.quantity > selectedItem.currentStock) {
        throw new Error("Quantity exceeds available stock!");
      }
      await createBorrowRequest({ variables: { input: borrowForm } });
      await sweetMixinSuccessAlert("Borrow request sent!");
      setOpenBorrow(false);
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  return (
    <div id="vendor-fridge-view-page">
      <Stack className="main-title-box">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() =>
              router.push({
                pathname: "/mypage",
                query: { category: "browseVendors" },
              })
            }
          >
            Back
          </Button>
          {vendorInfo && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                src={
                  vendorInfo.memberImage
                    ? `${REACT_APP_API_URL}/${vendorInfo.memberImage}`
                    : undefined
                }
                sx={{ width: 40, height: 40 }}
              />
              <Stack>
                <Typography className="main-title">
                  {vendorInfo.memberNick}&apos;s Stock
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vendorInfo.memberAddress}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>

      <TableContainer
        sx={{ background: "#fff", borderRadius: 2, boxShadow: 1, mt: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell>Product</TableCell>
              <TableCell>Collection</TableCell>
              <TableCell align="center">Available</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fridgeItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No items available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              fridgeItems.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{item.productName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.productCollection} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      fontWeight={700}
                      color={item.currentStock > 5 ? "#4caf50" : "#ff9800"}
                    >
                      {item.currentStock}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleBorrowClick(item)}
                      disabled={item.currentStock <= 0}
                    >
                      Request to Borrow
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Borrow Request Dialog */}
      <Dialog
        open={openBorrow}
        onClose={() => setOpenBorrow(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Request to Borrow: {selectedItem?.productName}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Available: {selectedItem?.currentStock} {selectedItem?.unit}
            </Typography>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={borrowForm.quantity || ""}
              onChange={(e) =>
                setBorrowForm({
                  ...borrowForm,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
            />
            <TextField
              label="Unit Price (optional, ₩)"
              type="number"
              fullWidth
              value={borrowForm.unitPrice || ""}
              onChange={(e) =>
                setBorrowForm({
                  ...borrowForm,
                  unitPrice: parseInt(e.target.value) || 0,
                })
              }
            />
            <TextField
              label="Message (optional)"
              fullWidth
              multiline
              rows={2}
              value={borrowForm.message}
              onChange={(e) =>
                setBorrowForm({ ...borrowForm, message: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBorrow(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitBorrow}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VendorFridgeView;
