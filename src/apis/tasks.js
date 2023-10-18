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
      title: task.title,
      eventID: task.eventID,
      startDate: task.startDate,
      endDate: task.endDate,
      desc: task.desc,
      priority: task.priority,
      estimationTime: task.estimationTime,
      assignee: task.assignee,
      leader: task.leader ?? "",

      parentTask: task.parentTask ?? undefined,
      fileUrl: task.fileUrl ?? undefined,
    },
  });

// "id": "5b78df90-94b5-4be9-ab64-347cb16039b1",
// "createdAt": "2023-10-09T22:34:03.311Z",
// "updatedAt": "2023-10-09T22:34:03.311Z",
// "title": "Tassk lon 3",
// "startDate": "2023-10-10T05:28:42.000Z",
// "endDate": "2023-10-10T05:28:42.000Z",
// "description": "string",
// "priority": "HIGH",
// "parentTask": null,
// "status": "PENDING",
// "estimationTime": 2,
// "effort": 1,
// "createdBy": "b88ec35c-7d4a-45df-b500-7ecc16eaa4ba",
// "modifiedBy": null,
// "approvedBy": null,
// "eventID": "4a5ae4c6-47af-454b-b69b-ccee2a0ea447",
export const getTasks = ({ fieldName, conValue, pageSize, currentPage }) =>
  authRequest({
    url: `/task?fieldName=${fieldName}&conValue=${conValue}&sizePage=${pageSize}&currentPage=${currentPage}`,
  });

export const filterTask = ({ assignee, eventID, priority, sort, status }) =>
  authRequest({
    url: `/task/filterByAssignee?${eventID ? `eventID=${eventID}` : ""}${
      assignee ? `&assignee=${assignee}` : ""
    }${priority ? `&priority=${priority}` : ""}${sort ? `&sort=${sort}` : ""}${
      status ? `&status=${status}` : ""
    }
    `,
  });

// "title": "",
// "eventID": null,
// "startDate": null,
// "endDate": null,
// "description": null,
// "priority": "LOW",
// "parentTask": null,
// "estimationTime": null,
// "effort": null
export const updateTask = ({ taskID, ...task }) =>
  authRequest({
    url: `/task/updateTask?taskID=${taskID}`,
    method: "put",
    data: task,
  });

export const updateTaskStatus = ({ taskID, status }) =>
  authRequest({
    url: `/task/updateTaskStatus?taskID=${taskID}&status=${status}`,
    method: "put",
  });
