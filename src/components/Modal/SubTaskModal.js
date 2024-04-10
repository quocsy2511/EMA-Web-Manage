import React from "react";
import { Avatar, Modal, Tooltip } from "antd";
import {
  AiOutlineTags,
  AiOutlineCheckCircle,
  AiOutlineCalendar,
} from "react-icons/ai";
import {
  HiOutlineUser,
  HiOutlineUserCircle,
  HiMiniArrowLongRight,
} from "react-icons/hi2";
import { IoMdAttach } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";
import CommentInTask from "../Comment/CommentInTask";
import { useQuery } from "@tanstack/react-query";
import { getComment } from "../../apis/comments";
import { AnimatePresence } from "framer-motion";
import { getUserById } from "../../apis/users";
import moment from "moment";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import LoadingComponentIndicator from "../Indicator/LoadingComponentIndicator";

const ItemLayout = ({ children }) => (
  <div className="flex items-center gap-x-5">{children}</div>
);
const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const SubTaskModal = ({
  isOpenModal,
  setIsOpenModal,
  selectedSubTask,
  resetTaskRedirect,
}) => {
  const assignUser = selectedSubTask?.assignTasks?.filter(
    (user) => user?.status === "active"
  );

  const {
    data: comments,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
  } = useQuery(
    ["comment", selectedSubTask?.id],
    () => getComment(selectedSubTask?.id),
    { enabled: !!selectedSubTask?.id }
  );

  const { data: assigner } = useQuery(
    ["user", selectedSubTask?.createdBy],
    () => getUserById(selectedSubTask?.createdBy),
    { enabled: !!selectedSubTask?.createdBy }
  );

  const handleCancel = () => {
    resetTaskRedirect();
    setIsOpenModal(false);
  };

  let priority, bgPriority;
  switch (selectedSubTask?.priority) {
    case "LOW":
      priority = "Thấp";
      bgPriority = "green";
      break;
    case "MEDIUM":
      priority = "Bình thường";
      bgPriority = "orange";
      break;
    case "HIGH":
      priority = "Cao";
      bgPriority = "red";
      break;

    default:
      priority = "--";
      break;
  }

  let status, bgStatus;
  switch (selectedSubTask?.status) {
    case "PENDING":
      status = "Đang chuẩn bị";
      bgStatus = "bg-gray-400";
      break;
    case "PROCESSING":
      status = "Đang thực hiện";
      bgStatus = "bg-blue-400";
      break;
    case "DONE":
      status = "Hoàn thành";
      bgStatus = "bg-green-500";
      break;
    case "CONFIRM":
      status = "Đã xác thực";
      bgStatus = "bg-purple-500";
      break;
    case "CANCEL":
      status = "Hủy bỏ";
      bgStatus = "bg-red-500";
      break;
    case "OVERDUE":
      status = "Quá hạn";
      bgStatus = "bg-orange-500";
      break;

    default:
      status = "Đang chuẩn bị";
      bgStatus = "bg-gray-400";
      break;
  }

  return (
    <Modal
      bodyStyle={{ height: "85vh" }}
      open={isOpenModal}
      onCancel={handleCancel}
      footer={null}
      centered
      width={"45%"}
    >
      <div className="max-h-full overflow-y-scroll no-scrollbar px-4">
        <div className="fixed w-[40%] h-[8%] bg-white flex items-center z-10 border-b border-slate-100">
          <p className="text-3xl font-semibold">{selectedSubTask?.title}</p>
        </div>

        <div className="mt-[12%]">
          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <AiOutlineTags size={22} />
              <p className="text-base text-slate-400">Độ ưu tiên</p>
            </div>
            <div
              className={`text-sm text-white text-center w-28 py-2 bg-${bgPriority}-500 rounded-full font-medium`}
            >
              {priority}
            </div>
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <AiOutlineCheckCircle size={22} />
              <p className="text-base text-slate-400">Trạng thái</p>
            </div>
            <div
              className={`text-sm text-white text-center px-5 py-2 ${bgStatus} rounded-full font-medium`}
            >
              {status}
            </div>
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <HiOutlineUser size={22} />
              <p className="text-base text-slate-400">Giao bởi</p>
            </div>
            <Avatar size={35} src={assigner?.avatar} />
            <p className="text-sm font-medium">{assigner?.fullName ?? ""}</p>
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <HiOutlineUserGroup size={22} />
              <p className="text-base text-slate-400">Tham gia</p>
            </div>
            <Avatar.Group maxCount={5} maxPopoverTrigger="hover">
              {assignUser?.length > 0 ? (
                assignUser?.map((item) => (
                  <div key={item?.userId}>
                    <Tooltip
                      title={item?.user?.profile?.fullName}
                      placement="top"
                    >
                      <Avatar size={35} src={item?.user?.profile?.avatar} />
                    </Tooltip>
                  </div>
                ))
              ) : (
                <p>Chưa phân việc</p>
              )}
            </Avatar.Group>
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <HiOutlineUserCircle size={22} />
              <p className="text-base text-slate-400">Chịu trách nhiệm</p>
            </div>

            {assignUser?.length > 0 &&
            assignUser?.find((item) => item.isLeader) ? (
              <>
                <Avatar
                  size={35}
                  src={
                    assignUser?.find((item) => item.isLeader)?.user?.profile
                      ?.avatar
                  }
                />
                <p className="text-sm font-medium">
                  {
                    assignUser?.find((item) => item.isLeader)?.user?.profile
                      ?.fullName
                  }
                </p>
              </>
            ) : (
              <p>Chưa phân việc</p>
            )}
          </ItemLayout>

          <div className="h-5" />

          <ItemLayout>
            <div className="w-[20%] flex items-center gap-x-2">
              <AiOutlineCalendar size={22} />
              <p className="text-base text-slate-400">Thời gian</p>
            </div>
            <p className="text-lg flex items-center gap-x-3">
              <span className="font-medium">
                {selectedSubTask?.startDate
                  ? moment(selectedSubTask?.startDate).format("DD-MM-YYYY")
                  : "-- : --"}
              </span>{" "}
              <HiMiniArrowLongRight className="text-lg" />
              <span className="font-medium">
                {selectedSubTask?.endDate
                  ? moment(selectedSubTask?.endDate).format("DD-MM-YYYY")
                  : "-- : --"}
              </span>{" "}
            </p>
          </ItemLayout>
        </div>

        <div className="w-full h-0.5 bg-slate-100 my-10" />

        <div className="space-y-5 text-black">
          <p className="text-lg font-medium">Tài liệu đính kèm</p>

          {selectedSubTask?.taskFiles.length > 0 ? (
            selectedSubTask?.taskFiles?.map((file) => (
              <div className="cursor-pointer group">
                <a
                  className="flex gap-x-3"
                  href={file?.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoMdAttach size={25} className="group-hover:text-blue-400" />
                  <p className="group-hover:text-blue-400 text-base">
                    {file?.fileName}
                  </p>
                </a>
              </div>
            ))
          ) : (
            <p className="text-base">Không có tệp tin</p>
          )}
        </div>

        <div className="w-full h-0.5 bg-slate-100 my-10" />

        <div className="space-y-5 text-black">
          <p className="text-lg font-medium">Mô tả</p>
          {selectedSubTask?.description ? (
            <div
              className="text-base"
              dangerouslySetInnerHTML={{
                __html: new QuillDeltaToHtmlConverter(
                  JSON.parse(
                    selectedSubTask?.description?.startsWith(`[{"`)
                      ? selectedSubTask?.description
                      : parseJson(selectedSubTask?.description)
                  )
                ).convert(),
              }}
            />
          ) : (
            <p>Không có mô tả</p>
          )}
        </div>

        <div className="w-full h-0.5 bg-slate-100 my-10" />

        <div className="pb-16">
          <AnimatePresence mode="wait">
            {!commentsIsLoading || !commentsIsError ? (
              comments ? (
                <div key="comments" className="mt-14">
                  <CommentInTask
                    comments={comments}
                    taskId={selectedSubTask?.id}
                  />
                </div>
              ) : (
                <p key="no-comment" className="text-center mt-10">
                  Không thể tải bình luận
                </p>
              )
            ) : (
              <LoadingComponentIndicator />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

export default SubTaskModal;
