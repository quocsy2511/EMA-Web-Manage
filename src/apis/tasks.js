import axios from "axios";
import { authRequest } from "../utils/axios-utils";

export const createTask = () =>
  authRequest({ url: "/task/createTask", method: "post", data: {} });
