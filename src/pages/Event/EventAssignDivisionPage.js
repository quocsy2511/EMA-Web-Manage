import React, { Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, Button, Checkbox, Collapse, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDivision } from "../../apis/divisions";
import { defaultAvatar } from "../../constants/global";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";
import { updateAssignDivisionToEvent } from "../../apis/events";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import clsx from "clsx";

const EventAssignDivisionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, eventName, listDivisionId } = location.state;

  const [selectedDivisions, setSelectedDivisions] = useState(listDivisionId);
  console.log("selectedDivisions > ", selectedDivisions);

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: divisions,
    isLoading: divisionsIsLoading,
    isError: divisionsIsError,
  } = useQuery(
    ["divisions"],
    () => getAllDivision({ pageSize: 100, currentPage: 1, mode: 1 }),
    {
      select: (data) => {
        return data.filter((item) => item.status);
      },
    }
  );
  console.log("divisions > ", divisions);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (payload) => updateAssignDivisionToEvent(payload),
    {
      onSuccess: (data, variables) => {
        // TODO -> navigation
        queryClient.invalidateQueries(["event-detail", eventId]);
        messageApi.open({
          type: "success",
          content: "Cập nhật bộ phận chịu trách nhiệm thành công.",
        });
        setTimeout(() => {
          navigate(-1);
        }, 1000);
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
    if (!!selectedDivisions.find((item) => item === id)) {
      setSelectedDivisions((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedDivisions((prev) => [...prev, id]);
    }
  };

  const handleUpdateDivision = () => {
    mutate({ eventId, divisionId: selectedDivisions });
  };

  if (divisionsIsLoading) {
    return <p>loading</p>;
  }
  if (divisionsIsError) {
    return <p>error</p>;
  }

  return (
    <Fragment>
      {contextHolder}
      <LockLoadingModal
        isModalOpen={isLoading}
        label="Đang cập nhật sự kiện ..."
      />

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
              <p className="text-xl font-medium">Chọn bộ phận phù hợp</p>
              <Button type="primary" onClick={handleUpdateDivision}>
                Áp dụng
              </Button>
            </div>
            <Collapse
              collapsible="icon"
              expandIconPosition="end"
              items={divisions?.map((division, index) => ({
                key: division.id,
                label: (
                  <div className="flex justify-between items-center mx-5">
                    <Checkbox
                      checked={selectedDivisions.includes(division.id)}
                      onChange={(e) => {
                        toggleSelectedDivision(division.id);
                      }}
                    >
                      <p className="text-base ml-3">{division.divisionName}</p>
                    </Checkbox>
                    <p className="text-base">
                      Đang tham gia{" "}
                      <span className="font-semibold">
                        {division.assignEvents}
                      </span>{" "}
                      sự kiện
                    </p>
                  </div>
                ),
                children: (
                  <div className="mx-5 space-y-5">
                    {division.users?.map((user) => (
                      <div className="flex space-x-5">
                        <Avatar
                          src={user.profile?.avatar || defaultAvatar}
                          size={45}
                        />

                        <div className="flex flex-col justify-between">
                          <p className="text-xl font-medium">
                            {user.profile?.fullName}
                          </p>
                          <p className="text-sm text-slate-400">
                            {user.role?.roleName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              }))}
              // defaultActiveKey={["1"]}
              onChange={(key) => {
                console.log(key);
              }}
            />
          </div>
        )}
      </motion.div>
    </Fragment>
  );
};

export default EventAssignDivisionPage;
