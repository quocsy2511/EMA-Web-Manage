import React from "react";
import { IoMdAttach } from "react-icons/io";

const ListFile = ({ file }) => {
  return (
    <a
      href={file.fileUrl}
      className="text-ellipsis max-w-full overflow-hidden flex mt-2 text-green-500"
    >
      <IoMdAttach className="cursor-pointer" size={20} />
      {file.fileName}
    </a>
  );
};

export default ListFile;
