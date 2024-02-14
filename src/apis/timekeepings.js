import http from "../utils/axios-utils";

export const getTimekeeping = ({ eventId, startDate, endDate, me }) =>
  http({
    url: `/timesheet?eventId=${eventId}&startDate=${startDate}&endDate=${endDate}&me=${me}`,
  });
