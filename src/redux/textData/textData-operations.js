import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  axiosCreateTextData,
  axiosGetSearchTextData,
  axiosGetTextData,
  axiosDeleteTextData,
} from "../../api/text-data";
import { setModalWindowStatus } from "../technical/technical-slice";

export const createTextData = createAsyncThunk(
  "textData/create",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosCreateTextData(userData);
      dispatch(setModalWindowStatus(true));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const getSearchTextData = createAsyncThunk(
  "textData/search",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosGetSearchTextData(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const getTextData = createAsyncThunk(
  "textData/search/page",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosGetTextData(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteTextData = createAsyncThunk(
  "textData/delete",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosDeleteTextData(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);
