import React, { memo } from "react";
import { Modal, Timeline, Tooltip } from "antd";
import momenttz from "moment-timezone";
import { IoMdTime } from "react-icons/io";
import { FaCrown } from "react-icons/fa6";
import clsx from "clsx";

const AssignmentHistoryModal = ({
  isModalOpen,
  setIsModalOpen,
  assignTasks,
}) => {
  const renderTimeline = assignTasks;

  return (
    <Modal
      title={<p className="text-center text-3xl">Lịch sử giao việc</p>}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      centered
      //   width={"50%"}
      footer={null}
      //   className="flex justify-center items-center"
    >
      <div className=" h-full mt-8">
        <Timeline
          // mode="alternate"
          // items={renderTimeline?.map((item) => ({
          //   label: <p className="text-base mr-5">{item?.label}</p>,
          //   children: item?.contentList?.map((subItem) => (
          //     <div className="flex items-center space-x-3">
          //       <p
          //         className={clsx("text-base ml-3 font-medium", {
          //           "line-through text-slate-300 font-normal":
          //             !subItem?.status === "inactive",
          //         })}
          //       >
          //         {subItem?.user?.profile?.fullName}
          //       </p>
          //       {subItem?.isLeader && subItem?.status === "active" && (
          //         <Tooltip title="Leader">
          //           <FaCrown className="text-base text-orange-400" />
          //         </Tooltip>
          //       )}
          //     </div>
          //   )),
          //   dot: <IoMdTime className="text-xl" />,
          // }))}
          mode="left"
          items={renderTimeline?.map((item) => ({
            children: (
              <div className="flex items-center space-x-3">
                <p
                  className={clsx("text-base ml-3 font-medium", {
                    "line-through text-slate-400 font-normal":
                      item?.status === "inactive",
                  })}
                >
                  {item?.user?.profile?.fullName}
                </p>
                {item?.isLeader && item?.status === "active" && (
                  <Tooltip title="Leader">
                    <FaCrown className="text-base text-orange-400" />
                  </Tooltip>
                )}
              </div>
            ),
            dot: <IoMdTime className="text-2xl" />,
          }))}
        />
      </div>
    </Modal>
  );
};

export default memo(AssignmentHistoryModal);
