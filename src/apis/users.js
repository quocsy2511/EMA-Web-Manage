import http from "../utils/axios-utils";

// Check data if 'no user found'
export const getAllUser = ({ divisionId, role, pageSize, currentPage }) =>
  http({
    url: `/user?sizePage=${pageSize}&currentPage=${currentPage}${
      divisionId ? `&divisionId=${divisionId}` : ""
    }${role ? `&role=${role}` : ""}`,
  });

export const getUserById = (userId) => http({ url: `/user/${userId}` });

export const getProfile = () => http({ url: "/user/profile" });

export const createUser = (user) =>
  http({
    url: `/auth/sign-up`,
    method: "post",
    data: user,
  });

// status = ACTIVE or INACTIVE
export const updateStatusUser = ({ userId, status }) =>
  http({
    url: `/user/${userId}/${status}`,
    method: "put",
  });

export const updateUser = ({ userId, ...user }) =>
  http({ url: `/user/${userId}`, method: "put", data: user });

export const getMember = ({ userId }) => http({ url: `/user/${userId}` });

export const updateProfile = (user) =>
  http({ url: `/user/profile`, method: "put", data: user });

export const getEmployeeByDate = ({ startDate, endDate }) =>
  http({ url: `/user/getFreeEmployee/${startDate}/${endDate}` });

export const getRoles = () => http({ url: "/roles" });
