import http from "../utils/axios-utils";

export const login = ({ email, password }) =>
  http({
    url: "/auth/login",
    method: "post",
    data: { email, password },
  });
