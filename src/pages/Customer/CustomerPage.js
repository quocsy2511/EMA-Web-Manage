import React, { Fragment, memo, useEffect, useState } from "react";
import { FloatButton, Popover, Select, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerContacts,
  updateCustomerContacts,
} from "../../apis/contact";
import momenttz from "moment-timezone";
import { AnimatePresence, motion } from "framer-motion";
import { GrAscend, GrDescend } from "react-icons/gr";
import { GoPerson, GoMail, GoCalendar, GoLocation } from "react-icons/go";
import { LuSmartphone } from "react-icons/lu";
import {
  LiaCalendarDaySolid,
  LiaCalendarCheckSolid,
  LiaMoneyBillSolid,
} from "react-icons/lia";
import { TbCategory } from "react-icons/tb";
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5";
import {
  MdOutlineNewLabel,
  MdOutlinePending,
  MdCheckCircleOutline,
} from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import LoadingItemIndicator from "../../components/Indicator/LoadingItemIndicator";
import LoadingComponentIndicator from "../../components/Indicator/LoadingComponentIndicator";
import ContactUpdateModal from "../../components/Modal/ContactUpdateModal";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const ContactItem = memo(({ customer, setSelectedContact }) => {
  const handleSelectedContact = () => {
    setSelectedContact(customer);
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={handleSelectedContact}
      className="px-6 py-4 border-y border-black/50 shadow-lg shadow-slate-300 cursor-pointer relative"
    >
      <div className="absolute top-2 right-2">
        {customer.status === "PENDING" ? (
          <MdOutlinePending className={clsx("text-2xl text-orange-300")} />
        ) : customer.status === "ACCEPTED" ? (
          <MdCheckCircleOutline className={clsx("text-2xl text-green-400")} />
        ) : (
          <IoMdCloseCircleOutline className={clsx("text-2xl text-red-600")} />
        )}
      </div>
      <p className="flex items-center text-base truncate">
        <GoPerson className="text-xl mr-4 text-blue-500" /> Tên khách hàng -{" "}
        {customer?.fullName}
      </p>
      <p className="flex items-center text-base truncate">
        <GoMail className="text-xl mr-4 text-orange-500" /> Email -{" "}
        {customer?.email}
      </p>
      <p className="flex items-center text-base truncate">
        <LuSmartphone className="text-xl mr-4 text-sky-400" /> SĐT -{" "}
        {customer?.phoneNumber}
      </p>
      <div className="flex justify-end">
        <Popover
          className="flex w-fit text-right space-x-2 justify-end items-center text-xs"
          content="Ngày gửi"
        >
          <GoCalendar />{" "}
          <p>{momenttz(customer?.createdAt).format("DD/MM/YYYY")}</p>
        </Popover>
      </div>
    </motion.div>
  );
});

const CustomerPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("DESC");
  const [contactStatus, setContactStatus] = useState("ALL");
  const [selectedContact, setSelectedContact] = useState();
  const [loadContact, setloadContact] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: contacts,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["contact", currentPage, sort, contactStatus],
    () => getCustomerContacts({ currentPage, sort, status: contactStatus }),
    {
      refetchOnWindowFocus: false,
    }
  );
  console.log("contacts > ", contacts);

  const queryClient = useQueryClient();
  const { mutate, isLoading: updateIsLoading } = useMutation(
    ({ contactId, status, rejectNote }) =>
      updateCustomerContacts({ contactId, status, rejectNote }),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "contact",
          currentPage,
          sort,
          contactStatus,
        ]);

        messageApi.open({
          type: "success",
          content:
            variables.status === "ACCEPTED"
              ? "Chấp nhận 1 sự kiện từ khách hàng thành công"
              : "Đã từ chối 1 sự kiện từ khách hàng",
        });
        setSelectedContact();
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [currentPage, sort, contactStatus]);

  useEffect(() => {
    let identifier;
    if (selectedContact) {
      setloadContact(true);
      identifier = setTimeout(() => {
        setloadContact(false);
      }, 800);
    }

    return () => {
      if (identifier) clearTimeout(identifier);
    };
  }, [selectedContact]);

  const handleUpdateContact = (contactId, status, rejectNote) => {
    console.log(contactId, status, rejectNote);
    mutate({
      contactId,
      status,
      rejectNote: rejectNote ? rejectNote : undefined,
    });
  };

  const goToCreateEventPage = () => {
    navigate("addition", {
      state: {
        contactId: selectedContact.id,
        eventType: selectedContact.eventType.id,
      },
    });
  };

  const handleLoadMore = () => {
    if (currentPage < contacts.lastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Fragment>
      {contextHolder}
      <Popover content="Tạo mới sự kiện">
        <FloatButton
          type="primary"
          onClick={() => navigate("addition")}
          style={{ right: "5%" }}
          icon={<MdOutlineNewLabel className="scale-110" />}
        />
      </Popover>

      <ContactUpdateModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleUpdateContact={handleUpdateContact}
        selectedContactId={selectedContact?.id}
        updateIsLoading={updateIsLoading}
      />

      <div className="flex w-full h-[calc(100vh-64px-6rem)] bg-white rounded-lg shadow-xl">
        <div className="w-[30%] flex flex-col border-r-2 border-black/20">
          <p className="text-2xl font-semibold p-5">Thông tin khách hàng</p>
          <div className="flex justify-between items-center px-5">
            <Select
              className="w-[50%]"
              defaultValue={contactStatus}
              onChange={(value) => {
                setContactStatus(value);
              }}
              options={[
                {
                  value: "ALL",
                  label: <p className="font-semibold">Tất Cả</p>,
                },
                {
                  value: "PENDING",
                  label: <p className="font-semibold">Chờ Duyệt</p>,
                },
                {
                  value: "ACCEPTED",
                  label: <p className="font-semibold">Đã Chấp Nhận</p>,
                },
                {
                  value: "REJECTED",
                  label: <p className="font-semibold">Đã Từ Chối</p>,
                },
              ]}
            />

            <AnimatePresence mode="wait">
              {sort === "DESC" ? (
                <motion.div
                  key="desc"
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Popover content="Sắp xếp giảm dần theo ngày gửi">
                    <GrAscend
                      className="text-xl cursor-pointer"
                      onClick={() => setSort("ASC")}
                    />
                  </Popover>
                </motion.div>
              ) : (
                <motion.div
                  key="desc"
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Popover content="Sắp xếp tăng dần theo ngày gửi">
                    <GrDescend
                      className="text-xl cursor-pointer"
                      onClick={() => setSort("DESC")}
                    />
                  </Popover>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 space-y-7 overflow-y-scroll scrollbar-hide mt-5 pb-10 pt-5">
            {isLoading ? (
              <LoadingComponentIndicator />
            ) : isError ? (
              <p className="text-xl font-semibold text-center">
                Không thể lấy dữ liệu
              </p>
            ) : contacts?.data.length === 0 ? (
              <p className="flex justify-center items-center h-full text-lg font-medium">
                Không có thông tin
              </p>
            ) : (
              contacts?.data?.map((contact) => {
                return (
                  <ContactItem
                    customer={contact}
                    setSelectedContact={setSelectedContact}
                    key={contact?.id}
                  />
                );
              })
            )}

            {contacts?.nextPage && (
              <p
                className="text-center text-lag cursor-pointer"
                onClick={handleLoadMore}
              >
                Tải tiếp
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 bg-[#ffffff]">
          {loadContact ? (
            <LoadingItemIndicator />
          ) : selectedContact ? (
            <div className="flex flex-col w-full h-full px-10 py-5">
              <p className="text-2xl font-semibold text-center">
                Thông tin sự kiện
              </p>
              <div className="flex items-center text-lg mt-14">
                <div className="flex items-center w-[25%] font-semibold space-x-2 border-b border-black/30">
                  <GoLocation />
                  <p>Địa điểm</p>
                </div>
                <p className="w-fit border-b border-black/30 truncate">
                  {selectedContact?.address}
                </p>
              </div>

              <div className="flex mt-10">
                <div className="flex items-center text-lg w-[40%]">
                  <div className="flex items-center font-semibold space-x-2 border-b border-black/30 pr-3">
                    <LiaCalendarDaySolid />
                    <p>Bắt đầu</p>
                  </div>
                  <p className="w-fit border-b border-black/30">
                    {momenttz(selectedContact?.startDate).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="flex items-center text-lg w-[40%]">
                  <div className="flex items-center font-semibold space-x-2 border-b border-black/30 pr-3">
                    <LiaCalendarCheckSolid />
                    <p>Kết thúc</p>
                  </div>
                  <p className="w-fit border-b border-black/30">
                    {momenttz(selectedContact?.endDate).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-lg mt-10">
                <div className="flex items-center w-[25%] font-semibold space-x-2 border-b border-black/30">
                  <LiaMoneyBillSolid />
                  <p>Ngân sách ước tính</p>
                </div>
                <p className="w-fit border-b border-black/30">
                  {selectedContact?.budget?.toLocaleString("en-US") ?? 100000}{" "}
                  VNĐ
                </p>
              </div>

              <div className="flex items-center text-lg mt-10">
                <div className="flex items-center w-[25%] font-semibold space-x-2 border-b border-black/30">
                  <TbCategory />
                  <p>Loại sự kiện</p>
                </div>
                <p className="w-fit border-b border-black/30">
                  {selectedContact?.eventType.typeName ?? "event"}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-end items-end">
                {selectedContact?.status === "ACCEPTED" && (
                  <div className="bg-white h-full flex items-end">
                    <div className="flex space-x-5 mt-10">
                      <motion.button
                        whileHover={{ y: -5 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center rounded-full overflow-hidden space-x-3 bg-white shadow-md shadow-slate-400"
                      >
                        <div className="py-3 pl-5 pr-3 bg-red-500">
                          <IoCloseCircleSharp className="text-white text-2xl" />
                        </div>
                        <p className="py-3 pr-6 text-base font-medium">
                          Từ chối
                        </p>
                      </motion.button>
                      <motion.button
                        onClick={goToCreateEventPage}
                        whileHover={{ y: -5 }}
                        className="flex h-fit items-center rounded-full overflow-hidden space-x-3 bg-white shadow-md shadow-slate-400"
                      >
                        <div className="py-3 pl-5 pr-3 bg-blue-500">
                          <IoCloseCircleSharp className="text-white text-2xl" />
                        </div>
                        <p className="py-3 pr-6 text-base font-medium">
                          Tạo sự kiện
                        </p>
                      </motion.button>
                    </div>
                  </div>
                )}

                <div className="flex h-full space-x-5 justify-end items-center">
                  {selectedContact?.status === "PENDING" && (
                    <div className="flex space-x-5">
                      <motion.button
                        whileHover={{ y: -5 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center rounded-full overflow-hidden space-x-3 bg-white shadow-md shadow-slate-400"
                      >
                        <div className="py-3 pl-5 pr-3 bg-red-500">
                          <IoCloseCircleSharp className="text-white text-2xl" />
                        </div>
                        <p className="py-3 pr-6 text-base font-medium">
                          Từ chối
                        </p>
                      </motion.button>

                      <motion.button
                        whileHover={{ y: -5 }}
                        onClick={() =>
                          handleUpdateContact(selectedContact?.id, "ACCEPTED")
                        }
                        className="flex items-center rounded-full overflow-hidden space-x-3 bg-white shadow-md shadow-slate-400"
                      >
                        <p className="py-3 pl-6 pr- text-base font-medium">
                          Chấp thuận
                        </p>
                        <div className="py-3 pr-5 pl-3 bg-success">
                          <IoCheckmarkCircle className="text-white text-2xl" />
                        </div>
                      </motion.button>
                    </div>
                  )}

                  {/* 
                  {selectedContact?.status !== "ACCEPTED" && (
                    <motion.button
                      whileHover={{ y: -5 }}
                      onClick={() =>
                        handleUpdateContact(selectedContact?.id, "ACCEPTED")
                      }
                      className="flex items-center rounded-full overflow-hidden space-x-3 bg-white shadow-md shadow-slate-400"
                    >
                      <p className="py-3 pl-6 pr- text-base font-medium">
                        Chấp thuận
                      </p>
                      <div className="py-3 pr-5 pl-3 bg-success">
                        <IoCheckmarkCircle className="text-white text-2xl" />
                      </div>
                    </motion.button>
                  )} */}
                </div>
              </div>
            </div>
          ) : (
            <p className="flex flex-col min-h-full items-center justify-center text-xl">
              Chọn thông tin cần kiểm tra
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default memo(CustomerPage);
