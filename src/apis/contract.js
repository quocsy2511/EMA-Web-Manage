import http from "../utils/axios-utils";

export const createContract = ({ eventId, contract }) =>
  http({
    url: `/contracts/${eventId}/new`,
    method: "post",
    data: contract,
  });

export const getContract = (eventId) => http({ url: `/contracts/${eventId}` });

export const getContractEvidence = (contractId) =>
  http({ url: `/contracts/${contractId}/evidence` });

export const postContractEvidence = (contractId, formData) =>
  http({
    url: `/contracts/${contractId}/evidence`,
    method: "post",
    data: formData,
  });

export const createContractToCustomer = ({ customerContactId, contract }) =>
  http({
    url: `/contracts/${customerContactId}/new`,
    method: "post",
    data: contract,
  });

export const getAllContract = ({ sizePage, currentPage, sort, status }) =>
  http({
    url: `/contracts?sizePage=${sizePage}&currentPage=${currentPage}&sortProperty=createdAt&sort=${sort}&status=${status}`,
  });

export const getContractFile = () =>
  http({
    url: `/contracts/file`,
  });

export const getContractInfoByContact = (customerContactId) =>
  http({ url: `/contracts/file/${customerContactId}` });
