import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAllUser, getEmployee } from "../../../../apis/users";
import { useRouteLoaderData } from "react-router-dom";
import moment from "moment";
import { Avatar, Select, Space, Tag, Tooltip, message } from "antd";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import { assignMember } from "../../../../apis/tasks";
import { StarFilled } from "@ant-design/icons";

const EmployeeSelected = ({ assignTasks, taskSelected, setAssignTasks }) => {
  const taskID = taskSelected?.id;
  const queryClient = useQueryClient();
  const [assignee, setAssignee] = useState(
    assignTasks?.map((item) => item.user?.id)
  );
  const membersInTask = assignTasks?.map((item) => item.user?.id);
  const { Option } = Select;
  const divisionId = useRouteLoaderData("staff").divisionID;
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
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
    const { closable, onClose } = props;

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    let matchedUsers;

    if (!isLoadingEmployees) {
      matchedUsers = assignee?.map((id) => {
        const user = employees.find((employee) => employee.id === id);
        return user;
      });
    }
    const labelName = matchedUsers?.find((item) => item.id === props.value)
      ?.profile?.fullName;
    const avatar = matchedUsers?.find((item) => item.id === props.value)
      ?.profile?.avatar;
    const color =
      matchedUsers?.findIndex((user) => user.id === props.value) === 0
        ? "green"
        : "gold";
    console.log("🚀 ~ tagRender ~ matchedUsers:", matchedUsers);
    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 8,
        }}
      >
        {color === "green" && <StarFilled spin />}
        <Avatar src={avatar} className="mr-2" size="small" />
        {labelName}
      </Tag>
    );
  };

  const { mutate: UpdateMember } = useMutation((data) => assignMember(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", staff?.id, eventId]);
      queryClient.invalidateQueries(["subtaskDetails", taskID]);
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
    setAssignee(value);
    UpdateMember(data);
  };

  return (
    <>
      {!isLoadingEmployees ? (
        !isErrorEmployees ? (
          <div className="w-full h-[50px] ">
            <Select
              maxTagCount="responsive"
              autoFocus
              mode="multiple"
              placeholder="Select Member "
              style={{
                width: "100%",
              }}
              defaultValue={membersInTask}
              onChange={(value) => handleChangeMember(value)}
              optionLabelProp="label"
              tagRender={tagRender}
              size="large"
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
                          <Avatar
                            src={item?.profile?.avatar}
                            className="mr-2"
                            size="small"
                          />
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
                      <span>{item?.profile?.fullName}</span>
                    </Space>
                  </Option>
                );
              })}
            </Select>
          </div>
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
