import React, { useEffect, useState } from "react";
import HeaderEvent from "../../components/Header/HeaderEvent";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import { useQuery } from "@tanstack/react-query";
import { getEventDivisions } from "../../apis/events";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import moment from "moment";
import { Empty } from "antd";
import { HeartTwoTone, SmileTwoTone } from "@ant-design/icons";
const EventStaffPage = () => {
  const {
    data: listEvent,

    isError,
    isLoading,
  } = useQuery(["events"], () => getEventDivisions(), {
    select: (data) => {
      const event = data.map(({ ...item }) => {
        item.startDate = moment(item.startDate).format("YYYY-MM-DD");
        item.endDate = moment(item.endDate).format("YYYY-MM-DD");
        return {
          ...item,
        };
      });
      return event;
    },
  });

  const [selectEvent, setSelectEvent] = useState({});
  useEffect(() => {
    setSelectEvent(listEvent?.[0] ?? {});
  }, [listEvent]);

  return (
    <div className="flex flex-col ">
      {!isLoading ? (
        !isError ? (
          listEvent.length > 0 ? (
            <>
              <HeaderEvent
                events={listEvent}
                setSelectEvent={setSelectEvent}
                selectEvent={selectEvent}
              />
              <KanbanBoard selectEvent={selectEvent} />
            </>
          ) : (
            <div className="mt-56">
              <Empty description={false} />
              <div>
                <h1 className="text-center mt-6 font-extrabold text-xl ">
                  Hiện tại bạn đang không tham gia vào sự kiện nào{"  "}
                  <SmileTwoTone twoToneColor="#52c41a" />
                </h1>
                <h3 className="text-center text-sm text-gray-400 mt-4">
                  Vui lòng liên hệ quản lí để tham gia vào sự kiện . Cảm ơn{" "}
                  <HeartTwoTone twoToneColor="#eb2f96" />
                </h3>
              </div>
            </div>
          )
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}
    </div>
  );
};

export default EventStaffPage;
