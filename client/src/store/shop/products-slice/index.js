import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isLoadingMore: false,
  productList: [],
  productDetails: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
    hasMore: false,
  },
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page = 1, append = false }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page: page.toString(),
      limit: "20",
    });

    const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/products/get?${query}`
    );

    return { ...result?.data, append };
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    resetProductList: (state) => {
      state.productList = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 20,
        hasMore: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        
        if (action.payload.append) {
          // Append new products to existing list
          state.productList = [...state.productList, ...action.payload.data];
        } else {
          // Replace product list (new search/filter)
          state.productList = action.payload.data;
        }
        
        // Update pagination info
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        if (!action.meta.arg.append) {
          state.productList = [];
        }
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails, resetProductList } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
