import {
  Avatar,
  Dropdown,
  Empty,
  Modal,
  Progress,
  Spin,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import {
  BarsOutlined,
  BranchesOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  DollarOutlined,
  DoubleRightOutlined,
  ExclamationCircleFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import AvatarDefault from "../../../assets/images/avatar2.webp";
import NewBudget from "./ModalBudget/NewBudget";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../apis/tasks";

const BudgetStaff = ({ selectEvent, listTaskParents, setIsBoardTask }) => {
  // console.log("🚀 ~ BudgetStaff ~ listTaskParents:", listTaskParents);
  const [isOpenBudgetModal, setIsOpenBudgetModal] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState(
    listTaskParents?.[0].id
  );
  const { confirm } = Modal;
  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá ngân sách này?",
      icon: <ExclamationCircleFilled />,
      content:
        "Bạn vui lòng chời người quản lý sẽ xem xét với yêu cầu xoá ngân sách của bạn",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const budgetItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center space-x-2">
          <BranchesOutlined size={20} />
          <p className="text-sm">Chỉnh sửa ngân sách </p>
        </div>
      ),
    },

    {
      key: "2",
      danger: true,
      label: (
        <div
          className="flex items-center space-x-2"
          onClick={showDeleteConfirm}
        >
          <DeleteOutlined size={20} />
          <p className="text-sm">Xoá ngân sách </p>
        </div>
      ),
    },
  ];

  const listStatus = [
    "PENDING",
    "PROCESSING",
    "DONE",
    "CONFIRM",
    "CANCEL",
    "OVERDUE",
  ];

  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      CONFIRM: { color: "purple", title: "XÁC NHẬN" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
      LOW: { color: "warning", title: "THẤP" },
      HIGH: { color: "red", title: "CAO" },
      MEDIUM: { color: "processing", title: "TRUNG BÌNH" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };

  const {
    data: taskDetails,
    isError: isErrorTaskDetails,
    isLoading: isLoadingTaskDetails,
  } = useQuery(
    ["taskParentBudget", selectedParentTask],
    () =>
      getTasks({
        fieldName: "id",
        conValue: selectedParentTask,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        if (data && Array.isArray(data)) {
          const taskParents = data?.filter((task) => task?.parent === null);
          const formatDate = taskParents?.map((item) => ({
            ...item,
            startDate: moment(item?.startDate).format("YYYY/MM/DD"),
            endDate: moment(item?.endDate).format("YYYY/MM/DD"),
            subTask: item?.subTask
              .filter((task) => task.status !== "CANCEL")
              .sort((a, b) => {
                const sortByStatus =
                  listStatus.indexOf(a.status) - listStatus.indexOf(b.status);
                if (sortByStatus === 0) {
                  return moment(b.createdAt).diff(moment(a.createdAt));
                }
                return sortByStatus;
              }),
          }));

          return formatDate;
        }
        return data;
      },
      refetchOnWindowFocus: false,
      enabled: !!selectedParentTask,
    }
  );
  console.log("🚀 ~ BudgetStaff ~ taskParentDetails:", taskDetails?.[0]);

  //Tính tiền đã dùng với %
  let budgetUsed = 0;
  let percentBudgetUsed = 0;
  if (!isLoadingTaskDetails && !isErrorTaskDetails) {
    budgetUsed = taskDetails?.[0].subTask?.reduce(
      (acc, subTask) => acc + subTask?.budget,
      0
    );
    percentBudgetUsed = (
      (budgetUsed / taskDetails?.[0]?.budget ? taskDetails?.[0]?.budget : 0) *
      100
    ).toFixed(0);
    // console.log("🚀 ~ BudgetStaff ~ percentBudgetUsed:", percentBudgetUsed);
    // console.log("🚀 ~ BudgetStaff ~ budgetUsed:", budgetUsed);
  }

  const onClickCard = ({ key }) => {
    console.log("keuy", key);
  };

  const handleSelect = (taskId) => {
    setSelectedParentTask(taskId);
  };

  return (
    <>
      <div className="bg-bgG w-full h-[calc(100vh-76px-4rem)] ">
        <div className="w-full px-16 mt-3  overflow-y-scroll scrollbar-hide">
          {/* header */}
          <div className="flex flex-row w-full  py-2">
            <div className="flex flex-row w-full justify-between items-center mb-2 ">
              <div className="w-[40%] flex flex-col justify-center items-start  py-2">
                <h3 className="font-semibold text-3xl text-blueBudget mb-2">
                  Ngân sách công việc
                </h3>
                <Spin spinning={isLoadingTaskDetails} className="inline-block">
                  <p className="mb-2 text-blueSecondBudget inline-block">
                    Quản lí chi phí công việc :{" "}
                    <b className="text-blueBudget">{taskDetails?.[0]?.title}</b>
                  </p>
                </Spin>
              </div>
              <div className="w-[60%] flex justify-end text-end">
                <ul className="pl-0 list-none inline-block mt-6">
                  <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                    <span
                      className="cursor-pointer hover:text-blueBudget"
                      onClick={() => setIsBoardTask(true)}
                    >
                      <span className="font-bold">Bảng công việc</span>
                    </span>
                    <DoubleRightOutlined />
                  </li>
                  <li className="relative float-left mr-[10px] text-blueSecondBudget space-x-2">
                    <span className="cursor-pointer hover:text-blueBudget">
                      <span className="font-bold">Ngân Sách</span>
                    </span>
                    <DoubleRightOutlined />
                  </li>
                  <li className="relative float-left mr-0 text-blueSecondBudget">
                    <Spin spinning={isLoadingTaskDetails}>
                      <span>{taskDetails?.[0]?.title}</span>
                    </Spin>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* content */}
          <div className="outline-none w-full py-2 overflow-hidden">
            <div className="flex flex-row w-full">
              {/* leftSide */}
              <div className="w-[25%] overflow-hidden">
                <div className="w-full h-[265px]">
                  <div className="w-full px-3 space-y-3">
                    {/* cardParentTask */}
                    {listTaskParents?.length > 0 ? (
                      listTaskParents?.map((task) => (
                        <div
                          key={task?.id}
                          className={`${
                            selectedParentTask === task?.id
                              ? "bg-bgCardBudget"
                              : "bg-white"
                          } py-5 px-2 cursor-pointer rounded-lg flex items-center flex-col justify-between w-full `}
                          onClick={() => handleSelect(task?.id)}
                        >
                          <div className="w-full overflow-hidden flex flex-row justify-center items-center gap-x-2 mb-[2px]">
                            <div
                              className={` ${
                                selectedParentTask === task?.id
                                  ? "bg-[#2321b0]"
                                  : "bg-[#e1e1f9]"
                              }  rounded-full flex justify-center h-[40px] w-[50px] items-center`}
                            >
                              <BulbOutlined
                                className={`${
                                  selectedParentTask === task?.id
                                    ? "text-[#e1e1f9]"
                                    : " text-[#2F2CD8] "
                                } text-base  h-[265px]`}
                              />
                            </div>
                            <Tooltip title="Hạng mục 1 chuẩn bị sân khấu">
                              <h3
                                className={`text-lg font-semibold truncate w-full  ${
                                  selectedParentTask === task?.id
                                    ? "text-[#e1e1f9]"
                                    : " text-[#1f2c73]"
                                }`}
                              >
                                {task?.title}
                              </h3>
                            </Tooltip>
                          </div>
                          <div className=" w-full overflow-hidden flex flex-row justify-between px-2 items-center ">
                            <p
                              className={`text-sm  ${
                                selectedParentTask === task?.id
                                  ? "text-[#e1e1f9]"
                                  : " text-blueSecondBudget "
                              }  font-semibold ml-10`}
                            >
                              {task?.budget ? task?.budget : "0"} VND
                            </p>
                            <span
                              className={`${
                                selectedParentTask === task?.id
                                  ? "text-[#e1e1f9]"
                                  : " text-blueSecondBudget "
                              }  text-xs font-semibold `}
                            >
                              {moment(task?.endDate).format("DD-MM-YYYY")}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>
                        <Empty />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RightSize */}
              <div className="w-[75%] overflow-hidden  mx-2">
                <div className=" w-full h-fit">
                  {/* progess */}
                  <div className="w-full h-fit overflow-hidden rounded-lg border-[#e5eaef] border bg-white mb-2">
                    <div className="p-3 w-full flex flex-col gap-y-1">
                      {/* money header */}
                      <div className=" flex justify-between items-center w-full">
                        <div className="flex flex-col gap-y-1 justify-start items-start">
                          <p className="text-blueSecondBudget text-start font-semibold">
                            Đã sử dụng
                          </p>
                          <Spin spinning={isLoadingTaskDetails}>
                            <h3 className="text-blueBudget font-bold text-xl">
                              {budgetUsed ? budgetUsed : "0"} VND
                            </h3>
                          </Spin>
                        </div>
                        <div className="flex flex-col gap-y-1 justify-end items-end ">
                          <p className="text-blueSecondBudget font-semibold">
                            Tổng Tiền
                          </p>
                          <Spin spinning={isLoadingTaskDetails}>
                            <h3 className="text-blueBudget font-bold text-xl">
                              {taskDetails?.budget ? taskDetails?.budget : "0"}{" "}
                              VND
                            </h3>
                          </Spin>
                        </div>
                      </div>
                      {/* progess */}
                      <div className="w-full py-1">
                        <Progress
                          percent={
                            percentBudgetUsed !== NaN ? percentBudgetUsed : 0
                          }
                          size="default"
                          status="active"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-wrap h-fit  gap-x-5 py-2 ">
                    {/* CardSubtask */}

                    {taskDetails?.[0]?.subTask?.length > 0 ? (
                      taskDetails?.[0]?.subTask?.map((subTask) => (
                        <div className="mb-3 w-[32%] h-[265px overflow-hidden flex flex-col cursor-pointer">
                          <div className=" bg-white rounded-lg   w-full h-full flex flex-col">
                            {/* headerCard */}
                            <div className="w-full p-5 flex flex-row justify-between items-center text-blueBudget overflow-hidden">
                              <Tooltip title=" Mua banner để dựng sân khấu">
                                <h3 className="font-bold text-base text-start w-[80%] truncate">
                                  {subTask?.title}
                                </h3>
                              </Tooltip>
                              {subTask?.status !== "CONFIRM" ? (
                                <Dropdown
                                  menu={{
                                    items: budgetItems,
                                    onClick: onClickCard,
                                  }}
                                  placement="bottomRight"
                                  trigger={["click"]}
                                >
                                  <BarsOutlined className="text-end w-auto text-sm font-extrabold cursor-pointer" />
                                </Dropdown>
                              ) : (
                                <span></span>
                              )}
                            </div>
                            {/* Leader */}
                            <div className="w-full p-3 flex flex-row gap-x-2 justify-start items-start  overflow-hidden bg-[#F7F7FF]">
                              {subTask?.assignTasks.map((assign) => {
                                const isLeader = assign?.isLeader === true;
                                if (isLeader) {
                                  return (
                                    <>
                                      <Avatar
                                        key={assign?.id}
                                        src={assign?.user?.profile?.avatar}
                                        size="default"
                                      />
                                      <p className="text-blueBudget text-base font-semibold">
                                        {assign?.user?.profile?.fullName}{" "}
                                        <span className="text-xs text-blueSecondBudget">
                                          (Trưởng nhóm)
                                        </span>
                                      </p>
                                    </>
                                  );
                                }
                              })}
                            </div>

                            {/* BudgetStaff */}
                            <div className="w-full p-5 flex flex-row gap-x-2 justify-between items-center overflow-hidden ">
                              <div className="flex flex-col justify-start items-start w-1/2">
                                <p className="flex flex-row gap-x-1  text-blueSecondBudget text-sm font-semibold text-start">
                                  <DollarOutlined />
                                  <span>Ngân sách</span>
                                </p>
                                <h3 className="text-blueBudget text-base font-bold">
                                  {subTask?.budget ? subTask?.budget : 0}{" "}
                                  <span className="text-sm text-blueSecondBudget">
                                    VND
                                  </span>
                                </h3>
                              </div>

                              <div className="flex flex-col justify-end items-end w-1/2 text-end">
                                <p className="flex flex-row gap-x-1  text-blueSecondBudget text-sm font-semibold  text-end">
                                  <CalendarOutlined />
                                  <span>Hết hạn</span>
                                </p>
                                <h3 className="text-blueBudget text-base font-bold">
                                  {moment(subTask?.endDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </h3>
                              </div>
                            </div>

                            {/* status */}
                            <div className="w-full p-5 flex flex-row gap-x-2 justify-between items-center overflow-hidden">
                              <Tag
                                icon={
                                  subTask?.status === "CONFIRM" && (
                                    <CheckCircleFilled />
                                  )
                                }
                                color={
                                  getColorStatusPriority(subTask?.status)?.color
                                }
                                className="font-semibold"
                              >
                                {getColorStatusPriority(subTask?.status)?.title}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Empty />
                    )}

                    {/* CreateBudget */}
                    <div
                      className="mb-3 w-[32%] h-[265px] overflow-hidden flex flex-col cursor-pointer "
                      onClick={() => setIsOpenBudgetModal(true)}
                    >
                      <div className="bg-white rounded-lg w-full flex  justify-center items-center hover:text-blueBudget h-full">
                        <PlusCircleOutlined className="text-5xl text-gray-400 hover:text-blueBudget" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isOpenBudgetModal && (
          <NewBudget
            selectEvent={selectEvent}
            isOpenBudgetModal={isOpenBudgetModal}
            setIsOpenBudgetModal={setIsOpenBudgetModal}
          />
        )}
      </div>
    </>
  );
};

export default BudgetStaff;
