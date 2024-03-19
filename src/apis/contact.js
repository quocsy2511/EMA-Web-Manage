import http from "../utils/axios-utils";

export const getCustomerContacts = ({ currentPage, sort, status, sizePage }) =>
  http({
    url: `/customer-contacts/info?sizePage=${sizePage}&currentPage=${currentPage}&sortProperty=createdAt&sort=${sort}&status=${status}`,
    method: "get",
  });

export const updateCustomerContacts = ({ contactId, status, rejectNote }) =>
  http({
    url: `/customer-contacts/${contactId}/status?status=${status}`,
    method: "put",
    data: { rejectNote: rejectNote ? rejectNote : undefined },
  });

export const getCustomerContactDetail = (id) =>
  http({
    url: `/customer-contacts/${id}`,
    method: "get",
  });
