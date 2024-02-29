import http from "../utils/axios-utils";

export const createContract = ({ eventId, contract }) =>
  http({
    url: `/contracts/${eventId}/new`,
    method: "post",
    data: contract,
  });

export const getContract = (eventId) => http({ url: `/contracts/${eventId}` });

export const getContractEvidence = (contractId) => http({ url: `/contracts/${contractId}/evidence` });
