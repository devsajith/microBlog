import { axiosInstance } from "./interceptor";

export const CommonPost = async (url, post) => {
  const response = await axiosInstance
    .post(`${url}`, post)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  return response;
};

export const CommonGet = async (url) => {
  const response = await axiosInstance
    .get(`${url}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  return response;
};

export const CommonPut = async (url, post) => {
  const response = await axiosInstance
    .put(`${url}`, post)
    .catch(function (error) {
      return error;
    });
  return response;
};
