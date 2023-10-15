import { authRequest } from "../utils/axios-utils";

/*

    const formData = new FormData();
    formData.append("file", info.file);         => infi.file = File()
    formData.append("folderName", "avatar");    => Select folder : avatar - comment - event - task

*/
export const uploadFile = (formData) =>
  authRequest({
    url: `/file/upload`,
    method: "post",
    data: formData,
  });