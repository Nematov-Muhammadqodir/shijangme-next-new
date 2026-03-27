import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { userVar } from "../../../apollo/store";
import {
  GET_PURCHASES,
  GET_PURCHASE_SUMMARY,
  GET_PRESET_PRODUCTS,
} from "../../../apollo/vendor/query";
import { CREATE_PURCHASE } from "../../../apollo/vendor/mutation";
import { Purchase, PurchaseInput, PurchaseSummary } from "../../types/vendor/purchase";
import { PresetProduct } from "../../types/vendor/preset";
import { ProductCollection } from "../../enums/product.enum";
import { UNITS } from "../../enums/vendor.enum";
import {
  sweetErrorHandling,
  sweetMixinSuccessAlert,
} from "../../types/sweetAlert";
import { T } from "../../types/common";

const VendorPurchases = () => {
  const user = useReactiveVar(userVar);
  const [tab, setTab] = useState(0); // 0=daily, 1=summary
  const [dateFilter, setDateFilter] = useState("today");
  const [openCreate, setOpenCreate] = useState(false);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [summary, setSummary] = useState<PurchaseSummary | null>(null);
  const [presets, setPresets] = useState<PresetProduct[]>([]);

  // New purchase form
  const [newPurchase, setNewPurchase] = useState<PurchaseInput>({
    purchaseDate: new Date().toISOString().split("T")[0],
    productName: "",
    productCollection: "",
    quantity: 0,
    unit: "kg",
    unitCost: 0,
    memo: "",
  });

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
        return {
          startDate: today.toISOString(),
          endDate: new Date(today.getTime() + 86400000).toISOString(),
        };
    }
  };

  /** APOLLO **/
  const [createPurchase] = useMutation(CREATE_PURCHASE);

  const { refetch: refetchPurchases } = useQuery(GET_PURCHASES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: getDateRange(),
      },
    },
    onCompleted: (data: T) => {
      setPurchases(data?.getPurchases?.list || []);
      setPurchaseTotal(data?.getPurchases?.metaCounter?.[0]?.total ?? 0);
    },
  });

  useQuery(GET_PURCHASE_SUMMARY, {
    fetchPolicy: "network-only",
    variables: { input: getDateRange() },
    onCompleted: (data: T) => {
      setSummary(data?.getPurchaseSummary || null);
    },
  });

  useQuery(GET_PRESET_PRODUCTS, {
    fetchPolicy: "network-only",
    onCompleted: (data: T) => {
      setPresets(data?.getPresetProducts || []);
    },
  });

  /** HANDLERS **/
  const handleCreatePurchase = async () => {
    try {
      if (!newPurchase.productName || newPurchase.quantity <= 0) return;
      const input = {
        ...newPurchase,
        purchaseDate: new Date(newPurchase.purchaseDate).toISOString(),
      };
      await createPurchase({ variables: { input } });
      await sweetMixinSuccessAlert("Purchase recorded!");
      setOpenCreate(false);
      setNewPurchase({
        purchaseDate: new Date().toISOString().split("T")[0],
        productName: "",
        productCollection: "",
        quantity: 0,
        unit: "kg",
        unitCost: 0,
        memo: "",
      });
      await refetchPurchases();
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handlePresetSelect = (preset: PresetProduct) => {
    setNewPurchase({
      ...newPurchase,
      productName: preset.productName,
      productCollection: preset.productCollection || "",
      unit: preset.unit,
      unitCost: preset.defaultUnitCost || 0,
      quantity: preset.defaultQuantity || 0,
    });
  };

  return (
    <div id="vendor-purchases-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Daily Purchases</Typography>
          <Typography className="sub-title">
            Track your daily stock buying and costs
          </Typography>
        </Stack>
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Daily View" />
        <Tab label="Weekly Summary" />
      </Tabs>

      {/* Date filter */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} alignItems="center">
        {[
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
        {tab === 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{ ml: "auto !important" }}
          >
            Record Purchase
          </Button>
        )}
      </Stack>

      {/* Daily View */}
      {tab === 0 && (
        <>
          <TableContainer
            sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f5f5" }}>
                  <TableCell>Product</TableCell>
                  <TableCell>Collection</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Unit Cost</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Memo</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No purchases recorded
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  purchases.map((p) => (
                    <TableRow key={p._id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{p.productName}</Typography>
                      </TableCell>
                      <TableCell>
                        {p.productCollection && (
                          <Chip label={p.productCollection} size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">{p.quantity}</TableCell>
                      <TableCell>{p.unit}</TableCell>
                      <TableCell align="right">
                        ₩{p.unitCost.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={700} color="primary">
                          ₩{p.totalCost.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {p.memo || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(p.purchaseDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {purchases.length > 0 && (
            <Typography
              variant="h6"
              textAlign="right"
              sx={{ mt: 2 }}
              color="primary"
            >
              Day Total: ₩
              {purchases
                .reduce((sum, p) => sum + p.totalCost, 0)
                .toLocaleString()}
            </Typography>
          )}
        </>
      )}

      {/* Summary View */}
      {tab === 1 && summary && (
        <>
          <TableContainer
            sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f5f5" }}>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Total Qty</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Total Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No data for this period
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  summary.items.map((item, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {item.productName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{item.totalQuantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={700} color="primary">
                          ₩{item.totalCost.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="h6"
            textAlign="right"
            sx={{ mt: 2 }}
            color="primary"
          >
            Grand Total: ₩{summary.grandTotal.toLocaleString()}
          </Typography>
        </>
      )}

      {/* Create Purchase Dialog */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Record Purchase</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Quick presets */}
            {presets.length > 0 && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Quick Presets
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {presets.map((preset) => (
                    <Chip
                      key={preset._id}
                      label={preset.productName}
                      onClick={() => handlePresetSelect(preset)}
                      variant="outlined"
                      clickable
                    />
                  ))}
                </Stack>
              </>
            )}

            <TextField
              label="Purchase Date"
              type="date"
              fullWidth
              value={newPurchase.purchaseDate}
              onChange={(e) =>
                setNewPurchase({ ...newPurchase, purchaseDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Product Name"
              fullWidth
              value={newPurchase.productName}
              onChange={(e) =>
                setNewPurchase({ ...newPurchase, productName: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Collection (optional)</InputLabel>
              <Select
                value={newPurchase.productCollection}
                label="Collection (optional)"
                onChange={(e) =>
                  setNewPurchase({
                    ...newPurchase,
                    productCollection: e.target.value,
                  })
                }
              >
                <MenuItem value="">None</MenuItem>
                {Object.values(ProductCollection).map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Quantity"
                type="number"
                value={newPurchase.quantity || ""}
                onChange={(e) =>
                  setNewPurchase({
                    ...newPurchase,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={newPurchase.unit}
                  label="Unit"
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, unit: e.target.value })
                  }
                >
                  {UNITS.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Unit Cost (₩)"
              type="number"
              fullWidth
              value={newPurchase.unitCost || ""}
              onChange={(e) =>
                setNewPurchase({
                  ...newPurchase,
                  unitCost: parseInt(e.target.value) || 0,
                })
              }
            />
            <Typography variant="body1" fontWeight={600} textAlign="right">
              Total: ₩
              {(newPurchase.quantity * newPurchase.unitCost).toLocaleString()}
            </Typography>
            <TextField
              label="Memo (optional)"
              fullWidth
              multiline
              rows={2}
              value={newPurchase.memo}
              onChange={(e) =>
                setNewPurchase({ ...newPurchase, memo: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreatePurchase}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VendorPurchases;
