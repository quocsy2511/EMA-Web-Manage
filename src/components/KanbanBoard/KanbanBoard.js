import React from "react";
import Column from "../KanbanBoard/Column/Column.js";
import { BookOutlined, CalendarOutlined } from "@ant-design/icons";

const TaskParents = [
  {
    id: 1,
    title: "Thiết kế sân khâus ",
    name: "🔥 Sự kiện kỷ niệm 10 năm",
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 14:00:00",
    priority: "hight",
    status: "processing",
    estimationTime: "3",
    createdBy: "Vu",
    approvedBy: "Vu",
    effort: "3",
    file: [
      {
        id: 1,
        title: "file 1",
      },
      {
        id: 2,
        title: "file 2",
      },
    ],
    comment: [
      {
        id: 1,
        title: "comment 1",
        createBy: "Nguyễn Quốc Sỹ",
        avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
      },
      {
        id: 2,
        title: "comment 2",
        createBy: "Nguyễn Quốc Sỹ",
        avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
      },
    ],
    description:
      "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
    member: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    tasks: [
      {
        id: 1,
        title: "mua ban ghe ",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 11:09:00",
        priority: "hight",
        status: "done",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1.1",
            createBy: "Nguyễn Quốc Sỹ",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
          },
          {
            id: 2,
            title: "comment 2.1",
            createBy: "Nguyễn Quốc Sỹ",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Vux",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 2,
        title: "mua buc giang",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-12 00:00:00",
        priority: "hight",
        status: "confirmed",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Syx",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 3,
        title: "mua buc giang",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-11 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Huyx",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Thiết kế sân Buc giang",
    name: "🔥 Sự kiện kỷ niệm 10 năm",
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 00:00:00",
    priority: "hight",
    status: "processing",
    estimationTime: "3",
    createdBy: "Vu",
    file: [
      {
        id: 1,
        title: "file 1",
      },
      {
        id: 2,
        title: "file 2",
      },
    ],
    comment: [
      {
        id: 1,
        title: "comment 1",
      },
      {
        id: 2,
        title: "comment 1",
      },
    ],
    approvedBy: "Vu",
    effort: "3",
    description:
      "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
    member: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    tasks: [
      {
        id: 1,
        title: "đốt pháo bông",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Vux 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 2,
        title: "gọi 113",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Huy 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 3,
        title: "gọi ng iu tới",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "pending",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "thiep ngo 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
    ],
  },
  {
    id: 3,
    title: "Bơm Bong bóng",
    name: "🔥 Sự kiện kỷ niệm 10 năm",
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 00:00:00",
    priority: "hight",
    status: "processing",
    estimationTime: "3",
    createdBy: "Vu",
    approvedBy: "Vu",
    file: [
      {
        id: 1,
        title: "file 1",
      },
      {
        id: 2,
        title: "file 2",
      },
    ],
    comment: [
      {
        id: 1,
        title: "comment 1",
      },
      {
        id: 2,
        title: "comment 1",
      },
    ],
    effort: "3",
    description:
      "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
    member: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    tasks: [
      {
        id: 1,
        title: "Mua thùng nước",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "pending",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Vux 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 2,
        title: "Mua tre mua măng",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "done",
        estimationTime: "3",
        createdBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Huy 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 3,
        title: "gọi ng iu tới",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        createdBy: "Vu",
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "thiep ngo 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
    ],
  },
  {
    id: 4,
    title: "Bơm Bong bóng",
    name: "🔥 Sự kiện kỷ niệm 10 năm",
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 00:00:00",
    priority: "hight",
    status: "processing",
    file: [
      {
        id: 1,
        title: "file 1",
      },
      {
        id: 2,
        title: "file 2",
      },
    ],
    comment: [
      {
        id: 1,
        title: "comment 1",
      },
      {
        id: 2,
        title: "comment 1",
      },
    ],
    estimationTime: "3",
    createdBy: "Vu",
    approvedBy: "Vu",
    effort: "3",
    description:
      "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
    member: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    tasks: [
      {
        id: 1,
        title: "Mua thùng nước",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "pending",
        estimationTime: "3",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        createdBy: "Vu",
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Vux 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 2,
        title: "Mua tre mua măng",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "done",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "Huy 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 3,
        title: "gọi ng iu tới",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        createdBy: "Vu",
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "thiep ngo 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 4,
        title: "gọi ng iu tới",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        createdBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "thiep ngo 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 5,
        title: "gọi ng iu tới",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        createdBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "thiep ngo 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 6,
        title: "gọi ng iu tới",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        createdBy: "Vu",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "thiep ngo 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
      {
        id: 7,
        title: "gọi ng iu tới",
        name: "🔥 Sự kiện kỷ niệm 10 năm",
        startDate: "2023-10-01 00:00:00",
        endDate: "2023-10-07 00:00:00",
        priority: "hight",
        status: "processing",
        estimationTime: "3",
        file: [
          {
            id: 1,
            title: "file 1",
          },
          {
            id: 2,
            title: "file 2",
          },
        ],
        comment: [
          {
            id: 1,
            title: "comment 1",
          },
          {
            id: 2,
            title: "comment 1",
          },
        ],
        createdBy: "Vu",
        approvedBy: "Vu",
        effort: "3",
        description:
          "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
        member: {
          name: "thiep ngo 2",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        },
      },
    ],
  },
  {
    id: 5,
    title: "đập thằng Vũ ",
    name: "🔥 Sự kiện kỷ niệm 10 năm",
    startDate: "2023-10-01 00:00:00",
    endDate: "2023-10-07 00:00:00",
    priority: "hight",
    status: "processing",
    estimationTime: "3",
    createdBy: "Vu",
    approvedBy: "Vu",
    file: [],
    comment: [],
    effort: "3",
    description:
      "😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident Dolor nostrud eu nulla elit labore excepteur nostrud. Proident",
    member: {
      name: "vux",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
    },
    tasks: [],
  },
];

const KanbanBoard = ({ selectEvent }) => {
  // const [currentPage, setCurrentPage] = useState(1);

  // const { data, isError, isLoading } = useQuery(
  //   ["event", currentPage],
  //   () => getAllEvent({ pageSize: 10, currentPage }),
  //   {
  //     select: (data) => {
  //       console.log(
  //         "🚀 ~ file: KanbanBoard.js:815 ~ KanbanBoard ~ data:",
  //         data.data
  //       );
  //     },
  //   }
  // );

  return (
    <>
      <div className="bg-bgBoard  h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
        <div
          className={`min-h-[220px] relative mt-[128px] py-3 px-16 text-white  group md:w-[100%] w-[45%] bg-white  cursor-pointer bg-[url('https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-stars-background-for-award-ceremony-event-image_786253.jpg')] bg-auto bg-center `}
        >
          <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
          <h2 className="relative z-20  text-4xl font-semibold  mt-6 mb-3">
            {selectEvent.eventName}
          </h2>
          <span className="relative z-20  flex flex-row justify-start items-center gap-x-2 ">
            <CalendarOutlined className="text-lg text-orange-500" />
            <p className="mt-1 px-4 font-medium  text-white  underline underline-offset-2">
              {selectEvent.startDate} - {selectEvent.endDate}
            </p>
          </span>
          <span className="relative z-20  flex flex-row justify-start items-start gap-x-2 mt-3 mb-6">
            <BookOutlined className="text-lg text-orange-500" />
            <p className="text-base w-2/3  px-4 italic text-white ">
              {selectEvent.description}
            </p>
          </span>
        </div>
        <div className="flex scrollbar-default overflow-x-scroll gap-6 px-16 py-5">
          {TaskParents.map((taskParent) => (
            <Column TaskParentArray={taskParent} key={taskParent.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
