import http from "../utils/axios-utils";

// mode: 1 -> get all division ( contain staff & employee )
// mode: 2 -> get division dont have staff
export const getAllDivision = ({ pageSize, currentPage, mode }) =>
  http({
    url: `/division?sizePage=${pageSize}&currentPage=${currentPage}&mode=${mode}`,
  });

export const createDivision = ({ divisionName, description }) =>
  http({
    url: `/division`,
    method: "post",
    data: {
      divisionName,
      description,
    },
  });

export const updateStatusDivision = (divisionId) =>
  http({ url: `/division/${divisionId}/status`, method: "put" });

export const updateDivision = ({
  divisionId,
  divisionName,
  description,
  status,
}) =>
  http({
    url: `/division/${divisionId}`,
    method: "put",
    data: {
      divisionName,
      description,
      status,
    },
  });

export const getDivisionByStaff = (fieldName, conValue) =>
  http({
    url: `/division/list/user?fieldName=${fieldName}&conValue=${conValue}`,
  });

export const getDivisionFreeUser = (fieldName, conValue, startDate, endDate) =>
  http({
    url: `/division/list/assignee/employee?fieldName=${fieldName}&conValue=${conValue}&startDate=${startDate}&endDate=${endDate}`,
  });

export const getFreeDivision = (eventID, startDate, endDate) =>
  http({
    url: `/division/list/assignee/division?eventID=${eventID}&startDate=${startDate}&endDate=${endDate}`,
  });

export const getDivisionDetail = (divisionId) =>
  http({ url: `/division/${divisionId}` });
