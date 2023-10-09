import axios from "axios";
import { URL } from "../constants/api";
import { normalRequest } from "../utils/axios-utils";

export const login = ({ email, password }) =>
  normalRequest({
    url: "/auth/login",
    method: "post",
    data: { email, password },
  });
