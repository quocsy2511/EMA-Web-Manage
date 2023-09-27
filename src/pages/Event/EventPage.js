import React, { Fragment } from "react";

const EventPage = () => {
  const events = [
    {
      title: "Lễ tốt nghiệp",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut  aliquip ex ea commodo consequat.",
      startDate: ""
    },
  ];

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">Danh sách sự kiện</p>
          <button className="bg-[#1677ff] text-white text-base font-medium px-4 py-2 rounded-lg">
            Tạo mới
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default EventPage;
