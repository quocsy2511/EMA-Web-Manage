import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getAllUser, getEmployee } from "../../../../apis/users";
import { useRouteLoaderData } from "react-router-dom";
import moment from "moment";
import { Avatar, Select, Space, Tag, Tooltip, message } from "antd";
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
      getEmployee({
        divisionId,
      }),
    {
      select: (data) => {
        const listEmployee = data?.users?.map(({ ...item }) => {
          item.dob = moment(item?.dob).format("YYYY-MM-DD");
          return {
            key: item?.id,
            ...item,
          };
        });
        return listEmployee;
      },
      refetchOnWindowFocus: false,
    }
  );
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="gold"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

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
              tagRender={tagRender}
            >
              {employees?.map((item, index) => {
                return (
                  <Option
                    value={item?.id}
                    label={
                      <span role="img" aria-label={item?.profile?.fullName}>
                        <Tooltip
                          key="avatar"
                          title={item?.profile?.fullName}
                          placement="top"
                        >
                          <Avatar src={item?.profile?.avatar} />
                        </Tooltip>
                        {item?.profile?.fullName}
                      </span>
                    }
                    key={item?.id}
                  >
                    <Space>
                      <span role="img" aria-label={item?.profile?.fullName}>
                        <Avatar src={item?.profile?.avatar} />
                      </span>
                      {item?.profile?.fullName}
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
