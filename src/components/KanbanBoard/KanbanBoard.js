import React from "react";
import Column from "../KanbanBoard/Column/Column.js";

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
        <div className="pt-[150px] px-16 text-dark">
          <h2 className="text-4xl font-semibold  mt-6 px-4">
            {selectEvent.eventName}
          </h2>
          <p className="text-base  mt-3">{selectEvent.description}</p>
        </div>
        <div className="flex scrollbar-default overflow-x-scroll gap-6 pl-6 py-5">
          {TaskParents.map((taskParent) => (
            <Column TaskParentArray={taskParent} key={taskParent.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
