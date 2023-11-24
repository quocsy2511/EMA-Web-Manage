import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getAllUser } from "../../../../apis/users";
import { useRouteLoaderData } from "react-router-dom";
import moment from "moment";
import { Avatar, Select, Space, Tooltip, message } from "antd";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import { assignMember } from "../../../../apis/tasks";

const EmployeeSelected = ({ assignTasks, taskSelected, setAssignTasks }) => {
  const taskID = taskSelected?.id;
  const queryClient = useQueryClient();
  const membersInTask = assignTasks?.map((item) => item.user?.id);
  const { Option } = Select;
  const divisionId = useRouteLoaderData("staff").divisionID;

  const {
    data: employees,
    isError: isErrorEmployees,
    isLoading: isLoadingEmployees,
  } = useQuery(
    ["employees"],
    () =>
      getAllUser({
        divisionId,
        pageSize: 10,
        currentPage: 1,
        role: "EMPLOYEE",
      }),
    {
      select: (data) => {
        const listUsers = data.data.map(({ ...item }) => {
          item.dob = moment(item.dob).format("YYYY-MM-DD");
          return {
            key: item.id,
            ...item,
          };
        });
        return listUsers;
      },
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: UpdateMember } = useMutation((data) => assignMember(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["subtaskDetails"], taskID);
      message.open({
        type: "success",
        content: "cập nhật nhân viên được giao công việc thành công",
      });
    },
    onError: () => {
      message.open({
        type: "error",
        content:
          "Ko thể cập nhật nhân viên được giao công việc lúc này! Hãy thử lại sau",
      });
    },
  });

  const handleChangeMember = (value) => {
    const data = {
      assignee: value,
      taskID: taskID,
      leader: value?.length > 0 ? value[0] : "",
    };
    UpdateMember(data);
  };

  return (
    <>
      {!isLoadingEmployees ? (
        !isErrorEmployees ? (
          <>
            <Select
              autoFocus
              mode="multiple"
              placeholder="Select Member "
              //   bordered={false}
              style={{
                width: "100%",
              }}
              defaultValue={membersInTask}
              onChange={(value) => handleChangeMember(value)}
              optionLabelProp="label"
              className="h-fit"
            >
              {employees?.map((item, index) => {
                return (
                  <Option
                    value={item?.id}
                    label={
                      <span role="img" aria-label={item?.fullName}>
                        <Tooltip
                          key="avatar"
                          title={item?.fullName}
                          placement="top"
                        >
                          <Avatar src={item?.avatar} />
                        </Tooltip>
                        {item?.fullName}
                      </span>
                    }
                    // key={!item.id ? index : item.id}
                    key={index}
                  >
                    <Space>
                      <span role="img" aria-label={item?.fullName}>
                        <Avatar src={item?.avatar} />
                      </span>
                      {item?.fullName}
                    </Space>
                  </Option>
                );
              })}
            </Select>
          </>
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}
    </>
  );
};

export default EmployeeSelected;
