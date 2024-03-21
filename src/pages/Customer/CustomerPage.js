import React, { Fragment, memo, useEffect, useState } from "react";
import {
  Button,
  Empty,
  FloatButton,
  Popconfirm,
  Popover,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerContacts,
  updateCustomerContacts,
} from "../../apis/contact";
import momenttz from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { motion } from "framer-motion";
import ContactTab from "./ContactTab";
import ContractTab from "./ContractTab";
import { getContractFile } from "../../apis/contract";

const CustomerPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("DESC");
  const [contactStatus, setContactStatus] = useState("ALL");

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: contacts,
    isLoading: contactsIsLoading,
    isError: contactsIsError,
  } = useQuery(
    ["contact", currentPage, sort, contactStatus, 50],
    () =>
      getCustomerContacts({
        currentPage,
        sort,
        status: contactStatus,
        sizePage: 50,
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
          onChange={(key) => {
            console.log(key);
          }}
        />
      </motion.div>
    </Fragment>
  );
};

export default memo(CustomerPage);
