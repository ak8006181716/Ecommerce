import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addSellerProduct = createAsyncThunk(
  "/seller/products/add",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/products/add`,
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

export const fetchSellerProducts = createAsyncThunk(
  "/seller/products/get",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/products/get`,
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

export const editSellerProduct = createAsyncThunk(
  "/seller/products/edit",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/products/edit/${id}`,
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

export const deleteSellerProduct = createAsyncThunk(
  "/seller/products/delete",
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/products/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

export const uploadSellerProductImage = createAsyncThunk(
  "/seller/products/upload-image",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/products/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

const SellerProductsSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default SellerProductsSlice.reducer;

