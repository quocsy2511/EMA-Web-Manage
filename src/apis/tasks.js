import http from "../utils/axios-utils";

// assignee = [id1, id2, ...]
// leader = id của người đc chọn trong assignee
// parentTask = id của task lớn
// ( optional = undefined )

export const createTask = (task) =>
  http({
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
      
      itemId: task.itemId,
      // Subtask only
      parentTask: task.parentTask ?? undefined,
      file: task.file ?? undefined,
    },
  });

export const getTasks = ({ fieldName, conValue, pageSize, currentPage }) =>
  http({
    url: `/task?fieldName=${fieldName}&conValue=${conValue}&sizePage=${pageSize}&currentPage=${currentPage}`,
  });

export const filterTask = ({ assignee, eventID, priority, sort, status }) =>
  http({
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
  http({
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
  http({
    url: `/task/updateTaskStatus?taskID=${taskID}&status=${status}`,
    method: "put",
  });

export const assignMember = ({ taskID, assignee, leader }) =>
  http({
    url: "/assign-task",
    method: "post",
    data: {
      taskID: taskID,
      assignee: assignee ?? [],
      leader: leader ?? "",
    },
  });

export const createTaskFile = (taskFile) =>
  http({
    url: "/taskFile",
    method: "post",
    data: {
      taskID: taskFile.taskID,
      fileName: taskFile.fileName,
      fileUrl: taskFile.fileUrl,
    },
  });

export const updateTaskFile = ({ taskId, ...files }) =>
  http({
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
  http({
    url: `/task/template-task?fieldName=${fieldName}&conValue=${conValue}&sizePage=${sizePage}&currentPage=${currentPage}`,
  });

export const getTemplateTask = (templateEventID) =>
  http({
    url: `/task/template-task?fieldName=eventID&conValue=${templateEventID}&sizePage=5&currentPage=1`,
  });

export const getTaskFilterByDate = ({ userId, date, dateEnd }) =>
  http({
    url: `/task/filterByDate?userId=${userId}&date=${date}&dateEnd=${dateEnd}`,
  });

export const getListAssigneeEmployee = ({
  fieldName,
  userId,
  dateStart,
  dateEnd,
}) =>
  http({
    url: `/division/list/assignee/employee?fieldName=${fieldName}&conValue=${userId}&startDate=${dateStart}&endDate=${dateEnd}`,
  });
export const createTaskTemplate = (task) =>
  http({
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
      isTemplate: task.isTemplate,
    },
  });
