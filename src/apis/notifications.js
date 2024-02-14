import http from "../utils/axios-utils";

export const getAllNotification = (pageSize) =>
  http({ url: `/notification?sizePage=${pageSize}&currentPage=1` });

export const seenNotification = (notificationId) =>
  http({
    url: `/notification/seen?notificationId=${notificationId}`,
    method: "put",
  });

export const seenAllNotification = () =>
  http({ url: "/notification/seen-all", method: "put" });
