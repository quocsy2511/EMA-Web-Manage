import http from "../utils/axios-utils";

export const getAllRequests = ({
  curentPage,
  pageSize,
  requestor,
  requestorName,
  createdAt,
  status,
  type,
}) =>
  http({
    url: `/request/filterRequest/${curentPage}/${pageSize}?${
      requestor ? `requestor=${requestor}` : ""
    }${requestorName ? `&requestorName=${requestorName}` : ""}${
      createdAt ? `&createdAt=${createdAt}` : ""
    }${status ? `&status=${status}` : ""}${type ? `&type=${type}` : ""}`,
  });

export const getRequestDetail = (id) => http({ url: `/request/detail/${id}` });

export const createRequest = (request) =>
  http({
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
  http({
    url: "/request/approveRequest",
    method: "put",
    data: {
      requestID: request.requestID,
      replyMessage: request.replyMessage,
      status: request.status,
    },
  });

export const updateRequest = ({ id, ...request }) =>
  http({
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
  http({
    url: `/request/changeRequest/${id}`,
    method: "delete",
  });
export const getAnnualLeave = () =>
  http({
    url: `/annual-leave`,
  });
