import axios from "axios";
import { URL } from "../constants/api";

const client = axios.create({ baseURL: URL });

/* 

    GET -> request({ url: "..." , method: 'get' })

    POST - PUT -> request({ url: "..." , method: "..." , data: {...} })

*/

export const authRequest = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return client(options).then((response) => response.data.result);
};

export const normalRequest = ({ ...options }) => {
  return client(options);
};
