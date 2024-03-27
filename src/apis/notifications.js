import http from "../utils/axios-utils";

export const getAllNotification = (pageSize, currentPage, type) =>
  http({
    url: `/notification?sizePage=${pageSize}&currentPage=${currentPage}&type=${type}`,
  });

export const seenNotification = (notificationId) =>
  http({
    url: `/notification/seen?notificationId=${notificationId}`,
    method: "put",
  });

export const seenAllNotification = () =>
  http({ url: "/notification/seen-all", method: "put" });
