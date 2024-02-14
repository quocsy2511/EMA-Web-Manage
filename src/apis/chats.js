import http from "../utils/axios-utils";

// Create a new 1-1 conversation
export const createConversation = ({ email, message }) =>
  http({ url: "/conversations", method: "post", data: { email, message } });

export const getConversations = () => http({ url: "/conversations" });

// Create a message while chatting
export const createMessage = (id, content) =>
  http({
    url: `/conversations/${id}/messages`,
    method: "post",
    data: content,
  });

// Get a conversation detail containing all messages
export const getConversation = (id) =>
  http({ url: `/conversations/${id}/messages` });

// Update a message
export const modifyMessage = (id, messageId, content) =>
  http({
    url: `/conversations/${id}/messages/${messageId}`,
    method: "put",
    data: content,
  });
