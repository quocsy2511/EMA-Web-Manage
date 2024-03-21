import http from "../utils/axios-utils";

export const getBudget = ({ assignee, eventID }) =>
  http({
    url: `/budget?${assignee ? `assignee=${assignee}` : ""}&eventID=${eventID}`,
  });

// type = "ALL" | "OWN";
export const getBudgetTransactionRequest = ({ assignee, eventID, type }) =>
  http({
    url: `/budget/transaction-request?${
      assignee ? `assignee=${assignee}` : ""
    }&eventID=${eventID}&type=${type}`,
  });

export const getOwnTransactionBudget = ({
  sizePage,
  currentPage,
  sortProperty,
  sort,
  status,
}) =>
  http({
    url: `/budget/own-transaction?sizePage=${sizePage}&currentPage=${currentPage}&sortProperty=${sortProperty}&sort=${sort}&status=${status}`,
  });

export const getBudgetItem = (itemId) =>
  http({
    url: `/budget/${itemId}`,
  });

// data = {
//   "transactionName": "string",
//   "description": "string",
//   "amount": 0
// }
export const postTransactionBudget = (taskId, data) =>
  http({
    url: `/budget/${taskId}/transaction-request`,
    method: "post",
    data,
  });

export const updateBudgetTransaction = ({
  transactionId,
  status,
  rejectNote,
}) =>
  http({
    url: `/budget/update-status-transaction/${transactionId}?status=${status}`,
    method: "put",
    data: { rejectNote },
  });

export const getTransactionBudgetEvidence = (transactionId) =>
  http({
    url: `/budget/${transactionId}/evidence`,
  });

export const postTransactionBudgetEvidence = (transactionId, formData) =>
  http({
    url: `/budget/${transactionId}/evidence`,
    method: "post",
    data: formData,
  });
