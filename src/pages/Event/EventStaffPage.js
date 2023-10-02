import React from "react";
import HeaderEvent from "../../components/Header/HeaderEvent";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
const EventStaffPage = () => {
  return (
    <div className="flex flex-col">
      <HeaderEvent />
      <KanbanBoard />
    </div>
  );
};

export default EventStaffPage;
