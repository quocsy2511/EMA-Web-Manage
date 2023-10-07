import { Avatar, Input } from "antd";
import React, { useRef, useState } from "react";
import { IoMdAttach, IoIosSend } from "react-icons/io";
import { motion } from "framer-motion";

const CommentInTask = ({ isSubtask }) => {
  const [comments, setComments] = useState([1, 2]);
  const inputRef = useRef(null);

  const onEnterComment = (value) => {
    console.log(value.nativeEvent.target.value);
    inputRef.current.input.value = null;
  };

  return (
    <>
      <div className={`flex items-center gap-x-3 ${!isSubtask && 'mr-12'}`}>
        <Avatar
          size={40}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
        />
        <Input
          ref={inputRef}
          placeholder="Nhập bình luận"
          onPressEnter={onEnterComment}
          size="large"
          allowClear
        />
        <IoMdAttach className="cursor-pointer" size={25} />

        {/* Attachment */}
        <div></div>
      </div>

      <div className="ml-12 mt-8">
        {comments.map((comment) => (
          <div className="space-y-3 mb-7">
            <div className="flex gap-x-3">
              <Avatar
                size={25}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
              />
              <p className="text-base">
                <span className="font-bold">Vu</span> đã bình luận vào ... lúc
                ...
              </p>
            </div>

            <p className="text-sm ml-3">• Làm việc chưa xong đi chơi cc</p>

            <div className="flex gap-x-3 text-sm font-bold ml-3">
              <motion.p whileHover={{ y: -2 }} className="cursor-pointer">
                Chỉnh sửa
              </motion.p>
              <motion.p whileHover={{ y: -2 }} className="cursor-pointer">
                Xóa
              </motion.p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentInTask;
