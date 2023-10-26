import { authRequest } from "../utils/axios-utils";

export const getListBudget = ({ eventID, pageSize, currentPage }) =>
  authRequest({
    url: `/budget/${eventID}?&sizePage=${pageSize}&currentPage=${currentPage}`,
  });
