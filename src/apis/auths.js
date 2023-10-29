import axios from "axios";
import { normalRequest } from "../utils/axios-utils";

export const login = ({ email, password }) =>
  normalRequest({
    url: "/auth/login",
    method: "post",
    data: { email, password },
  });
