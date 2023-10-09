import axios from "axios";
import { authRequest } from "../utils/axios-utils";

export const getAllUser = ({ divisionId, pageSize, currentPage }) =>
  authRequest({
    url: `/user?sizePage=${pageSize}&currentPage=${currentPage}${
      divisionId ? `&divisionId=${divisionId}` : ""
    }`,
  });

export const createUser = (user) =>
  authRequest({
    url: `/auth/sign-up`,
    method: "post",
    data: user,
  });

  // status = ACTIVE or INACTIVE
export const updateStatusUser = ({ userId, status }) =>
  authRequest({
    url: `/user/${userId}/${status}`,
    method: "put",
  });

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
