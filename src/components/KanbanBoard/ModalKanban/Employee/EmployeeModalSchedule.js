import { Button, Drawer, Modal } from "antd";
import React, { useState } from "react";
import EmployeeSelected from "./EmployeeSelected";
import ScheduleEmloyees from "../../Schedule/ScheduleEmloyees";
import DrawerTimeLine from "../../Drawer/DrawerTimeLine";

const EmployeeModalSchedule = ({
  isModalAssigneeOpen,
  setIsModalAssigneeOpen,
  setAssignTasks,
  assignTasks,
  taskSelected,
}) => {
  const [checkedDateData, setCheckedDateData] = useState([]);
  const [selectedDateSchedule, setSelectedDateSchedule] = useState("");
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const handleOk = () => {
    setIsModalAssigneeOpen(false);
  };
  const handleCancel = () => {
    setIsModalAssigneeOpen(false);
  };

  return (
    <Modal
      title="Phân công nhân sự"
      open={isModalAssigneeOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      closeIcon={true}
      width={"75%"}
      style={{
        top: 20,
      }}
    >
      <div className="relative overflow-y-scroll w-full h-[86vh]  scrollbar-hide">
        <div className="flex justify-start items-center mt-1 h-fit mb-4">
          <EmployeeSelected
            setAssignTasks={setAssignTasks}
            assignTasks={assignTasks}
            taskSelected={taskSelected}
            setIsModalAssigneeOpen={setIsModalAssigneeOpen}
          />
        </div>
        <div className="w-full overflow-hidden">
          <ScheduleEmloyees
            checkedDateData={checkedDateData}
            childrenDrawer={childrenDrawer}
            setCheckedDateData={setCheckedDateData}
            setChildrenDrawer={setChildrenDrawer}
            setSelectedDateSchedule={setSelectedDateSchedule}
          />
        </div>
        <DrawerTimeLine
          selectedDateSchedule={selectedDateSchedule}
          checkedDateData={checkedDateData}
          childrenDrawer={childrenDrawer}
          setChildrenDrawer={setChildrenDrawer}
        />
      </div>
    </Modal>
  );
};

export default EmployeeModalSchedule;
