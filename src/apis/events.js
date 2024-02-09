import { authRequest } from "../utils/axios-utils";

export const createEvent = ({
  eventName,
  description,
  startDate,
  processingDate,
  endDate,
  location,
  coverUrl,
  estBudget,
  eventTypeId,
}) =>
  authRequest({
    url: "/event",
    method: "post",
    data: {
      eventName,
      description,
      startDate,
      processingDate,
      endDate,
      location,
      coverUrl,
      estBudget,
      eventTypeId,
    },
  });

// status: PENDING - PROCESSING - DONE - CANCEL
// nameSort: startDate - endDate - updatedAt - createdAt
export const getFilterEvent = ({
  pageSize,
  currentPage,
  nameSort,
  eventName,
  monthYear,
  sort,
  status,
}) =>
  authRequest({
    url: `/event/filter?sizePage=${pageSize}&currentPage=${currentPage}&nameSort=${nameSort}${
      eventName ? `&eventName=${eventName}` : ""
    }${monthYear ? `&monthYear=${monthYear}` : ""}${
      sort ? `&sort=${sort}` : ""
    }${status ? `&status=${status}` : ""}`,
  });

export const getDetailEvent = (eventId) =>
  authRequest({ url: `/event/${eventId}` });

// mode = 1: assign , 2: delete
export const updateDetailEvent = ({ eventId, ...event }) =>
  authRequest({ url: `/event/${eventId}`, method: "put", data: event });

export const updateAssignDivisionToEvent = (data) =>
  authRequest({
    url: "/event/edit-division",
    method: "put",
    data,
  });

export const updateStatusEvent = (eventId, status) =>
  authRequest({ url: `/event/${eventId}/${status}`, method: "put" });

export const getEventDivisions = () =>
  authRequest({
    url: `/event/division`,
  });

export const getEventDetail = ({ eventId }) =>
  authRequest({
    url: `/event/${eventId}`,
  });

export const getEventTemplate = () =>
  authRequest({ url: "/event/template-event" });

export const getTemplateEvent = () =>
  authRequest({ url: "/event/template-event" });

export const getStatistic = ({ type }) =>
  authRequest({ url: `/event/statistic?mode=${type}` });

export const getEventParticipant = (eventId) =>
  authRequest({ url: `/event?eventId=${eventId}` });

export const getEventType = () => authRequest({ url: "/event-types" });
