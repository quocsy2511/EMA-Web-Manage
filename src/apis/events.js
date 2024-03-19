import http from "../utils/axios-utils";

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
  listTask,
  listDivision,

  contactId,
}) =>
  http({
    url: `/event?contactId=${contactId}`,
    method: "post",
    data: {
      // Event payload
      eventName,
      description,
      startDate,
      processingDate,
      endDate,
      location,
      coverUrl,
      estBudget,
      eventTypeId,
      listTask,
      listDivision,
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
  http({
    url: `/event/filter?sizePage=${pageSize}&currentPage=${currentPage}&nameSort=${nameSort}${
      eventName ? `&eventName=${eventName}` : ""
    }${monthYear ? `&monthYear=${monthYear}` : ""}${
      sort ? `&sort=${sort}` : ""
    }${status ? `&status=${status}` : ""}`,
  });

export const getDetailEvent = (eventId) => http({ url: `/event/${eventId}` });

// mode = 1: assign , 2: delete
export const updateDetailEvent = ({ eventId, ...event }) =>
  http({ url: `/event/${eventId}`, method: "put", data: event });

export const updateAssignDivisionToEvent = ({ eventId, divisionId }) =>
  http({
    url: "/event/edit-division",
    method: "put",
    data: { eventId, divisionId },
  });

export const updateStatusEvent = (eventId, status) =>
  http({ url: `/event/${eventId}/${status}`, method: "put" });

export const getEventDivisions = () =>
  http({
    url: `/event/division`,
  });

export const getEventDetail = ({ eventId }) =>
  http({
    url: `/event/${eventId}`,
  });

export const getEventTemplate = () => http({ url: "/event/template-event" });

export const getTemplateEvent = () => http({ url: "/event/template-event" });

export const getStatistic = ({ type }) =>
  http({ url: `/event/statistic?mode=${type}` });

export const getEventParticipant = (eventId) =>
  http({ url: `/event?eventId=${eventId}` });

export const getEventType = () => http({ url: "/event-types" });
