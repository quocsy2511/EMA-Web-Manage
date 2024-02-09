import { authRequest } from "../utils/axios-utils";

export const createContract = ({ eventId, contract }) =>
  authRequest({
    url: `/contracts/${eventId}/new`,
    method: "post",
    data: contract,
  });
