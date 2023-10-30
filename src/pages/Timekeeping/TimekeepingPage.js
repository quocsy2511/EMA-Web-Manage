import moment from "moment";
import React, { Fragment } from "react";

const listAllDatesInMonthWithWeek = (year, month) => {
  const startDate = moment(`${year}-${month}-01`);
  const endDate = moment(startDate).endOf("month");
  const datesWithWeek = [];

  while (startDate.isSameOrBefore(endDate, "day")) {
    datesWithWeek.push({
      date: startDate.format("YYYY-MM-DD"),
      week: startDate.week(),
    });
    startDate.add(1, "day");
  }

  return datesWithWeek;
};

const TimekeepingPage = () => {
  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)]"></div>
    </Fragment>
  );
};

export default TimekeepingPage;
