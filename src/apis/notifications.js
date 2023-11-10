import { authRequest } from "../utils/axios-utils";

export const getAllNotification = () =>
  authRequest({ url: `/notification?sizePage=10&currentPage=1` });

export const seenNotification = (notificationId) =>
  authRequest({
    url: `/notification/seen?notificationId=${notificationId}`,
    method: "put",
  });

export const seenAllNotification = () =>
  authRequest({ url: "/notification/seen-all", method: "put" });
