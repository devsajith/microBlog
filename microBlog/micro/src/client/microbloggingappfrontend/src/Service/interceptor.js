import axios from "axios";
import Swal from "sweetalert2";
import serverConfig from "./serverConfig";
import { refreshToken } from "./userService";

export const axiosInstance = axios.create({
  baseURL: `${serverConfig.API_URL}`,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use((request) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 403 &&
      !originalRequest._retry &&
      error.config.url !== "/auth/refreshaccesstoken"
    ) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return axiosInstance(originalRequest);
      } catch (error) {
        Swal.fire({
          title: "Token Expired",
          text: "Your session has expired. Please log in again.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.clear();
          window.location.replace("/login");
        });
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const res = await refreshToken();

    const accessToken = res.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (err) {
    throw new Error("Failed to refresh access token.");
  }
};

