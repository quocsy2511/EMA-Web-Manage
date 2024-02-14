import http from "../utils/axios-utils";

export const getComment = (taskId) => http({ url: `/comment/${taskId}` });

// taskID : require
// content : require
// fileUrl : optional
export const postComment = (comment) =>
  http({ url: `/comment`, method: "post", data: comment });

export const removeComment = (commentId) =>
  http({ url: `/comment/${commentId}`, method: "delete" });

export const updateComment = ({ commentId, ...comment }) =>
  http({
    url: `/comment/${commentId}`,
    method: "put",
    data: { content: comment.content, file: comment.file },
  });

export const createCommentFile = (commentId, files) =>
  http({ url: `/commentfile/${commentId}`, method: "put", data: files });
