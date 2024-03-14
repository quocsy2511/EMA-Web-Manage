import React, { Fragment, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlanByContact, importCSV } from "../../apis/planning";
import { Spin, Table, Upload, message } from "antd";
import axios from "axios";
import { URL } from "../../constants/api";
import { FiPlus } from "react-icons/fi";

const dummy = [
  {
    categoryId: "8bd94af0-a21d-4d36-809c-7e8c73edd98b",
    categoryName: "Sản xuất chương trình",
    items: [
      {
        id: "0010d068-29da-4c46-89f6-955168a2ddb1",
        createdAt: "2024-03-12T08:17:33.610Z",
        updatedAt: "2024-03-12T08:17:33.610Z",
        itemName: "Lắp đặt sân khấu",
        description: "Mô tả lắp đặt sân khấu",
        priority: 1,
        plannedAmount: 1,
        plannedPrice: 10000000,
        plannedUnit: "bộ",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "68796015-e6db-4c88-aee3-416b0e922d89",
        createdAt: "2024-03-12T10:44:45.318Z",
        updatedAt: "2024-03-12T10:44:45.318Z",
        itemName: "Hạng mục 3 ",
        description: "Diễn giải hạng mục 3",
        priority: 2,
        plannedAmount: 1,
        plannedPrice: 1000000,
        plannedUnit: "gói",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "4d672cd3-3536-4031-9869-ab916c25c510",
        createdAt: "2024-03-12T10:44:45.334Z",
        updatedAt: "2024-03-12T10:44:45.334Z",
        itemName: "Hạng mục 5 ",
        description: "Diễn giải hạng mục 5",
        priority: 3,
        plannedAmount: 5,
        plannedPrice: 1000000,
        plannedUnit: "gói",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "8ddc7d7a-a442-4078-9cba-7c2fa456e2e5",
        createdAt: "2024-03-12T10:44:45.326Z",
        updatedAt: "2024-03-12T10:44:45.326Z",
        itemName: "Hạng mục 1 ",
        description: "Diễn giải hạng mục 1",
        priority: 3,
        plannedAmount: 51,
        plannedPrice: 100000,
        plannedUnit: "gói",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "96d86ac4-82eb-4ca9-bb96-40e3febbbcd4",
        createdAt: "2024-03-12T10:44:45.342Z",
        updatedAt: "2024-03-12T10:44:45.342Z",
        itemName: "Hạng mục 7 ",
        description: "Diễn giải hạng mục 7",
        priority: 3,
        plannedAmount: 7,
        plannedPrice: 1000000,
        plannedUnit: "m2",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "1be97835-f42b-4355-9ac6-e3940312b9de",
        createdAt: "2024-03-12T10:44:45.350Z",
        updatedAt: "2024-03-12T10:44:45.350Z",
        itemName: "Hạng mục 9 ",
        description: "Diễn giải hạng mục 9",
        priority: 4,
        plannedAmount: 9,
        plannedPrice: 1000010,
        plannedUnit: "gói",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
    ],
  },
  {
    categoryId: "a7f3ba4b-cae2-42d7-892b-a52085805c7e",
    categoryName: "Các hạng mục bổ sung",
    items: [
      {
        id: "165e693c-5d25-417e-b153-b166824879a4",
        createdAt: "2024-03-12T10:44:45.358Z",
        updatedAt: "2024-03-12T10:44:45.358Z",
        itemName: "Hạng mục 2 ",
        description: "Diễn giải hạng mục 2",
        priority: 1,
        plannedAmount: 3,
        plannedPrice: 1000000,
        plannedUnit: "cái",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "81aea740-c53b-43bd-a707-ce6767ca63fc",
        createdAt: "2024-03-12T10:44:45.366Z",
        updatedAt: "2024-03-12T10:44:45.366Z",
        itemName: "Hạng mục 6 ",
        description: "Diễn giải hạng mục 6",
        priority: 1,
        plannedAmount: 1,
        plannedPrice: 1000000,
        plannedUnit: "người",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "5506eb48-c9ed-4a8d-b6f1-0ea18b68788a",
        createdAt: "2024-03-12T10:44:45.374Z",
        updatedAt: "2024-03-12T10:44:45.374Z",
        itemName: "Hạng mục 8 ",
        description: "Diễn giải hạng mục 8",
        priority: 3,
        plannedAmount: 8,
        plannedPrice: 1000010,
        plannedUnit: "cái",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "679d0415-589b-4bbb-8ab8-9b9346c5b924",
        createdAt: "2024-03-12T10:44:45.382Z",
        updatedAt: "2024-03-12T10:44:45.382Z",
        itemName: "Hạng mục 4 ",
        description: "Diễn giải hạng mục 4",
        priority: 4,
        plannedAmount: 4,
        plannedPrice: 1000000,
        plannedUnit: "cái",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
      {
        id: "b92ebc13-f10a-46dc-a8c9-491fc5c0401c",
        createdAt: "2024-03-12T10:44:45.390Z",
        updatedAt: "2024-03-12T10:44:45.390Z",
        itemName: "Hạng mục 10 ",
        description: "Diễn giải hạng mục 10",
        priority: 5,
        plannedAmount: 1,
        plannedPrice: 1000010,
        plannedUnit: "bộ",
        createdBy: "fd1e0139-39fa-46bb-bd51-e60d20ee8be9",
        updatedBy: null,
      },
    ],
  },
];

const PlanningPage = () => {
  const location = useLocation();
  console.log("location > ", location); //contactId

  const [messageApi, contextHolder] = message.useMessage();

  // const [importFileIsLoading, setImportFileIsLoading] = useState(false);

  useEffect(() => {
    mergeValue.clear();
  }, []);

  const {
    data: planningData,
    isLoading: planningIsLoading,
    isError: planningIsError,
  } = useQuery(
    ["planning", location.state?.contactId],
    () => getPlanByContact(location.state?.contactId),
    {
      select: (data) => {
        return data;
      },
    }
  );
  console.log("planningData > ", planningData);

  const { mutate: importFileMutate, isLoading: importFileIsLoading } =
    useMutation((formData) => importCSV(formData), {
      onSuccess: (data) => {
        console.log("import success > ", data);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const transformDataToTable = (data) =>
    data
      ?.map((category) =>
        category?.items?.map((item) => ({
          key: category?.categoryId + item?.id,
          categoryId: category?.categoryId,
          categoryName: category?.categoryName,
          itemId: item?.id,
          itemName: item?.itemName,
          itemDescription: item?.description,
          itemPriority: item?.priority,
          itemPlannedUnit: item?.plannedUnit,
          itemPlannedAmount: item?.plannedAmount,
          itemPlannedPrice: item?.plannedPrice,
        }))
      )
      .flat();

  console.log("transform > ", transformDataToTable(dummy));

  const clickButton = async () => {
    try {
      const response = await axios.get(`${URL}/items/download-template`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });
      console.log("response > ", response);

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading template:", error);
    } finally {
      console.log("Finissh");
    }
  };

  const mergeValue = new Set();

  const columns = [
    {
      title: "Loại hạng mục",
      dataIndex: "categoryName",
      onCell: (record, index) => {
        if (mergeValue.has(record?.categoryId)) {
          return { rowSpan: 0 };
        } else {
          const rowCount = transformDataToTable(dummy).filter(
            (data) => data.categoryId === record?.categoryId
          ).length;
          mergeValue.add(record?.categoryId);
          return { rowSpan: rowCount };
        }
        return {};
      },
    },
    {
      title: "Hạng mục",
      dataIndex: "itemName",
    },
    {
      title: "Diễn giải",
      dataIndex: "itemDescription",
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "itemPriority",
    },
    {
      title: "Đơn vị tính",
      dataIndex: "itemPlannedUnit",
    },
    {
      title: "Số lượng",
      dataIndex: "itemPlannedAmount",
    },
    {
      title: "Đơn giá",
      dataIndex: "itemPlannedPrice",
    },
  ];

  return (
    <Fragment>
      {contextHolder}

      <motion.div
        initial={{ x: -75 }}
        animate={{ x: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to=".." relative="path">
            Thông tin khách hàng{" "}
          </Link>
          / Lên kế hoạch
        </p>
      </motion.div>

      <motion.div initial={{ x: -75 }} animate={{ x: 0 }} className="mt-10">
        <h1 className="text-3xl font-medium">
          Lên kế hoạch cho hợp đồng (Tải file CSV và đưa lên hệ thống)
        </h1>

        <div className="flex items-center space-x-10 mt-12">
          <p className="w-[15%] text-lg font-medium">Tải tệp CSV: </p>

          <p
            // onClick={refetch}
            onClick={clickButton}
            className="text-lg font-medium bg-blue-500 text-white px-7 py-3 rounded-md cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-black/30"
          >
            Nhấn để tải bản mẫu
          </p>
        </div>

        <div className="flex items-center space-x-10 mt-12">
          <p className="w-[15%] text-lg font-medium">Tệp đã cập nhật: </p>

          <a className="text-lg font-medium cursor-pointer text-slate-400 hover:text-blue-500 transition-colors">
            bản kế hoạch của sự kiện.pdf
          </a>
        </div>

        <div className="mt-10">
          <Spin spinning={importFileIsLoading}>
            <Upload
              className="flex items-center justify-center space-x-3 mt-[5%]"
              maxCount={1}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              showUploadList={false}
              beforeUpload={(file) => {
                console.log("beforeUpload > ", file);
              }}
              accept=".csv"
              onChange={(info) => {
                console.log("TODO", info);
                console.log("TODO", info?.file);
                console.log("TODO", info?.file?.originFileObj);
                const formData = new FormData();
                formData.append("file", info?.file?.originFileObj);
                // formData.append("folderName", "task");
                console.log("formData > ", formData);
                // importFileMutate(formData);
              }}
            >
              <div className="flex items-center space-x-3 border-dashed border-2 border-slate-400 rounded-lg px-10 py-5 group hover:border-black transition-colors">
                <FiPlus className="text-2xl text-slate-400 group-hover:text-black transition-colors" />
                <p className="text-xl text-slate-400 group-hover:text-black transition-colors">
                  Kéo tệp CSV vào đây
                </p>
              </div>
            </Upload>
          </Spin>
          {/* <Table
            columns={columns}
            dataSource={transformDataToTable(dummy)}
            bordered
          /> */}
        </div>
      </motion.div>
    </Fragment>
  );
};

export default memo(PlanningPage);
