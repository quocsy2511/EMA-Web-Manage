import axios from "axios";
import { URL } from "../constants/api";

const client = axios.create({ baseURL: URL });
const token = localStorage.getItem("token");

/* 

    GET -> request({ url: "..." , method: 'get' })

    POST - PUT -> request({ url: "..." , method: "..." , data: {...} })

*/

export const authRequest = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
  return client(options);
};

export const normalRequest = ({ ...options }) => {
  return client(options);
};
