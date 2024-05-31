import axios from "axios";

const apiUrl = "https://jsonplaceholder.typicode.com";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const authToken = "tokenString";

    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
  },
  (error) => {
    throw new Error(error);
  }
);
