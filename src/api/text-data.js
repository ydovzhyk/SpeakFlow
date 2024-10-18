import { instance } from "./auth";

export const axiosCreateTextData = async (userData) => {
  const { data } = await instance.post("/textData/create", userData);
  return data;
};

export const axiosGetSearchTextData = async ({ searchText, page }) => {
  const response = await instance.get(`/textData/search`, {
    params: {
      text: searchText,
      page: page,
    },
  });
  return response.data;
};

export const axiosGetTextData = async (userData) => {
  const { data } = await instance.get(`/textData/search/page/${userData}`);
  return data;
};

export const axiosDeleteTextData = async (userData) => {
  const { data } = await instance.delete(`/textData/delete/${userData}`);
  return data;
};
