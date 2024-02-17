import http from "../utils/axios-utils";

// Create a new 1-1 conversation
export const createConversation = ({ email, message }) =>
  http({
    url: "/conversations",
    method: "post",
    data: { email, message: message ? message : undefined },
  });

export const getConversations = (currentPage) =>
  http({ url: `/conversations?sizePage=5&currentPage=${currentPage}` });

// Create a message while chatting
export const createMessage = (id, content) =>
  http({
    url: `/conversations/${id}/messages`,
    method: "post",
    data: { content: content },
  });

// Get a conversation detail containing all messages
export const getConversation = (id, currentPage) =>
  http({
    url: `/conversations/${id}/messages?sizePage=10&currentPage=${currentPage}`,
  });

// Update a message
export const modifyMessage = (id, messageId, content) =>
  http({
    url: `/conversations/${id}/messages/${messageId}`,
    method: "put",
    data: content,
  });
