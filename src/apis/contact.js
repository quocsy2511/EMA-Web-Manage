import { authRequest } from "../utils/axios-utils";

export const getCustomerContacts = ({ currentPage, sort, status }) =>
  authRequest({
    url: `/customer-contacts/info?sizePage=10&currentPage=${currentPage}&sortProperty=createdAt&sort=${sort}&status=${status}`,
    method: "get",
  });

export const updateCustomerContacts = ({ contactId, status, rejectNote }) =>
  authRequest({
    url: `/customer-contacts/${contactId}/status?status=${status}`,
    method: "put",
    data: rejectNote ? rejectNote : undefined,
  });
