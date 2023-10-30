import React, { Fragment } from "react";
import moment from "moment";

import "moment/locale/vi";

const listAllDatesInMonthWithWeek = (year, month) => {
  const firstDayOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
  const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');

  const dates = [];
  
  let currentDay = firstDayOfMonth.clone();
  while (currentDay.isSameOrBefore(lastDayOfMonth)) {
    dates.push({
      date: currentDay.format('YYYY-MM-DD'),
      weekday: currentDay.format('dddd'),
      weekdayVi: currentDay.format('dddd', 'vi'), // Get Vietnamese weekday
    });
    currentDay.add(1, 'day');
  }

  return dates;
};

const TimekeepingPage = () => {
  const datesInMonthWithWeek = listAllDatesInMonthWithWeek(2023, 10);
  console.log(datesInMonthWithWeek);
  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)]"></div>
    </Fragment>
  );
};

export default TimekeepingPage;
