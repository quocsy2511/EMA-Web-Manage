import { Avatar, Image } from "antd";
import React, { Fragment } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import defaultImage from "../../assets/images/pngwing.com.png";
import { useQuery } from "@tanstack/react-query";
import { getAllUser, getProfile } from "../../apis/users";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import moment from "moment";
import { getFilterEvent } from "../../apis/events";

const ProfilePage = () => {
  const { data, isLoading, isError } = useQuery(["profile"], getProfile);

  const {
    data: staffs,
    isLoading: staffsIsLoading,
    isError: staffsIssError,
  } = useQuery(
    ["staffs"],
    () => getAllUser({ role: "STAFF", pageSize: 100, currentPage: 1 }),
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

  if (isLoading || staffsIsLoading || eventsIsLoading)
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
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-4 flex space-x-5">
        <div className="flex flex-col items-center bg-white w-1/4 p-6 rounded-2xl h-full">
          <div
            className="border-[#ED2590] rounded-full bg-white"
            style={{ borderWidth: 3 }}
          >
            <Avatar
              alt="user_image"
              src={data.avatar ?? defaultImage}
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
        </div>
        <div className="bg-white w-1/2 p-6 rounded-2xl">
          <div className="flex items-center text-slate-500">
            <p className="text-sm">{data.fullName}</p>
            <MdArrowForwardIos className="mx-2" />
            <p className="text-sm">Hồ sơ</p>
          </div>

          <div className="mt-5">
            <p className="text-2xl font-bold">Quản lý</p>
            <p className="text-sm bg-[#F0F6FF] py-2 px-4 mt-2 rounded-xl">
              Bạn đã giữ chức vụ quản lý trong 3 năm
            </p>
          </div>

          <div className="mt-12">
            <p className="text-lg font-semibold">
              Đang làm việc với Trưởng phòng ( Bộ phận )
            </p>
            <div className="flex flex-wrap pt-8 gap-y-10">
              {staffs?.map((staff) => (
                <div className="flex flex-col items-center w-[calc(100%/3)]">
                  <Avatar size={70} src={staff.avatar} />
                  <p className="text-base font-medium mt-2">{staff.fullName}</p>
                  <p className="text-xs text-slate-500">{staff.divisionName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white flex-1 p-6 rounded-2xl h-full">
          <p className="text-lg font-semibold">Sự kiện tham gia gần đây (5)</p>
          <div className="mt-5 space-y-3">
            {events?.map((event) => {
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
                <div className="flex border rounded-lg gap-x-2 p-2">
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
                      {/* <div
                        className={`flex justify-center items-center ${statusBgColor} px-4 py- rounded-lg`}
                      >
                        <p className={`text-xs ${statusColor}`}>{status}</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfilePage;
