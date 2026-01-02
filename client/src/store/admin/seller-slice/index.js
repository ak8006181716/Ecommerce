import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  sellerList: [],
  sellerOrders: null,
};

export const createSeller = createAsyncThunk(
  "/admin/sellers/create",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/sellers/create`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

export const getAllSellers = createAsyncThunk(
  "/admin/sellers/get",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/sellers/get`,
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

export const getSellerOrders = createAsyncThunk(
  "/admin/sellers/orders",
  async (sellerId) => {
    const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/sellers/orders/${sellerId}`,
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

const AdminSellerSlice = createSlice({
  name: "adminSeller",
  initialState,
  reducers: {
    resetSellerOrders: (state) => {
      state.sellerOrders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSellers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellerList = action.payload.data || [];
      })
      .addCase(getAllSellers.rejected, (state) => {
        state.isLoading = false;
        state.sellerList = [];
      })
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellerOrders = action.payload.data || null;
      })
      .addCase(getSellerOrders.rejected, (state) => {
        state.isLoading = false;
        state.sellerOrders = null;
      });
  },
});

export const { resetSellerOrders } = AdminSellerSlice.actions;
export default AdminSellerSlice.reducer;

