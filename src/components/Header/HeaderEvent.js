import { SlidersTwoTone } from "@ant-design/icons";
import { Avatar, Dropdown, Select, Tooltip } from "antd";
import React from "react";

const settingHeader = [
  {
    key: "1",
    label: "a danger item",
  },
  {
    key: "2",
    label: "a danger item",
  },
];

const filter = [
  {
    key: "1",
    type: "group",
    label: "Member",
    children: [
      {
        key: "1-1",
        label: "Nguyen Vu",
      },
      {
        key: "1-2",
        label: "Thiep Ngo",
      },
    ],
  },
  {
    key: "2",
    type: "group",
    label: "Bộ phận",
    children: [
      {
        key: "2-1",
        label: "hậu cần",
      },
      {
        key: "2-2",
        label: "marketing",
      },
    ],
  },
];

const HeaderEvent = ({ events, setSelectEvent, selectEvent }) => {
  const handleChangeEvent = (value) => {
    const event = JSON.parse(value);
    setSelectEvent(event);
  };

  return (
    <div className="p-4 fixed left-0  dark:bg-dark bg-bgHeader z-50 right-0 top-14">
      <div className="flex items-center space-x-2 md:space-x-4">
        <header className="flex justify-between dark:text-white items-center w-full mx-8">
          {/* left header */}
          <div className="flex items-center gap-x-4">
            <Select
              defaultValue={{ label: events[0].eventName, value: events }}
              style={{
                width: 250,
              }}
              bordered={false}
              onChange={handleChangeEvent}
              options={events.map((event) => {
                const jsonString = JSON.stringify(event);
                return {
                  label: (
                    <p className="font-semibold text-gray-600">
                      {event.eventName}
                    </p>
                  ),
                  value: jsonString,
                };
              })}
              // onChange={handleChange}
              size="middle"
            />
          </div>

          {/* right header */}
          <div className="flex justify-center items-center gap-x-3">
            <div className="border-r-[1px] border-r-solid border-gray-400 pr-2">
              <Dropdown
                menu={{
                  items: filter,
                }}
              >
                <div className=" flex justify-center items-center gap-x-2 px-4 py-2 cursor-pointer dark:hover:bg-secondaryHover rounded-lg hover:bg-secondaryHover hover:text-secondary">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                  </span>
                  <p>Filter</p>
                </div>
              </Dropdown>
            </div>

            <div className="hidden md:block border-r-[1px] border-r-solid border-gray-400 pr-2 cursor-pointer">
              <Avatar.Group
                maxCount={3}
                maxStyle={{
                  color: "#D25B68",
                  backgroundColor: "#F4D7DA",
                }}
              >
                {selectEvent.members.map((member) => {
                  return (
                    <Tooltip
                      key={member.name}
                      title={member.name}
                      placement="top"
                    >
                      <Avatar src={member.avatar} />
                    </Tooltip>
                  );
                })}
              </Avatar.Group>
            </div>

            <div>
              <Dropdown
                menu={{
                  items: settingHeader,
                }}
                placement="bottomRight"
                arrow={{
                  pointAtCenter: true,
                }}
              >
                <span className="cursor-pointer text-secondary text-sm">
                  <SlidersTwoTone
                    twoToneColor="#635fc7"
                    style={{ fontSize: 24 }}
                  />
                </span>
              </Dropdown>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default HeaderEvent;
