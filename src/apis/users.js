import axios from "axios";
import { URL, token } from "../constants/api";
import { authRequest } from "../utils/axios-utils";

export const getAllUser = ({ divisionId, pageSize, currentPage }) =>
  authRequest({
    url: `/user?sizePage=${pageSize}&currentPage=${currentPage}${
      divisionId ? `&divisionId=${divisionId}` : ""
    }`,
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
