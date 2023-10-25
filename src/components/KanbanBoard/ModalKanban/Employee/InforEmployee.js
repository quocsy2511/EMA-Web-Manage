import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Tooltip } from "antd";
import React from "react";
import { getTasks } from "../../../../apis/tasks";
import moment from "moment";

const InforEmployee = ({ taskSelected }) => {
  const taskID = taskSelected?.id;
  const { data: subtaskDetails } = useQuery(
    ["subtaskDetails", taskID],
    () =>
      getTasks({
        fieldName: "id",
        conValue: taskID,
        pageSize: 10,
        currentPage: 1,
      }),
    {
      select: (data) => {
        if (data.startDate && data.endDate) {
          const formatDate = data.map(({ ...item }) => {
            item.startDate = moment(item.startDate).format(
              "YYYY/MM/DD HH:mm:ss"
            );
            item.endDate = moment(item.endDate).format("YYYY/MM/DD HH:mm:ss");
            return {
              ...item,
            };
          });
          return formatDate;
        }
        return data;
      },
      enabled: !!taskID,
    }
  );

  return (
    <>
      <Avatar.Group
        maxCount={3}
        maxStyle={{
          color: "#D25B68",
          backgroundColor: "#F4D7DA",
        }}
      >
        {subtaskDetails?.[0].assignTasks?.length > 0 &&
          subtaskDetails?.[0].assignTasks?.map((item) => (
            <Tooltip
              key="avatar"
              title={item.user?.profile?.fullName}
              placement="top"
            >
              {item.user.profile === null ? (
                <Avatar
                  icon={<UserOutlined />}
                  size="default"
                  className="bg-gray-500"
                />
              ) : (
                <Avatar src={item.user?.profile?.avatar} size="default" />
              )}
            </Tooltip>
          ))}
      </Avatar.Group>
    </>
  );
};

export default InforEmployee;
