import React, { Fragment, memo, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Avatar,
  Collapse,
  Dropdown,
  FloatButton,
  Image,
  Modal,
  Popover,
  Progress,
  Tooltip,
  Upload,
  message,
} from "antd";
import {
  FaLongArrowAltRight,
  FaUserFriends,
  FaFileContract,
} from "react-icons/fa";
import {
  BsHourglassSplit,
  BsHourglassBottom,
  BsTagsFill,
  BsCalendarWeekFill,
  BsMicrosoftTeams,
} from "react-icons/bs";
import { RiEditFill, RiAdvertisementFill, RiAddFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import {
  PiMicrophoneStageFill,
  PiTelevisionSimpleFill,
  PiPiggyBankFill,
} from "react-icons/pi";
import { LiaClipboardListSolid } from "react-icons/lia";
import {
  MdDesignServices,
  MdFilterListAlt,
  MdIntegrationInstructions,
  MdLocationPin,
  MdOutlineDone,
} from "react-icons/md";
import {
  FcMoneyTransfer,
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { IoSettingsOutline } from "react-icons/io5";
import { GrStatusInfo } from "react-icons/gr";
import { FaRegPenToSquare, FaFilePdf } from "react-icons/fa6";
import EventTaskSelection from "../../components/Selection/EventTaskSelection";
import TaskItem from "../../components/Task/TaskItem";
import TaskAdditionModal from "../../components/Modal/TaskAdditionModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailEvent, updateStatusEvent } from "../../apis/events";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import moment from "moment";
import momenttz from "moment-timezone";
import "moment/locale/vi";
import { filterTask, getTasks, getTemplateTask } from "../../apis/tasks";
import EmptyList from "../../components/Error/EmptyList";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import EventUpdateModal from "../../components/Modal/EventUpdateModal";
import {
  getContract,
  getContractEvidence,
  postContractEvidence,
} from "../../apis/contract";
import DocReviewerModal from "../../components/Modal/DocReviewerModal";
import ContractCreatePage from "../../components/Modal/ContractCreatePage";
import clsx from "clsx";

moment.locale("vi"); // Set the locale to Vietnam
const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const Tag = memo(({ icon, text, width }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`flex items-center gap-x-2 px-5 py-2 rounded-full border border-slate-300 cursor-pointer ${width}`}
  >
    {icon}
    <p className="text-sm font-normal">{text}</p>
  </motion.div>
));

const color = {
  green: "hsl(156.62deg 81.93% 32.55%)",
  blue: "#1677ff",
};

const EventTaskPage = () => {
  const eventId = useParams()?.eventId;
  const manager = useRouteLoaderData("manager");
  const navigate = useNavigate();

  const [assigneeSelection, setAssigneeSelection] = useState();
  const [prioritySelection, setPrioritySelection] = useState();
  const [statusSelection, setStatusSelection] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false); // update event
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const [isUpdateContractModalOpen, setIsUpdateContractModalOpen] =
    useState(false);
  const [updateContractFile, setUpdateContractFile] = useState();
  console.log("updateContractFile > ", updateContractFile);

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: eventDetail,
    isLoading,
    isError,
  } = useQuery(["event-detail", eventId], () => getDetailEvent(eventId), {
    refetchOnWindowFocus: false,
  });
  console.log("Event : ", eventDetail);

  const {
    data: contract,
    isLoading: contractIsLoading,
    isError: contractIsError,
  } = useQuery(["contract", eventId], () => getContract(eventId), {
    refetchOnWindowFocus: false,
  });
  console.log("contract > ", contract);

  const {
    data: contractEvidence,
    isLoading: contractEvidenceIsLoading,
    isError: contractEvidenceIsError,
  } = useQuery(
    ["contract-evidence", contract?.id],
    () => getContractEvidence(contract?.id),
    {
      refetchOnWindowFocus: false,
      enabled: !!contract?.id,
    }
  );
  console.log("contractEvidence > ", contractEvidence);

  const {
    data: filterTasks,
    isLoading: filterTaskIsLoading,
    isError: filterTaskIsError,
    refetch,
  } = useQuery(
    ["filter-tasks", eventId],
    () =>
      filterTask({
        assignee: assigneeSelection,
        eventID: eventId,
        priority: prioritySelection,
        status: statusSelection,
        messageApi: messageApi,
        sort: "DESC",
      }),
    {
      select: (data) => {
        return data.filter((item) => !item.parent);
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log("filterTasks > ", filterTasks);

  const queryClient = useQueryClient();
  const { mutate: updateStatusMutate, isLoading: updateStatusIsLoading } =
    useMutation((status) => updateStatusEvent(eventId, status), {
      onSuccess: (data, variables) => {
        console.log("ddddd > ", data, variables);
        let status;
        switch (variables?.status) {
          case "PENDING":
            status = "CHƯA BẮT ĐẦU";
            break;
          case "PREPARING":
            status = "ĐANG CHUẨN BỊ";
            break;
          case "PROCESSING":
            status = "DANG DIỄN RA";
            break;
          case "DONE":
            status = "ĐÃ KẾT THÚC";
            break;
          case "CANCEL":
            status = "HỦY BỎ";
            break;

          default:
            break;
        }

        messageApi.open({
          type: "success",
          content: status ? (
            <p>
              Cập nhật trạng thái sự kiện thành{" "}
              <span className="font-medium">{status}</span>
            </p>
          ) : (
            "Đã cập nhật sự kiện"
          ),
        });

        queryClient.setQueryData(["event-detail", eventId], (oldValue) => {
          return { ...oldValue, status: variables?.status };
        });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const {
    mutate: contractEvidenceMutate,
    isLoading: contractEvidenceMutateIsLoading,
  } = useMutation((formData) => postContractEvidence(contract?.id, formData), {
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Đã cập nhật hợp đồng",
      });
      setIsUpdateContractModalOpen(false);
      queryClient.invalidateQueries(["contract-evidence", contract?.id]);
    },
  });

  useEffect(() => {
    if (assigneeSelection || prioritySelection || statusSelection) {
    }
    refetch();
  }, [assigneeSelection, prioritySelection, statusSelection]);

  const resetFilter = () => {
    setAssigneeSelection();
    setPrioritySelection();
    setStatusSelection();
  };

  const goToCreateTask = () => {
    if (eventDetail?.listDivision?.length !== 0) {
      navigate("task", {
        state: {
          eventId,
          eventName: eventDetail?.eventName,
          dateRange: [eventDetail?.startDate, eventDetail?.endDate],
          isSubTask: false,
          listDivision: eventDetail?.listDivision?.map(
            (division) => division?.divisionId
          ),
        },
      });
    }
  };

  const goToUpdateTask = (task) => {
    const updateData = {
      title: task?.title,
      date: [
        momenttz(task?.startDate).format("YYYY-MM-DD"),
        momenttz(task?.endDate).format("YYYY-MM-DD"),
      ],
      priority: task?.priority,
      desc: task?.description,
      // assignee: task?.assignTasks?.map((user) => user?.user?.id),
      assignee: [], // In case guarantee that this task is not assigned to anyone
    };

    navigate("task", {
      state: {
        eventId,
        eventName: eventDetail?.eventName,
        dateRange: [eventDetail?.startDate, eventDetail?.endDate],
        isSubTask: false,
        listDivision: eventDetail?.listDivision?.map(
          (division) => division?.divisionId
        ),

        updateData,
      },
    });
  };

  const goToAssignDivision = () => {
    navigate("division", {
      state: {
        eventId: eventDetail?.id,
        eventName: eventDetail?.eventName,
        listDivisionId: eventDetail?.listDivision?.map(
          (division) => division?.divisionId
        ),
      },
    });
  };

  if (isLoading)
    return (
      <div className="h-[calc(100vh-128px)] w-full">
        <LoadingComponentIndicator />
      </div>
    );

  if (isError)
    return (
      <div className="h-[calc(100vh-128px)] w-full">
        <AnErrorHasOccured />
      </div>
    );

  return (
    <Fragment>
      {contextHolder}

      <FloatButton
        onClick={goToCreateTask}
        type="primary"
        icon={<RiAddFill />}
        disabled={eventDetail?.listDivision?.length === 0}
        tooltip={
          eventDetail?.listDivision?.length !== 0
            ? "Tạo đề mục"
            : "Chưa có bộ phận đảm nhiệm"
        }
        className="cursor-pointer"
      />

      <Modal
        title="Cập nhật hợp đồng"
        open={isUpdateContractModalOpen}
        onOk={() => {
          if (updateContractFile) {
            if (updateContractFile?.size > 10 * 1024 * 1024) {
              messageApi.open({
                type: "warning",
                content: "File quá lớn ! Chỉ cho phép dung lượng < 10MB.",
              });
            } else {
              const formData = new FormData();
              formData.append("file", updateContractFile);
              formData.append("folderName", "contract");

              contractEvidenceMutate(formData);
            }
          }
        }}
        onCancel={() => setIsUpdateContractModalOpen(false)}
        width={"20%"}
        cancelText="Hủy"
        confirmLoading={contractEvidenceMutateIsLoading}
      >
        <div className="flex items-center justify-center">
          <Upload
            className="flex items-center gap-x-3"
            maxCount={1}
            listType="picture-circle"
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            showUploadList={{
              showPreviewIcon: false,
              // showRemoveIcon: false,
            }}
            accept=".pdf"
            beforeUpload={(file) => {
              return new Promise((resolve, reject) => {
                if (file && file?.size > 10 * 1024 * 1024) {
                  reject("File quá lớn ( <10MB )");
                  messageApi.open({
                    type: "warning",
                    content: "File quá lớn ! Chỉ cho phép dung lượng < 10MB.",
                  });
                  return false;
                } else {
                  setUpdateContractFile(file);
                  resolve();
                  return true;
                }
              });
            }}
          >
            Tệp Tin PDF
          </Upload>
        </div>
      </Modal>

      <EventUpdateModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        event={eventDetail}
      />

      <ContractCreatePage
        isModalOpen={isContractModalOpen}
        setIsModalOpen={setIsContractModalOpen}
        messageApi={messageApi}
        eventId={eventId}
      />

      <div className="flex justify-between items-center">
        <div>
          <motion.div
            initial={{ y: -75 }}
            animate={{ y: 0 }}
            className="flex justify-between items-center"
          >
            <p className="text-base font-medium text-slate-400">
              <Link to=".." relative="path">
                Sự kiện{" "}
              </Link>
              / {eventDetail?.eventName}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="flex items-center"
          >
            <p className="text-2xl font-semibold">{eventDetail?.eventName}</p>

            <div className="w-5" />

            <Avatar src={manager.avatar} />

            <FaLongArrowAltRight className="mx-3" color="#9A9A9A" size={20} />

            <Avatar.Group
              maxCount={eventDetail?.listDivision?.length}
              maxPopoverTrigger="hover"
              maxStyle={{ color: "#D25B68", backgroundColor: "#F4D7DA" }}
            >
              {eventDetail?.listDivision?.map((division, index) => (
                <Tooltip
                  key={division?.divisionId ?? index}
                  title={`${division?.fullName} - bộ phận ${division?.divisionName}`}
                  placement="top"
                >
                  <Avatar
                    className="bg-slate-300 cursor-pointer"
                    src={division?.avatar}
                    alt="avatar"
                  />
                </Tooltip>
              ))}
            </Avatar.Group>

            <div className="w-5" />

            <p
              className={clsx(
                "text-sm font-medium px-4 py-1.5 shadow-md shadow-slate-300 rounded-xl",
                {
                  "text-slate-500 bg-slate-100":
                    eventDetail?.status === "PENDING",
                },
                {
                  "text-orange-500 bg-orange-100":
                    eventDetail?.status === "PREPARING",
                },
                {
                  "text-blue-500 bg-blue-100":
                    eventDetail?.status === "PROCESSING",
                },
                {
                  "text-green-500 bg-green-100": eventDetail?.status === "DONE",
                },
                { "text-red-500 bg-red-100": eventDetail?.status === "CANCEL" }
              )}
            >
              {eventDetail?.status === "PENDING"
                ? "Chưa bắt đầu"
                : eventDetail?.status === "PREPARING"
                ? "Đang chuẩn bị"
                : eventDetail?.status === "PROCESSING"
                ? "Đang diễn ra"
                : eventDetail?.status === "DONE"
                ? "Đã kết thúc"
                : eventDetail?.status === "CANCEL"
                ? "Hủy bỏ"
                : "Chưa bắt đầu"}
            </p>
          </motion.div>
        </div>

        <Popover
          className="mr-10"
          content={<p className="text-base">Cài đặt sự kiện</p>}
        >
          <Dropdown
            placement="bottomLeft"
            arrow
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "1",
                  type: "group",
                  label: (
                    <p className="text-lg text-black px-2 flex items-center border-b">
                      <GrStatusInfo className="text-base mr-3" />
                      Trạng Thái
                    </p>
                  ),
                  children: [
                    // {
                    //   key: "PENDING",
                    //   label: (
                    //     <p
                    //       className="text-sm text-slate-500"
                    //       onClick={() => updateStatusMutate("PENDING")}
                    //     >
                    //       Chưa bắt đầu
                    //     </p>
                    //   ),
                    // },
                    // {
                    //   key: "PREPARING",
                    //   label: (
                    //     <p
                    //       className="text-sm text-orange-500"
                    //       onClick={() => updateStatusMutate("PREPARING")}
                    //     >
                    //       Đang chuẩn bị
                    //     </p>
                    //   ),
                    // },
                    {
                      key: "PROCESSING",
                      label: (
                        <p
                          className="text-sm text-blue-500"
                          onClick={() => updateStatusMutate("PROCESSING")}
                        >
                          Đang diễn ra
                        </p>
                      ),
                    },
                    {
                      key: "DONE",
                      label: (
                        <p
                          className="text-sm text-green-500"
                          onClick={() => updateStatusMutate("DONE")}
                        >
                          Đã kết thúc
                        </p>
                      ),
                    },
                    {
                      key: "CANCEL",
                      label: (
                        <p
                          className="text-sm text-red-500"
                          onClick={() => updateStatusMutate("CANCEL")}
                        >
                          Hủy bỏ
                        </p>
                      ),
                    },
                  ],
                },
                {
                  key: "2",
                  label: (
                    <div
                      onClick={() => setIsModalOpen(true)}
                      className="text-lg text-black px-2 flex items-center border-b"
                    >
                      <FaRegPenToSquare className="text-base mr-3" />
                      <p>Thông Tin</p>
                    </div>
                  ),
                },
              ],
            }}
          >
            <motion.div
              className="flex items-center gap-x-2 text-base text-slate-500 cursor-pointer pr-2"
              whileHover={{ scale: 1.02, color: "#000000" }}
            >
              <IoSettingsOutline className="text-2xl" />
            </motion.div>
          </Dropdown>
        </Popover>
      </div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl mt-8 overflow-hidden"
      >
        <div className="h-40 w-full overflow-hidden">
          <Image
            src={
              eventDetail?.coverUrl ??
              "https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-stars-background-for-award-ceremony-event-image_786253.jpg"
            }
            width={"100%"}
            className="bg-slate-200"
          />
        </div>
        <div className="mx-10 my-8">
          <div className="flex items-center gap-x-5">
            <p className="flex-1 text-3xl font-bold">
              {eventDetail?.eventName}
            </p>
            <Dropdown
              placement="bottomLeft"
              arrow
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <a
                        href={
                          contract &&
                          contractEvidence &&
                          (contractEvidence?.length > 0
                            ? contractEvidence?.[0]?.evidenceUrl
                            : contract?.contractFileUrl ?? null)
                        }
                        target="_blank"
                        className=""
                      >
                        Xem hợp đồng
                      </a>
                    ),
                  },
                  {
                    key: "2",
                    disabled:
                      !!contractEvidence && contractEvidence?.length > 0,
                    label: (
                      <div
                        onClick={() => setIsUpdateContractModalOpen(true)}
                        className=""
                      >
                        <p>Cập nhật hợp đồng</p>
                      </div>
                    ),
                  },
                ],
              }}
            >
              <Popover
                content={
                  <p className="text-base">
                    {contractIsLoading || contractEvidenceIsLoading
                      ? "Đang tải ..."
                      : contractIsError || contractEvidenceIsError
                      ? "Không thể lấy dữ liệu"
                      : "Hợp đồng"}
                  </p>
                }
              >
                <motion.div
                  className="flex items-center gap-x-2 text-base text-slate-400 border-[1.5px] border-slate-400 p-2 rounded-md cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    // Create contract -> Disabled
                    // if (!contractIsLoading && !contractIsError)
                    //   if (Object.keys(contract).length === 0)
                    //     setIsContractModalOpen(true);
                  }}
                >
                  {/* {contractIsLoading ||
                  contractIsError ||
                  !contract ||
                  contractEvidenceIsLoading ||
                  contractEvidenceIsError ||
                  !contractEvidence ? (
                    <FaFilePdf className="text-lg" />
                  ) : (
                    <a
                      className="hover:text-inherit"
                      // href={
                      //   contract &&
                      //   contractEvidence &&
                      //   (contractEvidence?.length > 0
                      //     ? contractEvidence?.[0]?.evidenceUrl
                      //     : contract?.contractFileUrl ?? null)
                      // }
                      // target="_blank"
                    >
                      <FaFilePdf className="text-lg" />
                    </a>
                  )} */}
                  <FaFilePdf className="text-lg" />
                </motion.div>
              </Popover>
            </Dropdown>

            <Popover content={<p className="text-base">Điều chỉnh bộ phận</p>}>
              <motion.div
                className="flex items-center gap-x-2 text-base text-slate-400 border-[1.5px] border-slate-400 p-2 rounded-md cursor-pointer"
                whileHover={{ y: -4 }}
                onClick={goToAssignDivision}
              >
                <BsMicrosoftTeams className="text-lg" />
              </motion.div>
            </Popover>
            <Link to="budget">
              <Popover content={<p className="text-base">Ngân sách</p>}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex items-center gap-x-2 text-base text-slate-400 border-[1.5px] border-slate-400 p-2 rounded-md cursor-pointer"
                >
                  <PiPiggyBankFill className="text-lg" />
                </motion.div>
              </Popover>
            </Link>
            {/* <Popover content={<p className="text-base">Chỉnh sửa sự kiện</p>}>
              <motion.div
                className="flex items-center gap-x-2 text-base text-slate-400 border-[1.5px] border-slate-400 p-2 rounded-md cursor-pointer"
                whileHover={{ y: -4 }}
                onClick={() => setIsModalOpen(true)}
              >
                <RiEditFill className="text-lg" />
              </motion.div>
            </Popover> */}
          </div>

          <p
            className="w-[75%] text-sm text-slate-500 mt-3"
            dangerouslySetInnerHTML={{
              __html: new QuillDeltaToHtmlConverter(
                JSON.parse(
                  eventDetail?.description?.startsWith(`[{"insert":"`)
                    ? eventDetail?.description
                    : parseJson(eventDetail?.description)
                )
              ).convert(),
            }}
          ></p>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-5 mt-6">
            <Tag
              icon={<MdLocationPin size={20} color={color.green} />}
              text={eventDetail?.location}
              width={"w-fit truncate"}
            />
            <Tag
              icon={<FcMoneyTransfer size={20} />}
              text={`${eventDetail?.estBudget?.toLocaleString("en-US")} VNĐ`}
            />
            {!!filterTasks?.length && (
              <Tag
                icon={<BsTagsFill size={20} color={color.green} />}
                text={`${filterTasks?.length} hạng mục`}
              />
            )}
          </div>

          <div className="mt-6">
            <p className="font-medium">Bộ phận chịu trách nhiệm</p>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-3 mt-3">
              {eventDetail?.listDivision &&
              eventDetail?.listDivision?.length > 0 ? (
                eventDetail?.listDivision?.map((division, index) => (
                  <Tag
                    key={division?.divisionId ?? index}
                    icon={<FaUserFriends size={20} color={color.blue} />}
                    text={`${division?.fullName} - ${division?.divisionName}`}
                    width={"truncate"}
                  />
                ))
              ) : (
                <p className="">Chưa có bộ phận chịu trách nhiệm</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-20 gap-y-5 mt-10">
            <div>
              <div className="flex items-center gap-x-2">
                <BsCalendarWeekFill
                  size={20}
                  className=""
                  color={color.green}
                />
                <p className="text-lg font-semibold">Ngày bắt đầu</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="w-5" />
                <p className="text-xs text-slate-400">
                  {new Date(eventDetail?.processingDate).toLocaleDateString(
                    "vi-VN",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <BsHourglassBottom size={20} color={color.green} />
                <p className="text-lg font-semibold">Ngày kết thúc</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="w-5" />
                <p className="text-xs text-slate-400">
                  {/* {moment(data.endDate).format("dddd, D [tháng] M, YYYY")} */}
                  {new Date(eventDetail?.endDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <BsHourglassSplit size={20} color={color.green} />
                <p className="text-lg font-semibold">Ngày diễn ra</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="w-5" />
                <p className="text-xs text-slate-400">
                  {new Date(eventDetail?.startDate).toLocaleDateString(
                    "vi-VN",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="w-[40%]">
              <p className="text-base font-semibold">Tiến độ các hạng mục</p>
              {filterTasks && filterTasks?.length !== 0 ? (
                <Tooltip
                  title={`${
                    filterTasks?.filter((task) => task?.status === "CONFIRM")
                      .length
                  }/${filterTasks?.length} hạng mục đã xong`}
                >
                  <Progress
                    percent={(
                      (filterTasks?.filter((task) => task.status === "CONFIRM")
                        .length / filterTasks?.length ?? 1) * 100
                    ).toFixed(2)}
                  />
                </Tooltip>
              ) : (
                <p className="text-slate-500">Chưa có hạng mục</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl px-10 py-8 mt-10 mb-20"
      >
        {
          /*!taskIsLoading && */ !filterTaskIsLoading ? (
            /*taskIsError || */ filterTaskIsError ? (
              <AnErrorHasOccured />
            ) : (
              <>
                <div className="flex items-center gap-x-5">
                  <EventTaskSelection
                    title="Trưởng phòng"
                    placeholder="Chọn trưởng phòng"
                    options={eventDetail?.listDivision?.map((division) => ({
                      value: division?.userId,
                      label: division?.fullName,
                    }))}
                    value={assigneeSelection}
                    updatevalue={setAssigneeSelection}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                  <EventTaskSelection
                    title="Ưu tiên"
                    placeholder="Mức độ"
                    options={[
                      {
                        value: "LOW",
                        label: (
                          <div className="flex items-center gap-x-2">
                            <FcLowPriority />
                            <span>Thấp</span>
                          </div>
                        ),
                      },
                      {
                        value: "MEDIUM",
                        label: (
                          <div className="flex items-center gap-x-2">
                            <FcMediumPriority />
                            <span>Trung bình</span>
                          </div>
                        ),
                      },
                      {
                        value: "HIGH",
                        label: (
                          <div className="flex items-center gap-x-2">
                            <FcHighPriority />
                            <span>Cao</span>
                          </div>
                        ),
                      },
                    ]}
                    value={prioritySelection}
                    updatevalue={setPrioritySelection}
                  />
                  <EventTaskSelection
                    title="Trạng thái"
                    placeholder="Chọn trạng thái"
                    options={[
                      {
                        value: "PENDING",
                        label: <p className="text-gray-400">Đang chuẩn bị</p>,
                      },
                      {
                        value: "PROCESSING",
                        label: <p className="text-blue-400">Đang thực hiện</p>,
                      },
                      {
                        value: "DONE",
                        label: <p className="text-green-500">Hoàn thành</p>,
                      },
                      {
                        value: "CONFIRM",
                        label: <p className="text-purple-500">Đã xác thực</p>,
                      },
                      {
                        value: "CANCEL",
                        label: <p className="text-red-500">Hủy bỏ</p>,
                      },
                      {
                        value: "OVERDUE",
                        label: <p className="text-orange-500">Quá hạn</p>,
                      },
                    ]}
                    value={statusSelection}
                    updatevalue={setStatusSelection}
                  />

                  <div className="flex-1" />

                  <motion.button
                    whileHover={{
                      scale: 1.1,
                    }}
                    transition={{ type: "spring", duration: 0.5 }}
                    onClick={resetFilter}
                    className="flex items-center gap-x-2 border hover:bg-red-500 hover:text-white border-red-500 text-red-500 text-base px-3 py-1.5 rounded-lg"
                  >
                    Đặt lại bộ lọc
                    <MdFilterListAlt size={18} />
                  </motion.button>
                </div>

                {/*  ----------------------------------------------------------------------------------------------------------------------------------  */}
                <div className="flex flex-col gap-y-6 mt-8">
                  <AnimatePresence mode="wait">
                    <AnimatePresence mode="wait">
                      {filterTasks?.length === 0 ? (
                        <EmptyList
                          key="empty-filter-task"
                          title="Chưa có công việc nào!"
                        />
                      ) : (
                        <AnimatePresence>
                          <Collapse
                            ghost
                            expandIcon={() => null}
                            items={filterTasks?.map((task) => ({
                              key: task?.id,
                              label: (
                                <TaskItem
                                  key={task?.id}
                                  task={task}
                                  isSubtask={false}
                                  eventName={eventDetail?.eventName}
                                  // Go to update task
                                  goToUpdateTask={() => goToUpdateTask(task)}
                                  dateRange={[
                                    eventDetail?.startDate,
                                    eventDetail?.endDate,
                                  ]}
                                  listDivision={eventDetail?.listDivision?.map(
                                    (division) => division?.divisionId
                                  )}
                                />
                              ),
                              children:
                                task?.subTask?.length > 0 ? (
                                  task?.subTask?.map((subtask) => {
                                    return (
                                      <div
                                        key={subtask.id}
                                        className="scale-[85%]"
                                      >
                                        <TaskItem
                                          task={subtask}
                                          isSubtask={true}
                                          isDropdown={true}
                                          eventName={eventDetail?.eventName}
                                        />
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="ml-28 font-medium">
                                    Chưa có công việc
                                  </p>
                                ),
                            }))}
                          />
                        </AnimatePresence>
                      )}
                    </AnimatePresence>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-end gap-x-6 mt-8">
                  <div className="flex items-center gap-x-1">
                    <LiaClipboardListSolid
                      size={20}
                      className="text-slate-400"
                    />
                    <p className="text-slate-500">
                      {filterTasks?.length ?? 0} công việc
                    </p>
                  </div>
                </div>
              </>
            )
          ) : (
            <LoadingComponentIndicator />
          )
        }
      </motion.div>
      <FloatButton.BackTop className="right-24" />
    </Fragment>
  );
};

export default memo(EventTaskPage);
