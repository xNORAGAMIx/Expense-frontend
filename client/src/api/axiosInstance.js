//aws-url:https://e7be1e36d24e.ngrok-free.app
//base: "http://localhost:8080/api/v1"

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://192.168.0.157/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if using cookies/session
});

export default axiosInstance;
