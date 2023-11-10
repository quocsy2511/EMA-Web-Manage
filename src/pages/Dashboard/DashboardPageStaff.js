import React, { useEffect, useState } from "react";
import HeaderEvent from "../../components/Header/HeaderEvent";
import { useQuery } from "@tanstack/react-query";
import { getEventDivisions } from "../../apis/events";
import moment from "moment";
import { Empty } from "antd";
import { HeartTwoTone, SmileTwoTone } from "@ant-design/icons";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import DashboardContent from "./ComponentDashboard/DashboardContent";

const DashboardPageStaff = () => {
  const [isDashBoard, setIsDashBoard] = useState(true);

  const {
    data: listEvent,
    isError,
    isLoading,
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
  });
  const [selectEvent, setSelectEvent] = useState({});
  useEffect(() => {
    if (listEvent && listEvent.length > 0) {
      setSelectEvent(listEvent[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEvent]);
  return (
    // <div>
    //   {!isLoading ? (
    //     !isError ? (
    //       listEvent.length > 0 ? (
    //         <>
    //           <HeaderEvent
    //             events={listEvent}
    //             setSelectEvent={setSelectEvent}
    //             selectEvent={selectEvent}
    //             isDashBoard={isDashBoard}
    //           />
    //           <DashboardContent selectEvent={selectEvent} />
    //         </>
    //       ) : (
    //         <div className="mt-56">
    //           <Empty description={false} />
    //           <div>
    //             <h1 className="text-center mt-6 font-extrabold text-xl ">
    //               Hiện tại bạn đang không tham gia vào sự kiện nào{"  "}
    //               <SmileTwoTone twoToneColor="#52c41a" />
    //             </h1>
    //             <h3 className="text-center text-sm text-gray-400 mt-4">
    //               Vui lòng liên hệ quản lí để tham gia vào sự kiện . Cảm ơn{" "}
    //               <HeartTwoTone twoToneColor="#eb2f96" />
    //             </h3>
    //           </div>
    //         </div>
    //       )
    //     ) : (
    //       <AnErrorHasOccured />
    //     )
    //   ) : (
    //     <LoadingComponentIndicator />
    //   )}
    // </div>
    <>
      <DashboardContent />
    </>
  );
};

export default DashboardPageStaff;
