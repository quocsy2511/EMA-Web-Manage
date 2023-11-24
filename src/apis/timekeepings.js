import { authRequest } from "../utils/axios-utils";

export const getTimekeeping = ({ eventId, startDate, endDate, me }) =>
  authRequest({
    url: `/timesheet?eventId=${eventId}&startDate=${startDate}&endDate=${endDate}&me=${me}`,
  });
