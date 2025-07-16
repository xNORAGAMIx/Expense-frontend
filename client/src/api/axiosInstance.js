//aws-url:https://219ac7580940.ngrok-free.app
//base: "http://localhost:8080/api/v1"

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if using cookies/session
});

export default axiosInstance;
