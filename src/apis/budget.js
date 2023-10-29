import { authRequest } from "../utils/axios-utils";

export const getBudget = ({ eventID, pageSize, currentPage, mode }) =>
  authRequest({
    url: `/budget/${eventID}?sizePage=${pageSize}&currentPage=${currentPage}&mode=${mode}`,
  });

export const createBudget = (data) =>
  authRequest({ url: "/budget", method: "post", data });

export const updateBudget = ({ budgetsId, ...budget }) =>
  authRequest({
    url: `/budget/${budgetsId}`,
    method: "put",
    data: {
      eventID: budget.eventID,
      budgetName: budget.budgetName,
      estExpense: budget.estExpense,
      realExpense: budget.realExpense,
      description: budget.description,
      urlImage: budget.urlImage,
      supplier: budget.supplier,
    },
  });

// status: PROCESSING - ACCEPT - REJECT
export const updateStatusBudget = ({ budgetsId, status }) =>
  authRequest({
    url: `/budget/${budgetsId}/${status}`,
    method: "put",
  });
