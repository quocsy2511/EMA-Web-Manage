import { authRequest } from "../utils/axios-utils";

export const getBudget = ({ eventID, pageSize, currentPage, mode, userID }) =>
  authRequest({
    url: `/budget/${eventID}?sizePage=${pageSize}&currentPage=${currentPage}&mode=${mode}${
      userID ? `&userID=${userID}` : ""
    }`,
  });

export const createBudget = (budget) =>
  authRequest({ url: "/budget", method: "post", data: budget });

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

// status: PROCESSING - ACCEPT - REJECT - CANCEL
export const updateStatusBudget = ({ budgetsId, status }) =>
  authRequest({
    url: `/budget/${budgetsId}/${status}`,
    method: "put",
  });
