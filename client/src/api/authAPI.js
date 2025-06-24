import axios from "./axiosInstance";

export const loginUser = (data) => {
  return axios.post("/login", data);
};

export const registerUser = (data) => {
  return axios.post("/register", data);
};

export const getUserProfile = () => {
  return axios.get("/profile");
}

export const getUserGroups = () => {
  return axios.get("/my-groups");
}

export const createGroup = (data) => {
  return axios.post("/create-group", data);
}