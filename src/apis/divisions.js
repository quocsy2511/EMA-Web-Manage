import { authRequest } from "../utils/axios-utils";

export const getAllDivision = ({ pageSize, currentPage }) =>
  authRequest({
    url: `/division?sizePage=${pageSize}&currentPage=${currentPage}`,
  });

export const createDivision = ({ divisionName, description }) =>
  authRequest({
    url: `/division`,
    method: "post",
    data: {
      divisionName,
      description,
    },
  });

export const updateStatusDivision = ({ divisionId }) =>
  authRequest({ url: `/division/${divisionId}/status`, method: "put" });

export const updateDivision = ({
  divisionId,
  divisionName,
  description,
  status,
}) =>
  authRequest({
    url: `/division/${divisionId}`,
    method: "put",
    data: {
      divisionName,
      description,
      status,
    },
  });
