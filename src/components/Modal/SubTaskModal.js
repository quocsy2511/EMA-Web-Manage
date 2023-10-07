import React from "react";
import { Avatar, Modal } from "antd";
import {
  AiOutlineTags,
  AiOutlineCheckCircle,
  AiOutlineCalendar,
} from "react-icons/ai";
import { HiOutlineUser, HiOutlineUserCircle } from "react-icons/hi2";
import { IoMdAttach } from "react-icons/io";
import CommentInTask from "../Comment/CommentInTask";

const ItemLayout = ({ children }) => (
  <div className="flex items-center gap-x-5">{children}</div>
);

const SubTaskModal = ({ isOpenModal, setIsOpenModal, selectedSubTask }) => {
  console.log(selectedSubTask);

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  return (
    <Modal
      // className="max-h-[80%] overflow-y-scroll no-scrollbar"
      bodyStyle={{ height: "85vh" }}
      open={isOpenModal}
      onCancel={handleCancel}
      footer={null}
      centered
      width={"50%"}
    >
      <div className="max-h-full overflow-y-scroll no-scrollbar px-4">
        <div className="fixed w-[40%] h-[8%] bg-white flex items-center z-10">
          <p className="text-3xl font-semibold">Làm think</p>
        </div>

        <div className="mt-[12%]">
          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <AiOutlineTags size={22} />
              <p className="text-base text-slate-400">Độ ưu tiên</p>
            </div>
            <div className="text-sm text-white text-center w-28 py-2 bg-red-400 rounded-full">
              High
            </div>
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <AiOutlineCheckCircle size={22} />
              <p className="text-base text-slate-400">Trạng thái</p>
            </div>
            <div className="text-sm text-white text-center w-28 py-2 bg-green-500 rounded-full">
              High
            </div>
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <HiOutlineUser size={22} />
              <p className="text-base text-slate-400">Giao bởi</p>
            </div>
            <Avatar
              size={35}
              src="https://www.nzherald.co.nz/resizer/ZtHwJaBvLJzm_Vh-XzeuGC5e3kQ=/1200x675/smart/filters:quality(70)/cloudfront-ap-southeast-2.images.arcpublishing.com/nzme/ER7PF2VBUBCWESSXLNA43RLHFI.jpg"
            />
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <HiOutlineUserCircle size={22} />
              <p className="text-base text-slate-400">Chịu trách nhiệm</p>
            </div>
            <Avatar
              size={35}
              src="https://www.nzherald.co.nz/resizer/ZtHwJaBvLJzm_Vh-XzeuGC5e3kQ=/1200x675/smart/filters:quality(70)/cloudfront-ap-southeast-2.images.arcpublishing.com/nzme/ER7PF2VBUBCWESSXLNA43RLHFI.jpg"
            />
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <AiOutlineCalendar size={22} />
              <p className="text-base text-slate-400">Thời gian</p>
            </div>
            <p className="text-base">
              <span className="font-medium">Từ</span> 12/02/2023{" "}
              <span className="font-medium">Đến</span> 12/02/2023
            </p>
          </ItemLayout>
        </div>

        <div className="w-full h-0.5 bg-slate-100 my-10" />

        <div className="space-y-5 text-black">
          <p className="text-lg font-medium">Tài liệu đính kèm</p>

          <div className="flex gap-x-3">
            <IoMdAttach size={25} />
            <p className="text-base">Link</p>
          </div>
        </div>

        <div className="w-full h-0.5 bg-slate-100 my-10" />

        <div className="space-y-5 text-black">
          <p className="text-lg font-medium">Mô tả</p>

          <p className="text-base">
            aaaâ akl aksl maksl maks makslm klám klmá klmakslm aklm
          </p>
        </div>

        <div className="w-full h-0.5 bg-slate-100 my-10" />

        <div>
          <CommentInTask isSubtask={true} />
        </div>
      </div>
    </Modal>
  );
};

export default SubTaskModal;
