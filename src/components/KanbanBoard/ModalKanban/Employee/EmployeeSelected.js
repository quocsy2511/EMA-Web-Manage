import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAllUser, getEmployee } from "../../../../apis/users";
import { useRouteLoaderData } from "react-router-dom";
import moment from "moment";
import { Avatar, Button, Select, Space, Tag, Tooltip, message } from "antd";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";
import { assignMember } from "../../../../apis/tasks";
import { StarFilled } from "@ant-design/icons";

const EmployeeSelected = ({
  assignTasks,
  taskSelected,
  setIsModalAssigneeOpen,
}) => {
  // console.log("🚀 ~ EmployeeSelected ~ assignTasks:", assignTasks);
  const taskID = taskSelected?.id;
  // console.log("🚀 ~ taskID:", taskID);
  const queryClient = useQueryClient();
  const [assignee, setAssignee] = useState(
    assignTasks?.map((item) => item.user?.id)
  );
  // console.log("🚀 ~ EmployeeSelected ~ assignee:", assignee);
  const membersInTask = assignTasks
    ?.filter((user) => user.status === "active")
    ?.map((item) => item.user?.id);

  const divisionId = useRouteLoaderData("staff").divisionID;
  const eventId = taskSelected?.eventDivision?.event?.id;
  const staff = useRouteLoaderData("staff");
  //search Employee
  const filterOption = (input, option) =>
    (option?.label?.props?.label ?? "")
      .toLowerCase()
      .includes(input.toLowerCase());
  const onSearch = (value) => {
    console.log("search:", value);
  };

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
        const listEmployee = data?.users
          ?.filter((user) => user.role.roleName === "Nhân Viên")
          ?.map(({ ...item }) => {
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
    // console.log("🚀 ~ tagRender ~ matchedUsers:", matchedUsers);
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
      setIsModalAssigneeOpen(false);
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
    // console.log("🚀 ~ handleChangeMember ~ value:", value);
    setAssignee(value);
  };

  const handleUpdateMember = () => {
    const data = {
      assignee: assignee,
      taskID: taskID,
      leader: assignee?.length > 0 ? assignee[0] : "",
    };
    UpdateMember(data);
  };

  return (
    <>
      {!isLoadingEmployees ? (
        !isErrorEmployees ? (
          <div className="w-full h-[50px] flex flex-row justify-center items-center gap-x-2">
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
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              options={employees?.map((item) => {
                return {
                  label: (
                    <span key={item?.id} label={item?.profile?.fullName}>
                      <Avatar
                        src={item?.profile?.avatar}
                        className="mr-2"
                        size="small"
                      />
                      {item?.profile?.fullName}
                    </span>
                  ),
                  value: item?.id,
                };
              })}
            />
            <div className="flex flex-row justify-center items-center gap-x-1">
              {/* <Button type="dashed">Huỷ</Button> */}
              <Button type="primary" onClick={handleUpdateMember}>
                Lưu
              </Button>
            </div>
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
