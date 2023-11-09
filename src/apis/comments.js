import { authRequest } from "../utils/axios-utils";

export const getComment = (taskId) =>
  authRequest({ url: `/comment/${taskId}` });

// taskID : require
// content : require
// fileUrl : optional
export const postComment = (comment) =>
  authRequest({ url: `/comment`, method: "post", data: comment });

export const removeComment = (commentId) =>
  authRequest({ url: `/comment/${commentId}`, method: "delete" });

export const updateComment = ({ commentId, ...comment }) =>
  authRequest({
    url: `/comment/${commentId}`,
    method: "put",
    data: { content: comment.content, file: comment.file },
  });

export const createCommentFile = (commentId, files) =>
  authRequest({ url: `/commentfile/${commentId}`, method: "put", data: files });
