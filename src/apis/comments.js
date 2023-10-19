import axios from "axios";
import { authRequest } from "../utils/axios-utils";

export const getComment = (taskId) =>
  authRequest({ url: `/comment/${taskId}` });

// taskID : require
// content : require
// fileUrl : optional
export const postComment = (comment) =>
  authRequest({ url: `comment`, method: "post", data: comment });

export const removeComment = (commentId) =>
  authRequest({ url: `/comment/${commentId}`, method: "delete" });
