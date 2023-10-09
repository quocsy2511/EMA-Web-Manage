import axios from "axios";
import { authRequest } from "../utils/axios-utils";

export const createEvent = (event) =>
  authRequest({
    url: "/event",
    method: "post",
    data: event,
  });

export const getAllEvent = ({ pageSize, currentPage }) =>
  authRequest({
    url: `/event?sizePage=${pageSize}&currentPage=${currentPage}`,
  });

export const getDetailEvent = (eventId) =>
  authRequest({ url: `/event/${eventId}` });

export const updateDetailEvent = ({ eventId, ...event }) =>
  authRequest({ url: `/event/${eventId}`, method: "put", data: event });

export const updateStatusEvent = (eventId, status) =>
  authRequest({ url: `/event/${eventId}/${status}`, method: "put" });
