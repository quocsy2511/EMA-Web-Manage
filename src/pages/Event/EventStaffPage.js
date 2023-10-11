import React, { useEffect, useState } from "react";
import HeaderEvent from "../../components/Header/HeaderEvent";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import { useQuery } from "@tanstack/react-query";
import { getEventDivisions } from "../../apis/events";
import AnErrorHasOccured from "../../components/Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import moment from "moment";
// const [events, setEvents] = useState([
//   {
//     idEvent: 1,
//     createBy: "Tung",
//     eventName: "🔥 Sự kiện kỷ niệm 10 năm",
//     description:
//       "😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
//     members: [
//       {
//         name: "vux 1",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "syx 1",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "Huyx 1",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "Thiepx 1",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//     ],
//     startDate: "2023-10-01 00:00:00",
//     endDate: "2023-10-06 00:00:00",
//     processDate: "2023-10-05 00:00:00",
//     location: "nhà thương biên hoà  32/2/1 biên hoà đồng nai ",
//     coverUrl: "https://source.unsplash.com/random",
//   },
//   {
//     idEvent: 2,
//     createBy: "Sy 2",
//     eventName: "🔥 Sự kiện kỷ niệm 20 năm",
//     description:
//       "😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
//     members: [
//       {
//         name: "vux 2",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "syx 2",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "Huyx 2",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "Thiepx",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//     ],
//     startDate: "2023-11-02 00:00:00",
//     endDate: "2023-11-09 00:00:00",
//     processDate: "2023-11-03 00:00:00",
//     location: "bênh viện từ vũ  32/2/1 biên hoà đồng nai ",
//     coverUrl: "https://source.unsplash.com/random",
//   },
//   {
//     idEvent: 3,
//     createBy: "Vu 3",
//     eventName: "🔥 Sự kiện kỷ niệm 30 năm",
//     description:
//       "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
//     members: [
//       {
//         name: "vux 3",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "syx 3",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "Huyx 3",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//       {
//         name: "Thiepx 3",
//         avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
//       },
//     ],
//     startDate: "2023-12-11 00:00:00",
//     endDate: "2023-12-17 00:00:00",
//     processDate: "2023-12-18 00:00:00",
//     location: "nhà thương biên hoà  32/2/1 biên hoà đồng nai ",
//     coverUrl: "https://source.unsplash.com/random",
//   },
// ]);

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
  console.log(
    "🚀 ~ file: EventStaffPage.js:108 ~ EventStaffPage ~ events:",
    listEvent
  );

  const [selectEvent, setSelectEvent] = useState({});

  // const [selectEvent, setSelectEvent] = useState(events[0]);

  useEffect(() => {
    setSelectEvent(listEvent?.[0] ?? {});
  }, [listEvent]);

  return (
    <div className="flex flex-col ">
      {!isLoading ? (
        !isError ? (
          <>
            <HeaderEvent
              events={listEvent}
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
      )}

      {/* <HeaderEvent
        events={events}
        // events={data}
        setSelectEvent={setSelectEvent}
        selectEvent={selectEvent}
      />
      <KanbanBoard selectEvent={selectEvent} /> */}
    </div>
  );
};

export default EventStaffPage;
