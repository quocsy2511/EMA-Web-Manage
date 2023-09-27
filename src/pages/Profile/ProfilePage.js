import { Avatar } from "antd";
import React, { Fragment } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";

const ProfilePage = () => {
  const dummy = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <Fragment>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#F0F6FF] p-4 flex space-x-5">
        <div className="flex flex-col items-center bg-white w-1/4 p-6 rounded-2xl h-full">
          <div
            className="border-[#ED2590] rounded-full bg-white"
            style={{ borderWidth: 3 }}
          >
            <Avatar
              // size={150}
              alt="user_image"
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
              }
              className="w-32 h-32 m-0.5"
            />
          </div>

          <p className="text-base font-semibold mt-4">User name</p>
          <p className="text-sm font-normal text-slate-500 my-2">Chi nhánh</p>
          <p className="text-sm font-normal text-slate-500 mb-4">Việt Nam</p>

          <div className="w-full h-0.5 bg-slate-100" />
        </div>
        <div className="bg-white w-1/2 p-6 rounded-2xl">
          <div className="flex items-center text-slate-500">
            <p className="text-sm"> User name </p>
            <MdArrowForwardIos className="mx-2" />
            <p className="text-sm">Hồ sơ</p>
          </div>

          <div className="mt-5">
            <p className="text-2xl font-bold">Quản lý</p>
            <p className="text-sm bg-[#F0F6FF] py-2 px-4 mt-2 rounded-xl">
              Bạn đã giữ chức vụ quản lý trong 3 năm
            </p>
          </div>

          <div className="mt-12">
            <p className="text-lg font-semibold">
              Đã từng làm việc với Staff ( Bộ phận )
            </p>
            <div className="flex flex-wrap justify-between pt-8">
              {dummy.map((item) => (
                <div className="flex flex-col items-center w-[25%] mb-6">
                  <Avatar
                    size={70}
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
                    }
                  />
                  <p className="text-base font-medium mt-1">Vu</p>
                  <p className="text-xs text-slate-500">Thiết kế</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white flex-1 p-6 rounded-2xl h-full">
          <p className="text-lg font-semibold">Sự kiện</p>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfilePage;
