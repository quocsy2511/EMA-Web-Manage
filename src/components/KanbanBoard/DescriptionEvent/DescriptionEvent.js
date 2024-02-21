import { CaretRightOutlined } from "@ant-design/icons";
import { Card, Collapse, Tag } from "antd";
import Meta from "antd/es/card/Meta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React from "react";
import { BsCalendarHeart, BsFileEarmarkTextFill } from "react-icons/bs";
import { FaMoneyBillWave, FaSearchLocation } from "react-icons/fa";
import { SiFastapi } from "react-icons/si";
import { motion } from "framer-motion";

const DescriptionEvent = ({ selectEvent }) => {
  const getColorStatusPriority = (value) => {
    const colorMapping = {
      DONE: { color: "green", title: "HOÀN THÀNH" },
      PENDING: { color: "default", title: "CHUẨN BỊ" },
      CANCEL: { color: "red", title: "ĐÃ HUỶ" },
      CONFIRM: { color: "purple", title: "XÁC NHẬN" },
      PROCESSING: { color: "processing", title: "ĐANG DIỄN RA" },
      OVERDUE: { color: "orange", title: "QUÁ HẠN" },
    };
    //colorMapping[status] ở đây để truy suất value bằng key
    return colorMapping[value];
  };
  const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }])
  return (
    <motion.div
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 0.5 }}
      className={`min-h-[150px] relative group md:w-[100%] w-[45%] bg-bgG cursor-pointer bg-auto bg-center px-16 pt-3 mt-5`}
    >
      <h2 className="text-4xl font-semibold  mb-3 italic">
        {selectEvent?.eventName}
      </h2>
      <div className="flex flex-row  items-center gap-x-6 mt-8 justify-between">
        <Card className="w-1/4">
          <Meta
            avatar={
              <BsCalendarHeart className=" text-orange-500 mt-1" size={20} />
            }
            title="Thời gian sự kiện"
            description={`${selectEvent?.startDate} - ${selectEvent?.endDate}`}
          />
        </Card>
        <Card className="w-1/4">
          <Meta
            avatar={
              <FaSearchLocation className=" text-blue-500 mt-1" size={20} />
            }
            title="Địa điểm diễn ra"
            description={selectEvent?.location}
          />
        </Card>

        <Card className="w-1/4">
          <Meta
            avatar={
              <FaMoneyBillWave className=" text-green-500 mt-1" size={20} />
            }
            title="Chi phí dự kiến"
            description={`${selectEvent?.estBudget?.toLocaleString()} VND`}
          />
        </Card>
        <Card className="w-1/4">
          <Meta
            avatar={<SiFastapi className=" text-purple-500 mt-1" size={20} />}
            title="Trạng thái sự kiện "
            description={
              <Tag
                color={getColorStatusPriority(selectEvent?.status)?.color}
                className="h-fit w-fit mt-1 mx-2 font-medium  text-black "
              >
                {getColorStatusPriority(selectEvent?.status)?.title}
              </Tag>
            }
          />
        </Card>
      </div>
      <div className="relative z-20  flex flex-row justify-start items-start gap-x-2 mt-2 mb-5 ">
        <Collapse
          expandIconPosition="end"
          bordered={false}
          expandIcon={({ isActive }) => (
            <div>
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            </div>
          )}
          className="w-full bg-white "
          size="large"
          items={[
            {
              key: "1",
              label: (
                <div className="flex flex-row gap-x-2 ">
                  <BsFileEarmarkTextFill
                    className=" text-gray-500 mt-[2px]"
                    size={20}
                  />
                  <p className="font-semibold text-base text-black">
                    Mô tả sự kiện
                  </p>
                </div>
              ),
              children: selectEvent?.description !== undefined && (
                <p
                  className="text-base w-2/3  px-2 italic text-black break-words"
                  dangerouslySetInnerHTML={{
                    __html: new QuillDeltaToHtmlConverter(
                      JSON.parse(selectEvent?.description?.startsWith(`[{"insert":"`) ? selectEvent?.description : parseJson(selectEvent?.description))
                    ).convert(),
                  }}
                ></p>
              ),
            },
          ]}
        />
      </div>
    </motion.div>
  );
};

export default DescriptionEvent;
