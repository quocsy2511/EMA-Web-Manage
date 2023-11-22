import React, { useEffect, useState } from "react";
import HeadingTitle from "../../../components/common/HeadingTitle";
import { Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getEventDivisions } from "../../../apis/events";
import moment from "moment";
import AnErrorHasOccured from "../../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../components/Indicator/LoadingComponentIndicator";

const ListTimekeepingStaff = () => {
  const [selectEvent, setSelectEvent] = useState({});
  const {
    data: listEvent,
    isError: isErrorEvent,
    isLoading: isLoadingEvent,
  } = useQuery(["events"], () => getEventDivisions(), {
    select: (data) => {
      const filteredEvents = data.filter((item) => item.status !== "DONE");
      const event = filteredEvents.map(({ ...item }) => {
        item.startDate = moment(item.startDate).format("DD/MM/YYYY");
        item.endDate = moment(item.endDate).format("DD/MM/YYYY");
        return {
          ...item,
        };
      });
      return event;
    },
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "event",
      key: "budgetName",
      editTable: true,
      width: "40%",
    },
    {
      title: "giờ chấm công",
      dataIndex: "description",
      key: "description",
      editTable: true,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      editTable: true,
      align: "center",
      render: (_, record) => (
        <div className="text-center">
          <Tag
            className="mr-0 mx-auto"
            color={record.status === 1 ? "green" : "success"}
            key={record.id}
          >
            {record.status === 1 ? "ACTIVE" : "ĐÃ XÁC NHẬN"}
          </Tag>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (listEvent && listEvent.length > 0) {
      setSelectEvent(listEvent[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEvent]);

  return (
    <div>
      <div className="w-full bg-[#F0F6FF] py-4 h-screen">
        <div className="w-full h-full bg-white rounded-lg shadow-xl flex">
          <div className="w-1/5 border-r overflow-hidden overflow-y-scroll scrollbar-hide mb-6">
            <p className="text-base text-slate-400 px-5 mb-2 mt-8">
              Danh sách sự kiện
            </p>
            {!isLoadingEvent ? (
              !isErrorEvent ? (
                listEvent?.map((item, index) => (
                  <div
                    className={`relative ${
                      selectEvent === item
                        ? `border border-slate-300 rounded-xl mx-2`
                        : ``
                    }`}
                    key={index}
                    onClick={() => setSelectEvent(item)}
                  >
                    <div className="flex items-center gap-x-4 px-5 py-3 cursor-pointer break-words overflow-hidden">
                      <div
                        className={
                          selectEvent === item
                            ? "w-2 h-2 bg-red-400 rounded-full"
                            : "w-2 h-2 bg-blue-400 rounded-full"
                        }
                      />
                      <p
                        className={
                          selectEvent === item
                            ? "text-sm font-medium text-blue-500"
                            : "text-sm font-medium text-slate-500"
                        }
                      >
                        {item.eventName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <AnErrorHasOccured />
              )
            ) : (
              <LoadingComponentIndicator />
            )}
          </div>

          <div className="w-4/5 min-h-full bg-[#f5f4f7] overflow-hidden overflow-y-scroll scrollbar-hide px-2 py-2">
            <div className="my-3">
              <HeadingTitle>Bảng chấm công</HeadingTitle>
              <Table
                rowKey="id"
                bordered
                columns={columns}
                // dataSource={listBudgetConfirmed}
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTimekeepingStaff;
