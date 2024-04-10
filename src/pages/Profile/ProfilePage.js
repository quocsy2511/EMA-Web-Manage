import { SettingOutlined, SwapRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Empty, Image, Spin } from "antd";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { getEventDivisions, getFilterEvent } from "../../apis/events";
import { getAllUser, getProfile } from "../../apis/users";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import { defaultAvatar } from "../../constants/global";
import ChangePasswordModal from "./Modal/ChangePasswordModal";
import EditProfileModal from "./Modal/EditProfileModal";

const ProfilePage = () => {
  const { data, isLoading, isError } = useQuery(["profile"], getProfile);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenChangePasswordModal, setIsOpenPasswordModal] = useState(false);
  const divisionId = data?.divisionId;
  const {
    data: employees,
    isError: isErrorEmployees,
    isLoading: isLoadingEmployees,
  } = useQuery(
    ["employees", divisionId],
    () =>
      getAllUser({
        divisionId,
        pageSize: 50,
        currentPage: 1,
        role: "Nhân Viên",
      }),
    {
      select: (data) => {
        const listUsers = data.data.map(({ ...item }) => {
          item.dob = moment(item.dob).format("YYYY-MM-DD");
          return {
            key: item.id,
            ...item,
          };
        });
        return listUsers;
      },
      enabled: !!divisionId,
    }
  );

  const {
    data: listEvent,
    isError: isErrorEvent,
    isLoading: isLoadingEvent,
  } = useQuery(["events"], () => getEventDivisions(), {
    select: (data) => {
      const filteredEvents = data.filter((item) => item.status !== "DONE");
      const event = filteredEvents?.map(({ ...item }) => {
        item.startDate = moment(item.startDate).format("DD-MM-YYYY");
        item.endDate = moment(item.endDate).format("DD-MM-YYYY");
        return {
          ...item,
        };
      });
      return event;
    },
    enabled: !!divisionId,
  });

  //manager
  const {
    data: staffs,
    isLoading: staffsIsLoading,
    isError: staffsIssError,
  } = useQuery(
    ["staffs"],
    () => getAllUser({ role: "Trưởng Nhóm", pageSize: 100, currentPage: 1 }),
    {
      select: (data) => {
        return data.data;
      },
    }
  );
  const {
    data: events,
    isLoading: eventsIsLoading,
    isError: eventsIsError,
  } = useQuery(
    ["profile-event"],
    () =>
      getFilterEvent({
        pageSize: 5,
        currentPage: 1,
        nameSort: "updatedAt",
        sort: "DESC",
      }),
    {
      select: (data) => {
        return data.data;
      },
    }
  );
  useEffect(() => {
    document.title = "Trang thông tin cá nhân";
  }, []);

  if (isLoading || staffsIsLoading)
    return (
      <div className="w-full h-[calc(100vh-128px)]">
        <LoadingComponentIndicator />;
      </div>
    );

  if (isError || staffsIssError || eventsIsError)
    return (
      <div className="w-full h-[calc(100vh-128px)]">
        <AnErrorHasOccured />;
      </div>
    );

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-4 flex space-x-5 ">
        <div className="flex flex-col items-center bg-white w-1/4 p-6 rounded-2xl h-full">
          <div
            className="border-[#ED2590] rounded-full bg-white"
            style={{ borderWidth: 3 }}
          >
            <Avatar
              alt="user_image"
              src={data.avatar ?? defaultAvatar}
              className="w-32 h-32 m-0.5"
            />
          </div>

          <p className="text-2xl text-center font-semibold mt-4">
            {data.fullName}
          </p>
          <p className="text-sm font-normal text-slate-500 my-2">
            {data.email}
          </p>

          <div className="w-full h-0.5 bg-slate-100 my-6" />

          <div className="w-full px-5">
            <p className="text-base font-medium text-slate-500 mb-4">
              SĐT:
              <span className="font-normal ml-3">{data.phoneNumber}</span>
            </p>
            <p className="text-base font-medium text-slate-500 mb-4">
              Địa chỉ:
              <span className="font-normal ml-3">{data.address}</span>
            </p>
            <p className="text-base font-medium text-slate-500 mb-4">
              Ngày sinh:
              <span className="font-normal ml-3">
                {moment(data.dob).format("DD-MM-YYYY")}
              </span>
            </p>
          </div>
          <div className="w-full flex justify-center mt-3">
            <Button
              type="link"
              className="flex justify-center items-center gap-x-3 flex-row"
              onClick={() => setIsOpenEditModal(true)}
            >
              <SettingOutlined />
              <p>Cập nhật thông tin</p>
            </Button>
          </div>
          <div className="w-full flex justify-center mt-3">
            <Button
              type="link"
              className="flex justify-center items-center gap-x-3 flex-row"
              onClick={() => setIsOpenPasswordModal(true)}
            >
              <SettingOutlined />
              <p>Thay đổi mật khẩu</p>
            </Button>
          </div>
        </div>
        <div className="bg-white w-1/2 p-6 rounded-2xl">
          <div className="flex items-center text-slate-500">
            <p className="text-sm">{data.fullName}</p>
            <MdArrowForwardIos className="mx-2" />
            <p className="text-sm">Hồ sơ</p>
          </div>

          <div className="mt-5">
            <p className="text-2xl font-bold">
              {data.role === "Trưởng Nhóm" ? "Trưởng phòng" : "Quản lý"}{" "}
            </p>
            {data.role === "Trưởng Nhóm" ? (
              <p className="text-sm bg-[#F0F6FF] py-2 px-4 mt-2 rounded-xl">
                Bạn đã giữ chức vụ trưởng bộ trong 4 năm
              </p>
            ) : (
              <p className="text-sm bg-[#F0F6FF] py-2 px-4 mt-2 rounded-xl">
                Bạn đã giữ chức vụ quản lý trong 3 năm
              </p>
            )}
          </div>

          <div className="mt-12">
            {data.role === "Trưởng Nhóm" ? (
              <div className="w-full flex flex-col">
                <div className="w-full mb-8 border-b border-b-gray-300 pb-4">
                  <p className="text-lg font-semibold">
                    Danh sách các nhân viên chính thức
                  </p>
                  <div className="flex flex-wrap pt-8 gap-y-10 overflow-y-auto h-[320px]">
                    {!isLoadingEmployees ? (
                      !isErrorEmployees ? (
                        <>
                          {employees
                            ?.filter(
                              (employee) =>
                                employee?.typeEmployee === "FULL_TIME"
                            )
                            ?.map((employee, index) => (
                              <div
                                className="flex flex-col items-center w-[calc(100%/3)]"
                                key={index}
                              >
                                <Avatar size={70} src={employee?.avatar} />
                                <p className="text-base font-medium mt-2">
                                  {employee?.fullName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {employee?.divisionName}
                                </p>
                              </div>
                            ))}
                        </>
                      ) : (
                        <AnErrorHasOccured />
                      )
                    ) : (
                      <LoadingComponentIndicator />
                    )}
                  </div>
                </div>
                <div className="w-full mb-2 pb-4">
                  <p className="text-lg font-semibold">
                    Danh sách các nhân viên bán thời gian
                  </p>
                  <div className="flex flex-wrap pt-8 gap-y-10 overflow-y-auto h-[320px]">
                    {!isLoadingEmployees ? (
                      !isErrorEmployees ? (
                        <>
                          {employees?.filter(
                            (employee) => employee?.typeEmployee !== "FULL_TIME"
                          ).length > 0 ? (
                            <>
                              {employees
                                ?.filter(
                                  (employee) =>
                                    employee?.typeEmployee !== "FULL_TIME"
                                )
                                ?.map((employee, index) => (
                                  <div
                                    className="flex flex-col items-center w-[calc(100%/3)]"
                                    key={index}
                                  >
                                    <Avatar size={70} src={employee?.avatar} />
                                    <p className="text-base font-medium mt-2">
                                      {employee?.fullName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {employee?.divisionName}
                                    </p>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <div className="w-full flex justify-center items-center">
                              <Empty
                                description={
                                  <span>
                                    Hiện tại chưa có nhận viên bán thời gian
                                  </span>
                                }
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <AnErrorHasOccured />
                      )
                    ) : (
                      <LoadingComponentIndicator />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold">
                  Đang làm việc với Trưởng phòng ( Bộ phận )
                </p>
                <div className="flex flex-wrap pt-8 gap-y-10">
                  {staffs?.map((staff, index) => (
                    <div
                      className="flex flex-col items-center w-[calc(100%/3)]"
                      key={index}
                    >
                      <Avatar size={70} src={staff.avatar} />
                      <p className="text-base font-medium mt-2">
                        {staff.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {staff.divisionName}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-white flex-1 p-6 rounded-2xl h-full">
          {data.role === "Trưởng Nhóm" ? (
            <Spin spinning={isLoadingEvent}>
              <p className="text-lg font-semibold">
                Sự kiện tham gia gần đây ({listEvent?.length})
              </p>
              <div className="mt-5 space-y-3">
                {listEvent?.map((event, index) => {
                  return (
                    <div
                      className="flex border rounded-lg gap-x-2 p-2"
                      key={index}
                    >
                      <Image
                        src={event.coverUrl}
                        fallback="https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-stars-background-for-award-ceremony-event-image_786253.jpg"
                        width={50}
                        height={50}
                      />
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-base font-medium truncate">
                          {event.eventName}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-xs text-slate-400 flex flex-row gap-x-1 font-bold">
                            {event.startDate}
                            <SwapRightOutlined />
                            {event.endDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Spin>
          ) : (
            <Spin spinning={eventsIsLoading}>
              <p className="text-lg font-semibold">
                Sự kiện tham gia gần đây ({events?.length})
              </p>
              <div className="mt-5 space-y-3">
                {events?.map((event, index) => {
                  let status, statusColor, statusBgColor;
                  switch (event.status) {
                    case "PENDING":
                      status = "Đang chuẩn bị";
                      statusColor = "text-slate-500";
                      statusBgColor = "bg-slate-100";
                      break;
                    case "PROCESSING":
                      status = "Đang diễn ra";
                      statusColor = "text-orange-500";
                      statusBgColor = "bg-orange-100";
                      break;
                    case "DONE":
                      status = "Đã kết thúc";
                      statusColor = "text-green-500";
                      statusBgColor = "bg-green-100";
                      break;
                    case "CANCEL":
                      status = "Hủy bỏ";
                      statusColor = "text-red-500";
                      statusBgColor = "bg-red-100";
                      break;
                    default:
                      break;
                  }
                  return (
                    <div
                      className="flex border rounded-lg gap-x-2 p-2"
                      key={index}
                    >
                      <Image
                        src={event.coverUrl}
                        fallback="https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-stars-background-for-award-ceremony-event-image_786253.jpg"
                        width={50}
                        height={50}
                      />
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-base font-medium truncate">
                          {event.eventName}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-xs text-slate-400">
                            {moment(event.startDate).format("DD-MM-YYYY")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Spin>
          )}
        </div>
        {isOpenEditModal && (
          <EditProfileModal
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            data={data}
          />
        )}
        {isOpenChangePasswordModal && (
          <ChangePasswordModal
            isOpenChangePasswordModal={isOpenChangePasswordModal}
            setIsOpenPasswordModal={setIsOpenPasswordModal}
          />
        )}
      </div>
    </Fragment>
  );
};

export default ProfilePage;
