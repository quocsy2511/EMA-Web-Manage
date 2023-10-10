import React, { useState } from "react";
import HeaderEvent from "../../components/Header/HeaderEvent";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import { useQuery } from "@tanstack/react-query";
import { getAllEvent } from "../../apis/events";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";

const EventStaffPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isError, isLoading } = useQuery(
    ["event", currentPage],
    () => getAllEvent({ pageSize: 10, currentPage }),
    { retry: 1 },
    {
      select: (data) => {
        return data.data;
      },
    }
  );
  console.log("🚀 ~ file: EventStaffPage.js:12 ~ EventStaffPage ~ data:", data);

  const [events, setEvents] = useState([
    {
      idEvent: 1,
      createBy: "Tung",
      eventName: "🔥 Sự kiện kỷ niệm 10 năm",
      description:
        "😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
      members: [
        {
          name: "vux 1",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "syx 1",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "Huyx 1",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "Thiepx 1",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      ],
      startDate: "2023-10-01 00:00:00",
      endDate: "2023-10-06 00:00:00",
      processDate: "2023-10-05 00:00:00",
      location: "nhà thương biên hoà  32/2/1 biên hoà đồng nai ",
      coverUrl: "https://source.unsplash.com/random",
    },
    {
      idEvent: 2,
      createBy: "Sy 2",
      eventName: "🔥 Sự kiện kỷ niệm 20 năm",
      description:
        "😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
      members: [
        {
          name: "vux 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "syx 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "Huyx 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "Thiepx",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      ],
      startDate: "2023-11-02 00:00:00",
      endDate: "2023-11-09 00:00:00",
      processDate: "2023-11-03 00:00:00",
      location: "bênh viện từ vũ  32/2/1 biên hoà đồng nai ",
      coverUrl: "https://source.unsplash.com/random",
    },
    {
      idEvent: 3,
      createBy: "Vu 3",
      eventName: "🔥 Sự kiện kỷ niệm 30 năm",
      description:
        "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
      members: [
        {
          name: "vux 3",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "syx 3",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "Huyx 3",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
        {
          name: "Thiepx 3",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      ],
      startDate: "2023-12-11 00:00:00",
      endDate: "2023-12-17 00:00:00",
      processDate: "2023-12-18 00:00:00",
      location: "nhà thương biên hoà  32/2/1 biên hoà đồng nai ",
      coverUrl: "https://source.unsplash.com/random",
    },
  ]);

  // const [selectEvent, setSelectEvent] = useState(data?.[0]);
  const [selectEvent, setSelectEvent] = useState(events[0]);

  return (
    <div className="flex flex-col ">
      {/* {!isLoading ? (
        !isError ? (
          <>
            <HeaderEvent
              events={events}
              // events={data}
              setSelectEvent={setSelectEvent}
              selectEvent={selectEvent}
            />
            <KanbanBoard selectEvent={selectEvent} />
          </>
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )} */}
      <HeaderEvent
        events={events}
        // events={data}
        setSelectEvent={setSelectEvent}
        selectEvent={selectEvent}
      />
      <KanbanBoard selectEvent={selectEvent} />
    </div>
  );
};

export default EventStaffPage;
