import { Empty, Modal, Spin } from "antd";
import React from "react";
import { getStatisticByEvent } from "../../../../apis/events";
import { useQuery } from "@tanstack/react-query";

const EventStatisticModal = ({
  openStatisticModal,
  setOpenStatisticModal,
  selectEvent,
}) => {
  const handleCancel = () => {
    setOpenStatisticModal(false);
  };
  const {
    data: dataStatistic,
    isLoading,
    isError,
  } = useQuery(
    ["data-statistic", selectEvent?.id],
    () => getStatisticByEvent({ eventId: selectEvent?.id }),
    {
      select: (data) => {
        return data;
      },
      refetchOnWindowFocus: false,
      enabled: !!selectEvent,
    }
  );
  return (
    <Modal
      title="Thống kê sự kiện"
      open={openStatisticModal}
      footer={false}
      onCancel={handleCancel}
    >
      <Spin spinning={isLoading}>
        {isError ? (
          <div className="">
            <Empty
              description={
                <span>Hệ thông đang gặp vấn đề vui lòng thử lại sau</span>
              }
            />
          </div>
        ) : (
          <div className="w-full">
            <div className="w-full mb-3 mt-2 bg-blue-50 px-3 py-2 rounded-md">
              <h2 className="font-bold ">
                Thống kê công việc của sự kiện - ({dataStatistic?.tasks?.total}){" "}
              </h2>
              <div className="w-full px-3">
                <p>
                  Công việc đang chuẩn bị :{" "}
                  <b>{dataStatistic?.tasks?.pending}</b>{" "}
                </p>
                <p>
                  Công việc đang diễn ra :{" "}
                  <b>{dataStatistic?.tasks?.processing}</b>
                </p>
                <p>
                  Công việc đã hoàn thành : <b>{dataStatistic?.tasks?.done}</b>
                </p>
                <p>
                  Công việc đã bị huỷ : <b>{dataStatistic?.tasks?.cancel}</b>
                </p>
                <p>
                  Công việc đã quá hạn : <b>{dataStatistic?.tasks?.overdue}</b>
                </p>
              </div>
            </div>

            <div className="w-full mb-3 bg-blue-50 px-3 py-2 rounded-md">
              <h2 className="font-bold ">
                Thống kê Ngân sách của sự kiện - (
                {dataStatistic?.budget?.total?.toLocaleString()} VND){" "}
              </h2>
              <div className="w-full px-3">
                <p>
                  Ngân sách còn lại :{" "}
                  <b>
                    {dataStatistic?.budget?.remainBudget?.toLocaleString()} VND
                  </b>{" "}
                </p>
                <p>
                  Ngân sách đã sử dụng :{" "}
                  <b>
                    {dataStatistic?.budget?.totalUsed?.toLocaleString()} VND
                  </b>{" "}
                </p>
              </div>
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default EventStatisticModal;
