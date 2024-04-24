import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Avatar,
  Button,
  Checkbox,
  Collapse,
  ConfigProvider,
  message,
} from "antd";
import clsx from "clsx";
import { motion } from "framer-motion";
import React, { Fragment, memo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllDivision } from "../../apis/divisions";
import { updateAssignDivisionToEvent } from "../../apis/events";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import { defaultAvatar } from "../../constants/global";

const EventAssignDivisionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, eventName, listDivisionId } = location.state ?? {};

  const [selectedDivisions, setSelectedDivisions] = useState(
    listDivisionId ?? []
  );

  const [messageApi, contextHolder] = message.useMessage();
  const { notification } = App.useApp();

  const {
    data: divisions,
    isLoading: divisionsIsLoading,
    isError: divisionsIsError,
  } = useQuery(
    ["divisions"],
    () => getAllDivision({ pageSize: 25, currentPage: 1, mode: 1 }),
    {
      select: (data) => {
        return data?.filter((item) => item?.status);
      },
      refetchOnWindowFocus: false,
    }
  );

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (payload) => updateAssignDivisionToEvent(payload),
    {
      onSuccess: (data, variables) => {
        // TODO -> navigation
        queryClient.invalidateQueries(["event-detail", eventId]);
        notification.success({
          message: (
            <p className="font-medium">
              Cập nhật bộ phận chịu trách nhiệm thành công
            </p>
          ),
          placement: "topRight",
          duration: 3,
        });
        navigate(-1);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau 1",
        });
      },
    }
  );

  const toggleSelectedDivision = (id) => {
    if (!!selectedDivisions?.find((item) => item === id)) {
      setSelectedDivisions((prev) => prev?.filter((item) => item !== id));
    } else {
      setSelectedDivisions((prev) => [...prev, id]);
    }
  };

  const handleUpdateDivision = () => {
    mutate({ eventId, divisionId: selectedDivisions });
  };

  const handleSelectAll = () => {
    if (selectedDivisions?.length === listDivisionId?.length) {
      setSelectedDivisions([]);
    } else {
      setSelectedDivisions(divisions?.map((division) => division?.id));
    }
  };

  if (divisionsIsLoading) {
    return (
      <div className="h-[calc(100vh-128px)] w-full">
        <LoadingComponentIndicator />
      </div>
    );
  }
  if (divisionsIsError) {
    return (
      <div className="h-[calc(100vh-128px)] w-full">
        <AnErrorHasOccured />
      </div>
    );
  }

  return (
    <Fragment>
      {contextHolder}

      <motion.div
        initial={{ y: -75 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400 truncate">
          <Link to="/manager/event" relative="path">
            Sự kiện{" "}
          </Link>
          /{" "}
          <Link to=".." relative="path">
            {eventName}{" "}
          </Link>
          / Bộ phận chịu trách nhiệm
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={clsx(
          "bg-white rounded-2xl mt-8 mx-20 overflow-hidden min-h-[calc(100vh-64px-8rem)]",
          {
            "flex items-center justify-center":
              divisionsIsLoading || divisionsIsError,
          }
        )}
      >
        {divisionsIsLoading ? (
          <LoadingComponentIndicator title="dữ liệu" />
        ) : divisionsIsError ? (
          <AnErrorHasOccured />
        ) : (
          <div className="mx-10 my-8 space-y-5">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <p className="text-xl font-medium">Chọn bộ phận phù hợp</p>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimaryHover:
                        selectedDivisions?.length === listDivisionId?.length
                          ? "#ff4d4f"
                          : "#1677ff",
                    },
                  }}
                >
                  <Button type="dashed" onClick={handleSelectAll}>
                    {selectedDivisions?.length === listDivisionId?.length
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả"}
                  </Button>
                </ConfigProvider>
              </div>

              <Button
                type="primary"
                onClick={handleUpdateDivision}
                loading={isLoading}
                size="large"
              >
                Áp dụng
              </Button>
            </div>
            <Collapse
              collapsible="icon"
              expandIconPosition="end"
              items={divisions?.map((division, index) => ({
                key: division?.id,
                label: (
                  <div className="flex justify-between items-center mx-5">
                    <Checkbox
                      checked={selectedDivisions?.includes(division?.id)}
                      onChange={(e) => {
                        toggleSelectedDivision(division?.id);
                      }}
                    >
                      <p className="text-base ml-3">{division?.divisionName}</p>
                    </Checkbox>
                    <p className="text-base">
                      Đang tham gia{" "}
                      <span className="font-semibold">
                        {division?.assignEvents}
                      </span>{" "}
                      sự kiện
                    </p>
                  </div>
                ),
                children: (
                  <div className="flex flex-wrap items-center content-center space-y-2">
                    {division?.users?.map((user) => (
                      <div
                        key={user?.id}
                        className="flex space-x-5 items-center w-1/3"
                      >
                        <Avatar
                          src={user?.profile?.avatar || defaultAvatar}
                          size={45}
                        />

                        <div className="flex flex-col justify-between">
                          <p className="text-xl font-medium truncate">
                            {user?.profile?.fullName}
                          </p>
                          <p className="text-sm text-slate-400 truncate">
                            {user?.role?.roleName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              }))}
              // defaultActiveKey={["1"]}
              onChange={(key) => {}}
            />
          </div>
        )}
      </motion.div>
    </Fragment>
  );
};

export default memo(EventAssignDivisionPage);
