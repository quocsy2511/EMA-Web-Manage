import axios from "axios";
import { authRequest } from "../utils/axios-utils";

// assignee = [id1, id2, ...]
// leader = id của người đc chọn trong assignee
// parentTask = id của task lớn
// ( optional = undefined )


export const createTask = (task) =>
  authRequest({
    url: "/task/createTask",
    method: "post",
    data: {
      parentTask: parentTask ?? undefined,
      assignee: assignee ?? [],
      leader: leader ?? undefined,
      fileUrl: fileUrl ?? undefined,
      ...task,
    },
  });

export const getTasks = ({ fieldName, conValue }) =>
  authRequest({ url: `task?fieldName=${fieldName}&conValue=${conValue}` });
