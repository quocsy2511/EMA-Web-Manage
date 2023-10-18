import { authRequest } from "../utils/axios-utils";

// mode: 1 -> get all division ( contain staff & employee )
// mode: 2 -> get division dont have staff
export const getAllDivision = ({ pageSize, currentPage, mode }) =>
  authRequest({
    url: `/division?sizePage=${pageSize}&currentPage=${currentPage}&mode=${mode}`,
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

export const updateStatusDivision = (divisionId) =>
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
