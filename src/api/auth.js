import axios from "axios";

const REACT_APP_API_URL = "http://localhost:4000";
// const REACT_APP_API_URL =
//   'https://middleway-backend-5929651d3ff1.herokuapp.com';

export const instance = axios.create({
  baseURL: REACT_APP_API_URL,
});

async function getAuthDataFromLocalStorage() {
  const dataFromLocalStorage = localStorage.getItem("SpeakFlow.authData");
  if (dataFromLocalStorage) {
    return JSON.parse(dataFromLocalStorage);
  }
  return null;
}

instance.interceptors.request.use(
  async (config) => {
    const authData = await getAuthDataFromLocalStorage();
    if (authData && authData.accessToken && config.url !== "/auth/refresh") {
      config.headers["Authorization"] = `Bearer ${authData.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response.status === 401 &&
      error.response.data.message === "Unauthorized"
    ) {
      try {
        const authData = await getAuthDataFromLocalStorage();
        if (authData.refreshToken) {
          const { refreshToken, sid } = authData;

          instance.defaults.headers.Authorization = `Bearer ${refreshToken}`;
          const { data } = await instance.post("/auth/refresh", { sid });

          const authNewData = {
            accessToken: data.newAccessToken,
            refreshToken: data.newRefreshToken,
            sid: data.sid,
          };

          await localStorage.setItem(
            "SpeakFlow.authData",
            JSON.stringify(authNewData)
          );
        } else {
          return Promise.reject(error);
        }

        if (error.config.url === "/auth/current") {
          const authData = await getAuthDataFromLocalStorage();
          if (authData.accessToken) {
            const { accessToken, refreshToken, sid } = authData;
            const originalRequest = error.config;
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            originalRequest.data = {
              accessToken: accessToken,
              refreshToken: refreshToken,
              sid: sid,
            };
            return instance(originalRequest);
          } else {
            return Promise.reject(error);
          }
        } else {
          const authData = await getAuthDataFromLocalStorage();
          if (authData.accessToken) {
            const { accessToken } = authData;
            const originalRequest = error.config;
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return instance(originalRequest);
          } else {
            return Promise.reject(error);
          }
        }
      } catch (error) {
        return Promise.reject(error);
      }
    } else if (
      error.response.status === 401 &&
      error.response.data.message === "Refresh end, please login again"
    ) {
      const authData = {
        accessToken: null,
        refreshToken: null,
        sid: null,
      };
      localStorage.setItem("SpeakFlow.authData", JSON.stringify(authData));
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export const axiosRegister = async (userData) => {
  const { data } = await instance.post("/auth/register", userData);
  return data;
};

export const axiosLogin = async (userData) => {
  const { data } = await instance.post("/auth/login", userData);
  return data;
};

export const axiosLogout = async () => {
  const { data } = await instance.post("/auth/logout");
  return data;
};

export const axiosGetCurrentUser = async (userData) => {
  const { data } = await instance.post("/auth/current", userData);
  return data;
};
