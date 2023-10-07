import axios from "axios";
import { URL } from "../constants/api";

export const login = ({ email, password }) =>
  axios.post(`${URL}/auth/login`, { email, password });

