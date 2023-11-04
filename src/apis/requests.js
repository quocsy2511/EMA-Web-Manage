import { authRequest } from "../utils/axios-utils";

export const getAllRequests = ({
  curentPage,
  pageSize,
  requestor,
  createdAt,
  status,
  type,
}) =>
  authRequest({
    url: `/request/filterRequest/${curentPage}/${pageSize}?${
      requestor ? `requestor=${requestor}` : ""
    }${createdAt ? `&requestor=${requestor}` : ""}${
      status ? `&status=${status}` : ""
    }${type ? `&type=${type}` : ""}`,
  });

export const getRequestDetail = (id) =>
  authRequest({ url: `/request/detail/${id}` });

export const createRequest = (request) =>
  authRequest({
    url: "/request",
    method: "post",
    data: {
      title: request.title,
      content: request.content,
      startDate: request.startDate,
      endDate: request.endDate,
      isFull: request.isFull,
      isPM: request.isPM,
      type: request.type,
    },
  });

export const approveRequest = (request) =>
  authRequest({
    url: "/request/approveRequest",
    method: "put",
    data: {
      requestID: request.requestID,
      replyMessage: request.replyMessage,
      status: request.status,
    },
  });

export const updateRequest = ({ id, ...request }) =>
  authRequest({
    url: `/request/changeRequest/${id}`,
    method: "put",
    data: {
      title: request.title,
      content: request.content,
      startDate: request.startDate,
      endDate: request.endDate,
      isFull: request.isFull,
      isPM: request.isPM,
      type: request.type,
    },
  });

export const deleteRequest = (id) =>
  authRequest({
    url: `/request/changeRequest/${id}`,
    method: "delete",
  });
