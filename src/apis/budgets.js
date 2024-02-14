import http from "../utils/axios-utils";

export const getBudget = ({ eventID, pageSize, currentPage, mode, userID }) =>
  http({
    url: `/budget/${eventID}?sizePage=${pageSize}&currentPage=${currentPage}&mode=${mode}${
      userID ? `&userID=${userID}` : ""
    }`,
  });

export const createBudget = (budget) =>
  http({ url: "/budget", method: "post", data: budget });

export const updateBudget = ({ budgetsId, ...budget }) =>
  http({
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
  http({
    url: `/budget/${budgetsId}/${status}`,
    method: "put",
  });

export const deleteBudget = ({ budgetID }) =>
  http({
    url: `/budget/detail/${budgetID}`,
    method: "delete",
  });
