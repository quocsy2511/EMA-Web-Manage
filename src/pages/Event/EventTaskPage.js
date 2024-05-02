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
  Popover,
  Progress,
  Tooltip,
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
import { RiEditFill, RiAdvertisementFill, RiTeamFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import {
  PiMicrophoneStageFill,
  PiTelevisionSimpleFill,
  PiPiggyBankFill,
} from "react-icons/pi";
import { LiaClipboardListSolid } from "react-icons/lia";
import {
  MdCelebration,
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
  FcStatistics,
} from "react-icons/fc";
import { IoSettingsOutline } from "react-icons/io5";
import { GrStatusInfo } from "react-icons/gr";
import { FaRegPenToSquare, FaFilePdf } from "react-icons/fa6";
import EventTaskSelection from "../../components/Selection/EventTaskSelection";
import TaskItem from "../../components/Task/TaskItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailEvent, updateStatusEvent } from "../../apis/events";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import moment from "moment";
import momenttz from "moment-timezone";
import "moment/locale/vi";
import { filterTask } from "../../apis/tasks";
import EmptyList from "../../components/Error/EmptyList";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import EventUpdateModal from "../../components/Modal/EventUpdateModal";
import { getContract, getContractEvidence } from "../../apis/contract";
import ContractCreatePage from "../../components/Modal/ContractCreatePage";
import clsx from "clsx";
import defaultBanner from "../../assets/images/default_banner_images.png";
import EventStatisticModal from "../../components/KanbanBoard/ModalKanban/Statistic/EventStatisticModal";

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
  const location = useLocation();
  const [openStatisticModal, setOpenStatisticModal] = useState(false);
  const [assigneeSelection, setAssigneeSelection] = useState();
  const [prioritySelection, setPrioritySelection] = useState();
  const [statusSelection, setStatusSelection] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false); // update event
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (location.state?.isNavigate && !!location.state?.parentTaskId) {
      if (location.state?.subtaskId) {
        goToSubTask(location.state?.parentTaskId, location.state?.subtaskId);
      } else {
        goToSubTask(location.state?.parentTaskId);
      }
    }
    if (location.state?.isNavigate && location.state?.isBudget) {
      goToBudget();
    }
  }, [location]);

  const {
    data: eventDetail,
    isLoading,
    isError,
  } = useQuery(["event-detail", eventId], () => getDetailEvent(eventId), {
    refetchOnWindowFocus: false,
  });
  console.log("eventDetail > ", eventDetail);

  const {
    data: contract,
    isLoading: contractIsLoading,
    isError: contractIsError,
  } = useQuery(["contract", eventId], () => getContract(eventId), {
    refetchOnWindowFocus: false,
  });

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
        const mapPriory = {
          HIGH: 1,
          MEDIUM: 2,
          LOW: 3,
        };
        // return data.filter((item) => !item.parent)?.map(task => ({}))
        // return data?.reduce((result, item) => {
        //   if (!item?.parent) {
        //     item?.subTask?.sort((a, b) => {
        //       const formatStartDateA = momenttz(a?.startDate).format(
        //         "YYYY-MM-DD"
        //       );
        //       const formatStartDateB = momenttz(b?.startDate).format(
        //         "YYYY-MM-DD"
        //       );

        //       if (formatStartDateA === formatStartDateB) {
        //         return mapPriory[a?.priority] - mapPriory[b?.priority];
        //       }

        //       return formatStartDateA.localeCompare(formatStartDateB);
        //     });

        //     result.push(item);
        //   }

        //   return result;
        // }, []);
        return data
          .filter((item) => !item?.parent)
          .sort((a, b) => {
            const formatStartDateA = momenttz(a?.startDate).format(
              "YYYY-MM-DD"
            );
            const formatStartDateB = momenttz(b?.startDate).format(
              "YYYY-MM-DD"
            );

            if (formatStartDateA === formatStartDateB) {
              return mapPriory[a?.priority] - mapPriory[b?.priority];
            }

            return formatStartDateA.localeCompare(formatStartDateB);
          });
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log(filterTasks);

  const queryClient = useQueryClient();
  const { mutate: updateStatusMutate, isLoading: updateStatusIsLoading } =
    useMutation((status) => updateStatusEvent(eventId, status), {
      onSuccess: (data, variables) => {
        let status;
        switch (variables) {
          case "PENDING":
            status = "CHƯA BẮT ĐẦU";
            break;
          case "PREPARING":
            status = "ĐANG CHUẨN BỊ";
            break;
          case "PROCESSING":
            status = "ĐANG DIỄN RA";
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
          oldValue.status = variables;
          return oldValue;
        });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
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
    if (!eventDetail?.listDivision?.length) {
      goToAssignDivision();
    } else if (eventDetail?.listDivision?.length !== 0) {
      navigate("task", {
        state: {
          eventId,
          eventName: eventDetail?.eventName,
          dateRange: [eventDetail?.processingDate, eventDetail?.endDate],
          isSubTask: false,
        },
      });
    }
  };

  const goToUpdateTask = (task) => {
    const updateData = {
      id: task?.id,
      title: task?.title,
      date: [
        task?.startDate ? momenttz(task?.startDate).format("YYYY-MM-DD") : null,
        task?.endDate ? momenttz(task?.endDate).format("YYYY-MM-DD") : null,
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

        updateData,
      },
    });
  };

  const goToSubTask = (taskId, subtaskId) => {
    navigate(`${taskId}`, {
      state: {
        eventName: eventDetail?.eventName,
        dateRange: [eventDetail?.startDate, eventDetail?.endDate],
        subtaskId,
        eventStatus: eventDetail?.status,
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

  const goToBudget = () => {
    navigate("budget", {
      state: {
        eventId: eventDetail?.id,
        eventName: eventDetail?.eventName,
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

      {/* <FloatButton
        onClick={goToCreateTask}
        type="primary"
        icon={<RiAddFill />}
        tooltip={
          eventDetail?.listDivision?.length !== 0
            ? "Tạo đề mục"
            : "Chưa có bộ phận đảm nhiệm"
        }
        className="cursor-pointer"
      /> */}

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
                  title={`${division?.fullName} - ${division?.divisionName}`}
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
                    eventDetail?.status !== "DONE" && {
                      key: "DONE",
                      label: (
                        <p
                          className="text-sm text-green-500"
                          onClick={() =>
                            eventDetail?.status !== "CANCEL" &&
                            updateStatusMutate("DONE")
                          }
                        >
                          Kết thúc
                        </p>
                      ),
                      disabled:
                        eventDetail?.status === "CANCEL" ||
                        !!filterTasks?.filter(
                          (task) => task?.status !== "CONFIRM"
                        ).length,
                    },
                    eventDetail?.status !== "CANCEL" && {
                      key: "CANCEL",
                      label: (
                        <p
                          className="text-sm text-red-500"
                          onClick={() =>
                            eventDetail?.status !== "DONE" &&
                            updateStatusMutate("CANCEL")
                          }
                        >
                          Hủy bỏ
                        </p>
                      ),
                      disabled: eventDetail?.status === "DONE",
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
        className="bg-white rounded-2xl mt-8 pb-5 overflow-hidden"
      >
        <div className="h-40 w-full overflow-hidden border-b-2 border-slate-400">
          <Image
            src={
              eventDetail?.coverUrl ??
              "https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-stars-background-for-award-ceremony-event-image_786253.jpg"
            }
            width={"100%"}
            fallback={defaultBanner}
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
                    disabled: !contractEvidence?.find(
                      (item) => item?.evidenceType === "CONTRACT_SIGNED"
                    )?.evidenceUrl,
                    label: (
                      <a
                        href={
                          contractEvidence?.find(
                            (item) => item?.evidenceType === "CONTRACT_SIGNED"
                          )?.evidenceUrl
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
                    disabled: !contractEvidence?.find(
                      (item) => item?.evidenceType === "CONTRACT_PAID"
                    )?.evidenceUrl,
                    label: (
                      <a
                        href={
                          contractEvidence?.find(
                            (item) => item?.evidenceType === "CONTRACT_PAID"
                          )?.evidenceUrl
                        }
                        target="_blank"
                        className=""
                      >
                        Xem thanh toán
                      </a>
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
                >
                  <FaFilePdf className="text-xl" />
                </motion.div>
              </Popover>
            </Dropdown>

            <Popover content={<p className="text-base">Điều chỉnh nhóm</p>}>
              <motion.div
                className="flex items-center gap-x-2 text-base text-slate-400 border-[1.5px] border-slate-400 p-2 rounded-md cursor-pointer"
                whileHover={{ y: -4 }}
                onClick={goToAssignDivision}
              >
                <RiTeamFill className="text-xl" />
              </motion.div>
            </Popover>

            <Popover content={<p className="text-base">Ngân sách</p>}>
              <motion.div
                whileHover={{ y: -4 }}
                className="flex items-center gap-x-2 text-base text-slate-400 border-[1.5px] border-slate-400 p-2 rounded-md cursor-pointer"
                onClick={goToBudget}
              >
                <PiPiggyBankFill className="text-xl" />
              </motion.div>
            </Popover>

            <Popover content={<p className="text-base">Thống kê sự kiện</p>}>
              <motion.div
                whileHover={{ y: -4 }}
                className="flex items-center gap-x-2 text-base text-slate-400 border-[1.5px] border-slate-400 p-2 rounded-md cursor-pointer"
                onClick={() => setOpenStatisticModal(true)}
              >
                <FcStatistics className="text-xl" />
              </motion.div>
            </Popover>
          </div>

          <p
            className="w-[75%] text-sm text-slate-500 mt-3"
            dangerouslySetInnerHTML={{
              __html: new QuillDeltaToHtmlConverter(
                JSON.parse(
                  eventDetail?.description?.startsWith(`[{"`)
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
            <Tag
              icon={<MdCelebration size={20} color={color.green} />}
              text={`${eventDetail?.typeName}`}
            />
            {!!filterTasks?.length && (
              <Tag
                icon={<BsTagsFill size={20} color={color.green} />}
                text={`${filterTasks?.length} hạng mục`}
              />
            )}
          </div>

          <div className="mt-6">
            <p className="font-medium">Các nhóm chịu trách nhiệm</p>
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
                <p className="">Chưa có nhóm chịu trách nhiệm</p>
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
                <p className="text-lg font-semibold">Ngày chuẩn bị</p>
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

            <div>
              <div className="flex items-center gap-x-2">
                <BsHourglassBottom size={20} color={color.green} />
                <p className="text-lg font-semibold">Ngày bắt đầu sự kiện</p>
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
                <BsHourglassSplit size={20} color={color.green} />
                <p className="text-lg font-semibold">Ngày kết thúc sự kiện</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="w-5" />
                <p className="text-xs text-slate-400">
                  {new Date(eventDetail?.endDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex-1">
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
                      (filterTasks?.filter((task) => task?.status === "CONFIRM")
                        .length / filterTasks?.length ?? 1) * 100
                    )?.toFixed(1)}
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
                    title="Danh sách nhóm"
                    placeholder="Chọn trưởng nhóm"
                    options={eventDetail?.listDivision?.map((division) => ({
                      value: division?.userId,
                      label: `${division?.fullName} - ${division?.divisionName}`,
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

                  {(assigneeSelection ||
                    prioritySelection ||
                    statusSelection) && (
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
                  )}
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
                                  eventStatus={eventDetail?.status}
                                  // Go to update task
                                  goToUpdateTask={() => goToUpdateTask(task)}
                                  goToSubTask={goToSubTask}
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
                {openStatisticModal && (
                  <EventStatisticModal
                    openStatisticModal={openStatisticModal}
                    setOpenStatisticModal={setOpenStatisticModal}
                    selectEvent={eventDetail}
                  />
                )}
              </>
            )
          ) : (
            <LoadingComponentIndicator />
          )
        }
      </motion.div>
      <FloatButton.BackTop />
    </Fragment>
  );
};

export default memo(EventTaskPage);
