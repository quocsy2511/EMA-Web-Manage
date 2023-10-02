import React from "react";
import Column from "../KanbanBoard/Column/Column.js";

const KanbanBoard = () => {
  return (
    <div className="bg-gradient-to-br from-secondary to-blue-100 dark:bg-darkSecondary dark:from-slate-900 dark:to-secondaryHover h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
      {/* infor event */}
      <div className="pt-[150px] px-5">
        <h2 className="text-4xl font-semibold text-white mt-2">
          🔥 SỰ KIỆN 10 NĂM
        </h2>
        <p className="text-base text-white mt-3">
          😽😽😽 Dolor nostrud eu nulla elit labore excepteur nostrud. Proident
          nulla adipisicing laboris enim nostrud aliquip nostrud do. Commodo
          laboris irure ullamco id amet duis. non dolor aliqua laborum. Proident
          tempor ut amet irure commodo dolor laborum non mollit aute non nostrud
          dolor.
        </p>

        <p className="text-base text-white mt-3">
          😽😽Duis ipsum minim incididunt amet adipisicing duis deserunt
          aliquip. Deserunt nostrud proident quis quis laboris quis ipsum aute
          non minim dolore velit nisi ullamco. Deserunt exercitation consectetur
          ex elit duis commodo laborum
        </p>
        <p className="text-base text-white mt-3">
          😽Duis Deserunt exercitation consectetur ex elit duis commodo laborum
        </p>
      </div>
      <div className="flex scrollbar-default overflow-x-scroll gap-6 pl-6 py-5">
        <Column />
        <Column />
        <Column />
      </div>
    </div>
  );
};

export default KanbanBoard;
