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
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import { userVar } from "../../../apollo/store";
import { GET_FRIDGE_ITEMS } from "../../../apollo/vendor/query";
import {
  ADD_FRIDGE_ITEM,
  UPDATE_FRIDGE_ITEM,
  DELETE_FRIDGE_ITEM,
  RESTOCK_FRIDGE_ITEM,
} from "../../../apollo/vendor/mutation";
import { FridgeItem, FridgeItemInput } from "../../types/vendor/fridge";
import { FridgeItemStatus, UNITS } from "../../enums/vendor.enum";
import { ProductCollection } from "../../enums/product.enum";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
  sweetMixinSuccessAlert,
} from "../../types/sweetAlert";
import { T } from "../../types/common";

const VendorFridge = () => {
  const user = useReactiveVar(userVar);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openRestock, setOpenRestock] = useState(false);
  const [restockItem, setRestockItem] = useState<FridgeItem | null>(null);
  const [restockAmount, setRestockAmount] = useState(0);
  const [newItem, setNewItem] = useState<FridgeItemInput>({
    productName: "",
    productCollection: "",
    currentStock: 0,
    unit: "kg",
    memo: "",
  });

  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [total, setTotal] = useState(0);

  /** APOLLO REQUESTS **/
  const [addFridgeItem] = useMutation(ADD_FRIDGE_ITEM);
  const [updateFridgeItem] = useMutation(UPDATE_FRIDGE_ITEM);
  const [deleteFridgeItem] = useMutation(DELETE_FRIDGE_ITEM);
  const [restockFridgeItem] = useMutation(RESTOCK_FRIDGE_ITEM);

  const searchInput: any = {
    page: 1,
    limit: 100,
    sort: "updatedAt",
    direction: "DESC",
    search: {
      ...(statusFilter !== "ALL" && { itemStatus: statusFilter }),
      ...(searchText && { text: searchText }),
    },
  };

  const { loading, refetch } = useQuery(GET_FRIDGE_ITEMS, {
    fetchPolicy: "network-only",
    variables: { input: searchInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setFridgeItems(data?.getFridgeItems?.list || []);
      setTotal(data?.getFridgeItems?.metaCounter?.[0]?.total ?? 0);
    },
  });

  /** HANDLERS **/
  const handleStockChange = async (item: FridgeItem, delta: number) => {
    try {
      await updateFridgeItem({
        variables: {
          input: { _id: item._id, currentStock: item.currentStock + delta },
        },
      });
      await refetch();
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (await sweetConfirmAlert("Delete this fridge item?")) {
        await deleteFridgeItem({ variables: { input: id } });
        await sweetMixinSuccessAlert("Deleted!");
        await refetch();
      }
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handleAddItem = async () => {
    try {
      if (!newItem.productName || !newItem.productCollection) return;
      await addFridgeItem({ variables: { input: newItem } });
      await sweetMixinSuccessAlert("Item added!");
      setOpenAdd(false);
      setNewItem({
        productName: "",
        productCollection: "",
        currentStock: 0,
        unit: "kg",
        memo: "",
      });
      await refetch();
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const handleRestock = async () => {
    try {
      if (!restockItem || restockAmount <= 0) return;
      await restockFridgeItem({
        variables: {
          input: {
            productName: restockItem.productName,
            productCollection: restockItem.productCollection,
            amount: restockAmount,
            unit: restockItem.unit,
          },
        },
      });
      await sweetMixinSuccessAlert("Restocked!");
      setOpenRestock(false);
      setRestockItem(null);
      setRestockAmount(0);
      await refetch();
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock < 0) return "#f44336";
    if (stock <= 5) return "#ff9800";
    return "#4caf50";
  };

  return (
    <div id="vendor-fridge-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Cold Storage (Fridge)</Typography>
          <Typography className="sub-title">
            Manage your inventory and stock levels
          </Typography>
        </Stack>
      </Stack>

      {/* Controls */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3 }}
        alignItems="center"
        flexWrap="wrap"
      >
        <TextField
          size="small"
          placeholder="Search items..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && refetch()}
          sx={{ minWidth: 200 }}
        />
        {["ALL", "ACTIVE", "FINISHED"].map((s) => (
          <Chip
            key={s}
            label={s}
            onClick={() => setStatusFilter(s)}
            color={statusFilter === s ? "primary" : "default"}
            variant={statusFilter === s ? "filled" : "outlined"}
          />
        ))}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ ml: "auto !important" }}
        >
          Add Item
        </Button>
      </Stack>

      {/* Table */}
      <TableContainer
        sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell>Product</TableCell>
              <TableCell>Collection</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Memo</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fridgeItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No fridge items found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              fridgeItems.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {item.productName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.productCollection} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.itemStatus}
                      size="small"
                      color={
                        item.itemStatus === FridgeItemStatus.ACTIVE
                          ? "success"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleStockChange(item, -1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        fontWeight={700}
                        sx={{ color: getStockColor(item.currentStock) }}
                      >
                        {item.currentStock}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleStockChange(item, 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {item.memo || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={0.5}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setRestockItem(item);
                          setOpenRestock(true);
                        }}
                        title="Restock"
                      >
                        <InventoryIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item._id)}
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
        Total: {total} items
      </Typography>

      {/* Add Item Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Fridge Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Product Name"
              fullWidth
              value={newItem.productName}
              onChange={(e) =>
                setNewItem({ ...newItem, productName: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Collection</InputLabel>
              <Select
                value={newItem.productCollection}
                label="Collection"
                onChange={(e) =>
                  setNewItem({ ...newItem, productCollection: e.target.value })
                }
              >
                {Object.values(ProductCollection).map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Stock"
                type="number"
                value={newItem.currentStock}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    currentStock: parseInt(e.target.value) || 0,
                  })
                }
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={newItem.unit}
                  label="Unit"
                  onChange={(e) =>
                    setNewItem({ ...newItem, unit: e.target.value })
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
              label="Memo (optional)"
              fullWidth
              multiline
              rows={2}
              value={newItem.memo}
              onChange={(e) =>
                setNewItem({ ...newItem, memo: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddItem}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog
        open={openRestock}
        onClose={() => setOpenRestock(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Restock: {restockItem?.productName}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Current stock: {restockItem?.currentStock} {restockItem?.unit}
            </Typography>
            <TextField
              label="Amount to add"
              type="number"
              fullWidth
              value={restockAmount}
              onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRestock(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRestock}>
            Restock
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VendorFridge;
