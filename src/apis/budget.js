import { authRequest } from "../utils/axios-utils";

export const getBudget = () => authRequest({ url: "/budget" });

export const createBudget = (data) =>
  authRequest({ url: "/budget", method: "post", data });

export const updateBudget = ({ budgetsId, ...budget }) =>
  authRequest({ url: `/budget/${budgetsId}`, method: "put", data: budget });

// status: PROCESSING - ACCEPT - REJECT
export const updateStatusBudget = ({ budgetsId, status }) =>
  authRequest({
    url: `/budget/${budgetsId}/${status}`,
    method: "put",
  });
