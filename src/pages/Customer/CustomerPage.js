import React, { Fragment, memo, useEffect, useState } from "react";
import { Tabs, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomerContacts } from "../../apis/contact";

import { MdOutlineConnectWithoutContact } from "react-icons/md";

import { motion } from "framer-motion";
import ContactTab from "./ContactTab";
import { getContractFile } from "../../apis/contract";
import { socketOnNotification } from "../../utils/socket";
import { useLocation } from "react-router-dom";

const CustomerPage = () => {
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("DESC");
  const [contactStatus, setContactStatus] = useState(
    location.state?.isNavigate
      ? "ALL"
      : location.state?.isSuccess
      ? "ACCEPTED"
      : "PENDING"
  );

  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();

  useEffect(() => {
    socketOnNotification(handleRefetchContact);
    document.title = "Trang khách hàng";
  }, []);

  const handleRefetchContact = (notification) => {
    if (notification?.type === "CONTRACT") {
      queryClient.invalidateQueries([
        "contact",
        currentPage,
        sort,
        contactStatus,
        20,
      ]);
      queryClient.invalidateQueries(["contracts"]);
    }
  };

  const {
    data: contacts,
    isLoading: contactsIsLoading,
    isError: contactsIsError,
  } = useQuery(
    ["contact", currentPage, sort, contactStatus, 20],
    () =>
      getCustomerContacts({
        currentPage,
        sort,
        status: contactStatus,
        sizePage: 20,
      }),
    {
      select: (data) => data?.data,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: contracts,
    isLoading: contractsIsLoading,
    isError: contractsIsError,
  } = useQuery(["contracts"], getContractFile, {
    select: (data) => {
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <Fragment>
      {contextHolder}

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Tabs
          size="large"
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: (
                <p className="flex items-center text-xl">
                  <MdOutlineConnectWithoutContact className="mr-2" /> Liên Hệ
                </p>
              ),
              children: (
                <ContactTab
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  sort={sort}
                  setSort={setSort}
                  contactStatus={contactStatus}
                  setContactStatus={setContactStatus}
                  contacts={contacts}
                  contactsIsLoading={contactsIsLoading}
                  contactsIsError={contactsIsError}
                  contracts={contracts}
                  contractsIsLoading={contractsIsLoading}
                  contractsIsError={contractsIsError}
                  messageApi={messageApi}
                />
              ),
            },
            // {
            //   key: "2",
            //   label: (
            //     <p className="flex items-center text-xl">
            //       <FaRegNoteSticky className="mr-2" /> Kế Hoạch
            //     </p>
            //   ),
            //   children: "Content of Tab Pane 2",
            // },
            // {
            //   key: "3",
            //   label: (
            //     <p className="flex items-center text-xl">
            //       <FaRegAddressBook className="mr-2" /> Hợp Đồng
            //     </p>
            //   ),
            //   children: (
            //     <ContractTab
            //       contracts={contracts}
            //       contractsIsLoading={contractsIsLoading}
            //       contractsIsError={contractsIsError}
            //     />
            //   ),
            // },
          ]}
          onChange={(key) => {}}
        />
      </motion.div>
    </Fragment>
  );
};

export default memo(CustomerPage);
