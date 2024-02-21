import React, { Fragment, memo, useState } from "react";
import { Calendar, ConfigProvider, Form, Tooltip } from "antd";
import viVN from "antd/locale/vi_VN";
import { FaCheck } from "react-icons/fa6";
import { MdArrowForwardIos } from "react-icons/md";
import momenttz from "moment-timezone";
import { motion } from "framer-motion";

import moment from "moment";
import "moment/locale/vi";
import { useQuery } from "@tanstack/react-query";
import { getAllDivision } from "../../../apis/divisions";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";
import clsx from "clsx";

moment.locale("vi");

const Item = memo(({ division, selectedId, handleSelectDivision }) => {
  console.log("division > ", division);
  return (
    <motion.div
      onClick={() => handleSelectDivision(division)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: [0.95] }}
      transition={{ duration: 0.3, type: "tween" }}
      className={clsx(
        "flex space-x-5 items-center rounded-xl p-3 border-2 cursor-pointer",
        { "border-blue-400": selectedId.id === division.id }
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center w-10 h-10 border rounded-full",
          { "border-blue-500": selectedId.id === division.id }
        )}
      >
        {selectedId.id === division.id && (
          <FaCheck className="text-blue-500 text-base" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-base font-medium truncate">
          {division.divisionName}
        </p>
        <p className="text-sm truncate">
          Do{" "}
          <span className="font-medium text-blue-600">
            {division?.userName}
          </span>{" "}
          quản lý
        </p>
      </div>
      <Tooltip title="xem chi tiết lịch trình">
        <div
          onClick={(e) => {
            e.stopPropagation();
            console.log("refetch data");
          }}
          className="w-[10%] h-full flex items-center justify-center group"
        >
          <MdArrowForwardIos className="text-lg text-slate-300 group-hover:text-black transition-colors" />
        </div>
      </Tooltip>
    </motion.div>
  );
});

const TaskSection = ({ form }) => {
  const [selectedId, setSelectedId] = useState();

  const {
    data: divisions,
    isLoading: divisionsLoading,
    isError: divisionsIsError,
  } = useQuery(
    ["divisions"],
    () => getAllDivision({ pageSize: 100, currentPage: 1, mode: 1 }),
    {
      select: (data) =>
        data
          ?.filter((division) => division.status)
          .map((division) => ({
            id: division.id,
            divisionName: division.divisionName,
            userName: division?.users?.[0]?.profile?.fullName,
          })),
    }
  );

  const handleSelectDivision = (division) => {
    setSelectedId(division);
    form.setFieldsValue({ assignee: division.id });
    console.log(form.getFieldsValue());
  };

  return (
    <Fragment>
      <div className="flex space-x-10">
        <div className="w-1/3">
          <p className="text-lg font-medium">Bộ phận chịu trách nhiệm</p>
          <Form.Item
            name="assignee"
            rules={[
              {
                required: true,
                message: "Chọn 1 trưởng phòng !",
              },
            ]}
          >
            <div className="space-y-5 mt-5">
              {divisionsLoading ? (
                <div className="mt-5">
                  <LoadingComponentIndicator />
                </div>
              ) : divisionsIsError ? (
                <p className="mt-5 text-lg font-medium">
                  Không thể lấy dữ liệu hãy thử lại sau !
                </p>
              ) : (
                divisions.map((division) => (
                  <Item
                    key={division.id}
                    division={division}
                    selectedId={selectedId}
                    handleSelectDivision={handleSelectDivision}
                  />
                ))
              )}
            </div>
          </Form.Item>
        </div>

        <div className="flex-1">
          <p className="text-black text-lg font-medium">
            Lịch trình của{" "}
            <span className="text-black">{selectedId?.divisionName}</span>
          </p>
          <div className="mt-5 border">
            <ConfigProvider locale={viVN}>
              <Calendar
                onPanelChange={(value, mode) => {
                  console.log(value.format("YYYY-MM-DD"), mode);
                }}
                fullscreen={true}
                locale={viVN}
                onSelect={(value, info) => {
                  console.log("chosen > ", value);
                  console.log("info > ", info);
                  const time = momenttz(value.$d);
                  console.log(time);
                }}
                cellRender={(current, info) => {
                  // TODO

                  // return info.originNode;
                  return (
                    <div>
                      <p></p>
                      {/* <p>1</p>
                      <p>1</p>
                      <p>1</p> */}
                    </div>
                  );
                }}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TaskSection;
