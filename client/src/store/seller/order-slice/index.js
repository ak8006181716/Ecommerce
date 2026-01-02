import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

export const getSellerOrders = createAsyncThunk(
  "/seller/orders/get",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/orders/get`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const getSellerOrderDetails = createAsyncThunk(
  "/seller/orders/details",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/orders/details/${id}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

const SellerOrderSlice = createSlice({
  name: "sellerOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getSellerOrders.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getSellerOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getSellerOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = SellerOrderSlice.actions;
export default SellerOrderSlice.reducer;

