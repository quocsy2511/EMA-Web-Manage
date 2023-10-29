import React from "react";
import { motion } from "framer-motion";
import { IoChevronBackSharp } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import { Avatar, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RequestDetail = ({ selectedRequest, setSelectedRequest }) => {
  const handleSelectedRequest = () => {
    setSelectedRequest();
  };

  const dummy = [1, 2, 3];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{x: "100%"}}
      transition={{ type: "tween" }}
      className="w-full h-full overflow-hidden flex flex-col"
    >
      <div className="w-full h-14 border-b px-5 flex items-center gap-x-5">
        <IoChevronBackSharp
          onClick={handleSelectedRequest}
          size={18}
          className="text-slate-500 cursor-pointer"
        />
        <p className="text-sm text-slate-500">
          Focused impactful open issues from the project of GitHub
        </p>
      </div>
      <div className="overflow-y-scroll flex-1 bg-[#f5f4f7] p-5 space-y-5">
        {dummy.map((item) => (
          <div className="w-full bg-white rounded-lg p-5">
            <div className="flex items-center gap-x-5">
              <Avatar
                size={38}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3mvt8nCdl5Z0ebV9k3Pqo-BPJYTCEdLnirA&usqp=CAU"
              />
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  Chandler Bing
                </p>
                <p className="text-xs text-slate-400">Chandler Bing</p>
              </div>
              <p className="flex-1 text-end text-xs text-slate-400">
                15 Tháng 5, 08:40
              </p>
            </div>
            <p className="pt-5">
              Greetings! It is a long established fact that a reader will be
              distracted by the readable content of a page when looking at its
              layout.The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using
              'Content here, content here',making it look like readable English.
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. Sincerely yours, Envato Design Team
            </p>
          </div>
        ))}
        <div className="w-full  bg-white rounded-lg p-5 space-y-5">
          <p className="text-sm text-slate-500 font-semibold">
            Trả lời Chandler Bing
          </p>
          <ReactQuill
            className="h-36 pb-10"
            theme="snow"
            placeholder="Nhập mô tả"
          />
          <Button
            className="flex items-center px-5 py-1 ml-auto"
            type="primary"
          >
            <LuSend />
            Gửi
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RequestDetail;
