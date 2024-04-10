import { StarFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Badge, Tooltip } from "antd";
import moment from "moment";
import React from "react";
import { getTasks } from "../../../../apis/tasks";

const InforEmployee = ({ taskSelected }) => {
  let taskID = taskSelected?.id;

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
            item.startDate = moment(item.startDate).format("DD-MM-YYYY");
            item.endDate = moment(item.endDate).format("DD-MM-YYYY");
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
          subtaskDetails?.[0].assignTasks
            ?.filter((user) => user.status === "active")
            ?.map((item) => (
              <Tooltip
                key="avatar"
                title={
                  item.isLeader
                    ? `${item.user?.profile?.fullName} (Trưởng nhóm)`
                    : item.user?.profile?.fullName
                }
                placement="top"
              >
                {item?.isLeader ? (
                  <Badge
                    count={
                      <StarFilled className="text-yellow-400 text-sm" spin />
                    }
                    offset={[-7, 3]}
                    className="mr-1"
                  >
                    <Avatar
                      src={item.user?.profile?.avatar}
                      size="default"
                      className="border border-yellow-300"
                    />
                  </Badge>
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
