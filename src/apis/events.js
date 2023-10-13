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
