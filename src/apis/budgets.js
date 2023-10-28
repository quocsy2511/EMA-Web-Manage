import { authRequest } from "../utils/axios-utils";

export const getListBudget = ({ eventID, pageSize, currentPage, mode }) =>
  authRequest({
    url: `/budget/${eventID}?&sizePage=${pageSize}&currentPage=${currentPage}&mode=${mode}`,
  });
export const postBudget = (budget) => {
  authRequest({ url: `budget`, method: "post", data: budget });
};
export const updateBudget = ({ budgetsId, budget }) =>
  authRequest({
    url: `/budget/${budgetsId}`,
    method: "put",
    data: budget,
  });
export const updateBudgetStatus = ({ budgetsId, status }) =>
  authRequest({
    url: `/budget/${budgetsId}/${status}`,
    method: "put",
  });
