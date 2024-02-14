import http from "../utils/axios-utils";

/*

    const formData = new FormData();
    formData.append("file", info.file);         => info.file = File()
    formData.append("folderName", "avatar");    => Select folder : avatar - comment - event - task

*/
export const uploadFile = (formData) =>
  http({
    url: `/file/upload`,
    method: "post",
    data: formData,
  });

export const uploadFileTask = (data) =>
  http({
    url: `/taskFile`,
    method: "post",
    data: data,
  });

export const deleteFileTask = ({ taskId, data }) =>
  http({
    url: `/taskFile/${taskId}`,
    method: "put",
    data: data,
  });
