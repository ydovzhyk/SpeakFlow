import { createSlice } from "@reduxjs/toolkit";

import {
  createTextData,
  getSearchTextData,
  getTextData,
} from "./textData-operations";

const initialState = {
  textDataAray: [],
  searchTextDataArray: [],
  error: null,
  message: null,
  totalSearchPage: 1,
};

const textData = createSlice({
  name: "textData",
  initialState,
  reducers: {
    clearTextDataArray: (store, action) => {
      store.modalWindowStatus = action.payload ? action.payload : [];
    },
    clearTextDataError: (store) => {
      store.error = null;
    },
    clearTextDataMessage: (store) => {
      store.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // *Create
      .addCase(createTextData.pending, (store) => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(createTextData.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
      })
      .addCase(createTextData.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = "Oops, something went wrong, try again";
        }
      })
      // *Search by word
      .addCase(getSearchTextData.pending, (store) => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(getSearchTextData.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.searchTextDataArray = payload.results;
        store.totalSearchPage = payload.totalPages;
      })
      .addCase(getSearchTextData.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = "Oops, something went wrong, try again";
        }
      })
      // * Search by page
      .addCase(getTextData.pending, (store) => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(getTextData.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.searchTextDataArray = payload.searchTextDataArray;
      })
      .addCase(getTextData.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = "Oops, something went wrong, try again";
        }
      });
  },
});

export default textData.reducer;
export const { clearTextDataArray, clearTextDataError, clearTextDataMessage } =
  textData.actions;
