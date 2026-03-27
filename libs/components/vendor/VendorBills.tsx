import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import { userVar } from "../../../apollo/store";
import { GET_BILLS, GET_FRIDGE_ITEMS } from "../../../apollo/vendor/query";
import { CREATE_BILL, DELETE_BILL } from "../../../apollo/vendor/mutation";
import { Bill, BillItem, BillInput } from "../../types/vendor/bill";
import { FridgeItem } from "../../types/vendor/fridge";
import { UNITS } from "../../enums/vendor.enum";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
  sweetMixinSuccessAlert,
} from "../../types/sweetAlert";
import { T } from "../../types/common";
import { formatDate } from "../../types/config";

const VendorBills = () => {
  const user = useReactiveVar(userVar);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [bills, setBills] = useState<Bill[]>([]);
  const [total, setTotal] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);

  // New bill form
  const [customerName, setCustomerName] = useState("");
  const [billMemo, setBillMemo] = useState("");
  const [billItems, setBillItems] = useState<BillItem[]>([
    { productName: "", quantity: 0, unit: "kg", unitPrice: 0, totalPrice: 0 },
  ]);

  /** Date helpers **/
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (dateFilter) {
      case "today":
        return {
          startDate: today.toISOString(),
          endDate: new Date(today.getTime() + 86400000).toISOString(),
        };
      case "yesterday":
        return {
          startDate: yesterday.toISOString(),
          endDate: today.toISOString(),
        };
      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - 7);
        return { startDate: weekStart.toISOString(), endDate: now.toISOString() };
      }
      case "month": {
        const monthStart = new Date(today);
        monthStart.setDate(monthStart.getDate() - 30);
        return { startDate: monthStart.toISOString(), endDate: now.toISOString() };
      }
      default:
        return {};
    }
  };

  /** APOLLO REQUESTS **/
  const [createBill] = useMutation(CREATE_BILL);
  const [deleteBill] = useMutation(DELETE_BILL);

  const searchInput: any = {
    page: 1,
    limit: 100,
    sort: "createdAt",
    direction: "DESC",
    search: {
      ...(searchText && { text: searchText }),
      ...getDateRange(),
    },
  };

  const { loading, refetch } = useQuery(GET_BILLS, {
    fetchPolicy: "network-only",
    variables: { input: searchInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBills(data?.getBills?.list || []);
      setTotal(data?.getBills?.metaCounter?.[0]?.total ?? 0);
    },
  });

  // Load fridge items for autocomplete
  useQuery(GET_FRIDGE_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 500,
        search: { itemStatus: "ACTIVE" },
      },
    },
    onCompleted: (data: T) => {
      setFridgeItems(data?.getFridgeItems?.list || []);
    },
  });

  /** HANDLERS **/
  const updateBillItem = (index: number, field: string, value: any) => {
    const updated = [...billItems];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unitPrice") {
      updated[index].totalPrice = updated[index].quantity * updated[index].unitPrice;
    }
    setBillItems(updated);
  };

  const addBillItemRow = () => {
    setBillItems([
      ...billItems,
      { productName: "", quantity: 0, unit: "kg", unitPrice: 0, totalPrice: 0 },
    ]);
  };

  const removeBillItemRow = (index: number) => {
    if (billItems.length > 1) {
      setBillItems(billItems.filter((_, i) => i !== index));
    }
  };

  const getBillTotal = () =>
    billItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleCreateBill = async () => {
    try {
      if (!customerName) return;
      const validItems = billItems.filter(
        (item) => item.productName && item.quantity > 0
      );
      if (validItems.length === 0) return;

      const input: BillInput = {
        customerName,
        items: validItems,
        totalAmount: getBillTotal(),
        memo: billMemo || undefined,
      };
      await createBill({ variables: { input } });
      await sweetMixinSuccessAlert("Bill created!");
      setOpenCreate(false);
      resetForm();
      await refetch();
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      if (await sweetConfirmAlert("Delete this bill?")) {
        await deleteBill({ variables: { billId: id } });
        await sweetMixinSuccessAlert("Deleted!");
        await refetch();
      }
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handlePrintBill = (bill: Bill) => {
    const printContent = `
      <html>
        <head><title>Bill - ${bill.customerName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #f5f5f5; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
        </style></head>
        <body>
          <h1>Invoice</h1>
          <p><strong>Vendor:</strong> ${bill.vendorName}</p>
          <p><strong>Customer:</strong> ${bill.customerName}</p>
          <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString()}</p>
          ${bill.memo ? `<p><strong>Memo:</strong> ${bill.memo}</p>` : ""}
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Unit</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${bill.items
                .map(
                  (item) =>
                    `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${item.unit}</td><td>₩${item.unitPrice.toLocaleString()}</td><td>₩${item.totalPrice.toLocaleString()}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total: ₩${bill.totalAmount.toLocaleString()}</p>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setBillMemo("");
    setBillItems([
      { productName: "", quantity: 0, unit: "kg", unitPrice: 0, totalPrice: 0 },
    ]);
  };

  return (
    <div id="vendor-bills-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Bills & Invoices</Typography>
          <Typography className="sub-title">
            Create and manage customer invoices
          </Typography>
        </Stack>
      </Stack>

      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center" flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search by customer..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && refetch()}
          sx={{ minWidth: 200 }}
        />
        {[
          { key: "all", label: "All" },
          { key: "today", label: "Today" },
          { key: "yesterday", label: "Yesterday" },
          { key: "week", label: "This Week" },
          { key: "month", label: "This Month" },
        ].map(({ key, label }) => (
          <Chip
            key={key}
            label={label}
            onClick={() => setDateFilter(key)}
            color={dateFilter === key ? "primary" : "default"}
            variant={dateFilter === key ? "filled" : "outlined"}
          />
        ))}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{ ml: "auto !important" }}
        >
          New Bill
        </Button>
      </Stack>

      {/* Bills Table */}
      <TableContainer sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Memo</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No bills found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => (
                <TableRow key={bill._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{bill.customerName}</Typography>
                  </TableCell>
                  <TableCell>{bill.items.length} items</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={700} color="primary">
                      ₩{bill.totalAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary"
                      sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {bill.memo || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={0.5}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedBill(bill);
                          setOpenDetail(true);
                        }}
                        title="View"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handlePrintBill(bill)}
                        title="Print"
                      >
                        <PrintIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteBill(bill._id)}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Total: {total} bills
      </Typography>

      {/* Create Bill Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Bill</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Customer Name"
              fullWidth
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <Typography variant="subtitle1" fontWeight={600}>
              Items
            </Typography>

            {billItems.map((item, index) => (
              <Stack direction="row" spacing={1} key={index} alignItems="center">
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel size="small">Product</InputLabel>
                  <Select
                    size="small"
                    value={item.productName}
                    label="Product"
                    onChange={(e) =>
                      updateBillItem(index, "productName", e.target.value)
                    }
                  >
                    {fridgeItems.map((f) => (
                      <MenuItem key={f._id} value={f.productName}>
                        {f.productName}
                      </MenuItem>
                    ))}
                    <MenuItem value={item.productName || "custom"}>
                      <em>Custom...</em>
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Qty"
                  type="number"
                  sx={{ width: 80 }}
                  value={item.quantity || ""}
                  onChange={(e) =>
                    updateBillItem(index, "quantity", parseInt(e.target.value) || 0)
                  }
                />
                <FormControl sx={{ width: 100 }}>
                  <InputLabel size="small">Unit</InputLabel>
                  <Select
                    size="small"
                    value={item.unit}
                    label="Unit"
                    onChange={(e) => updateBillItem(index, "unit", e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Unit Price"
                  type="number"
                  sx={{ width: 120 }}
                  value={item.unitPrice || ""}
                  onChange={(e) =>
                    updateBillItem(
                      index,
                      "unitPrice",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <Typography
                  sx={{ minWidth: 100, textAlign: "right" }}
                  fontWeight={600}
                >
                  ₩{item.totalPrice.toLocaleString()}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeBillItemRow(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addBillItemRow}
              sx={{ alignSelf: "flex-start" }}
            >
              Add Item
            </Button>

            <TextField
              label="Memo (optional)"
              fullWidth
              multiline
              rows={2}
              value={billMemo}
              onChange={(e) => setBillMemo(e.target.value)}
            />

            <Typography variant="h6" textAlign="right">
              Total: ₩{getBillTotal().toLocaleString()}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenCreate(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateBill}>
            Create Bill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bill Detail Dialog */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Bill Details</DialogTitle>
        <DialogContent>
          {selectedBill && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>
                  <strong>Vendor:</strong> {selectedBill.vendorName}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedBill.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
              <Typography>
                <strong>Customer:</strong> {selectedBill.customerName}
              </Typography>
              {selectedBill.memo && (
                <Typography color="text.secondary">
                  Memo: {selectedBill.memo}
                </Typography>
              )}

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedBill.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell align="right">
                          ₩{item.unitPrice.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ₩{item.totalPrice.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" textAlign="right" color="primary">
                Total: ₩{selectedBill.totalAmount.toLocaleString()}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Close</Button>
          {selectedBill && (
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => handlePrintBill(selectedBill)}
            >
              Print
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VendorBills;
