import React from "react";
import emptyComment from "../../assets/images/empty_comment.png";

const EmptyComment = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center">
      <img className="w-[30%] h-[30%]" src={emptyComment} />
      <p className="text-lg font-medium">Chưa có bình luận nào</p>
    </div>
  );
};

export default EmptyComment;
