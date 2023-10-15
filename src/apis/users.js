import { authRequest } from "../utils/axios-utils";

// Check data if 'no user found'
export const getAllUser = ({ divisionId, role, pageSize, currentPage }) =>
  authRequest({
    url: `/user?sizePage=${pageSize}&currentPage=${currentPage}${
      divisionId ? `&divisionId=${divisionId}` : ""
    }${role ? `&role=${role}` : ""}`,
  });

export const getProfile = () => authRequest({ url: "/user/profile" });

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

export const updateUser = ({ userId, ...user }) =>
  authRequest({ url: `/user/${userId}`, method: "put", data: user });

export const getMember = ({ userId }) =>
  authRequest({ url: `/user/${userId}` });
