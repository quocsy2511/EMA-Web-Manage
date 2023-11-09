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
      leader: task.leader,

      // Subtask only
      parentTask: task.parentTask ?? undefined,
      file: task.file ?? undefined,
    },
  });

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
    data: {
      title: task.title,
      eventID: task.eventID,
      startDate: task.startDate,
      endDate: task.endDate,
      description: task.description,
      priority: task.priority,
      parentTask: task.parentTask,
      estimationTime: task.estimationTime,
      effort: task.effort,
    },
  });

export const updateTaskStatus = ({ taskID, status }) =>
  authRequest({
    url: `/task/updateTaskStatus?taskID=${taskID}&status=${status}`,
    method: "put",
  });

export const assignMember = (data) =>
  authRequest({
    url: "/assign-task",
    method: "post",
    data: {
      taskID: data.taskID,
      assignee: data.assignee,
      leader: data.leader ?? "",
    },
  });

export const createTaskFile = (taskFile) =>
  authRequest({
    url: "/taskFile",
    method: "post",
    data: {
      taskID: taskFile.taskID,
      fileName: taskFile.fileName,
      fileUrl: taskFile.fileUrl,
    },
  });

export const updateTaskFile = ({ taskId, ...files }) =>
  authRequest({
    url: `/taskFile/${taskId}`,
    method: "put",
    data: files.files,
  });

export const getTasksTemplate = ({
  fieldName,
  conValue,
  sizePage,
  currentPage,
}) =>
  authRequest({
    url: `/task/template-task?fieldName=${fieldName}&conValue=${conValue}&sizePage=${sizePage}&currentPage=${currentPage}`,
  });
