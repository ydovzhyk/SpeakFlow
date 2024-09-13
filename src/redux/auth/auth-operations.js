import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  axiosLogin,
  axiosLogout,
  axiosRegister,
  axiosGetCurrentUser,
} from "../../api/auth";
import { setModalWindowStatus } from "../technical/technical-slice";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosRegister(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem("middleway.authData", JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLogin(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem("middleway.authData", JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLogout();
      localStorage.removeItem("middleway.authData");
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/current",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authDataJSON = localStorage.getItem("middleway.authData");
      const authData = JSON.parse(authDataJSON);
      const userData = authData;
      const data = await axiosGetCurrentUser(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/current",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authDataJSON = localStorage.getItem("kindergarten.authData");
      const authData = JSON.parse(authDataJSON);
      const userData = authData;
      const data = await axiosGetCurrentUser(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);
