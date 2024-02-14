import http from "../utils/axios-utils";

export const createContract = ({ eventId, contract }) =>
  http({
    url: `/contracts/${eventId}/new`,
    method: "post",
    data: contract,
  });
