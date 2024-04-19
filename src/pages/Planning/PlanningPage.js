import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  FloatButton,
  Popconfirm,
  Spin,
  Table,
  Upload,
  message,
} from "antd";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";
import React, { Fragment, memo, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getPlanByContact,
  importCSV,
  postPlan,
  replacePlan,
} from "../../apis/planning";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";
import { URL } from "../../constants/api";
import moment from "moment";

const PlanningPage = () => {
  const location = useLocation();
  const contactId = location.state?.contactId;
  const eventType = location.state?.eventType;
  const hasContract = location.state?.hasContract;
  const readOnly = location.state?.readOnly;

  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [chosenImportCSV, setChosenImportCSV] = useState();
  const [tableData, setTableData] = useState();

  const mergeValue = new Set();
  const mergeImportValue = new Set();

  useEffect(() => {
    mergeValue.clear();
    mergeImportValue.clear();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle import CVS
  useEffect(() => {
    if (chosenImportCSV) {
      const formData = new FormData();
      formData.append("file", chosenImportCSV);
      importFileMutate(formData);
    }
  }, [chosenImportCSV]);

  const {
    data: planningData,
    isLoading: planningIsLoading,
    isError: planningIsError,
  } = useQuery(["planning", contactId], () => getPlanByContact(contactId), {
    select: (data) => {
      console.log("🚀 ~ PlanningPage ~ data:", data);
      return data?.plan
        ?.map((category) =>
          category?.items?.map((item, index) => ({
            key: category?.categoryName + index,

            categoryName: category?.categoryName, //
            itemName: item?.itemName,
            itemDescription: item?.description,
            itemPriority: item?.priority,
            itemPlannedUnit: item?.plannedUnit, //
            itemPlannedAmount: item?.plannedAmount,
            itemPlannedPrice: item?.plannedPrice,
            itemPlannedStartDate: item?.plannedStartDate,
            itemPlannedEndDate: item?.plannedEndDate,
          }))
        )
        .flat();
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: importFileMutate, isLoading: importFileIsLoading } =
    useMutation((formData) => importCSV(formData), {
      onSuccess: (data) => {
        const tableData = {
          success: data?.Success?.map((category) =>
            category?.items?.map((item, index) => {
              console.log("🚀 ~ category?.items?.map ~ item:", item);

              return {
                key: category?.categoryName + index,
                categoryName: category?.categoryName, //
                itemName: item?.itemName,
                itemDescription: item?.description,
                itemPriority: item?.priority,
                itemPlannedUnit: item?.plannedUnit, //
                itemPlannedAmount: item?.plannedAmount,
                itemPlannedPrice: item?.plannedPrice,
                itemPlannedStartDate: item?.plannedStartDate,
                itemPlannedEndDate: item?.plannedEndDate,
              };
            })
          ).flat(),
          error: data?.Errors,

          TotalRecords: data?.TotalRecords,
          TotalSuccessRecords: data?.TotalSuccessRecords,
          TotalErrorsRecords: data?.TotalErrorsRecords,

          payload: data?.Success,
        };

        setTableData(tableData);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const queryClient = useQueryClient();
  const { mutate: postPlanMutate, isLoading: postPlanIsLoading } = useMutation(
    (data) => postPlan(contactId, data),
    {
      onSuccess: (data) => {
        // navigate(-1);
        messageApi.open({
          type: "success",
          content: "Đã tạo bản kế hoạch thành công.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTableData();
        queryClient.invalidateQueries(["planning", contactId]);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: replacePlanMutate, isLoading: replacePlanIsLoading } =
    useMutation((data) => replacePlan(contactId, data), {
      onSuccess: (data) => {
        // navigate(-1);
        messageApi.open({
          type: "success",
          content: "Đã sửa đổi bản kế hoạch thành công.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTableData();
        queryClient.invalidateQueries(["planning", contactId]);
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  const handleGetCSVFile = async () => {
    try {
      const response = await axios.get(
        `${URL}/items/download-template?eventTypeId=${eventType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const a = document.createElement("a");
      a.href = response?.data?.result;
      a.download = "template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(response?.data?.result);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading template:", error);
      messageApi.open({
        type: "error",
        content: "Không thể tải tệp tin lúc này! Hãy thử lại sau",
      });
    } finally {
    }
  };

  const handleExportCSVFile = async () => {
    try {
      const response = await axios.get(
        `${URL}/items/export-plan?customerContactId=${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

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
      messageApi.open({
        type: "error",
        content: "Không thể tải tệp tin lúc này! Hãy thử lại sau",
      });
    } finally {
    }
  };

  const handlePostPlan = () => {
    if (!planningData?.length) {
      postPlanMutate(tableData?.payload);
    } else {
      replacePlanMutate(tableData?.payload);
    }
  };

  const goToCreateContractPage = () => {
    navigate("contract", {
      state: {
        contactId,
        hasContract,
        readOnly,
        // totalContract: planningData?.reduce((total, item) => {
        //   return total + item?.itemPlannedAmount * item?.itemPlannedPrice;
        // }, 0),
        totalContract:
          planningData?.reduce((total, item) => {
            return total + item?.itemPlannedAmount * item?.itemPlannedPrice;
          }, 0) +
          planningData?.reduce((total, item) => {
            return total + item?.itemPlannedAmount * item?.itemPlannedPrice;
          }, 0) *
            0.05 +
          (planningData?.reduce((total, item) => {
            return total + item?.itemPlannedAmount * item?.itemPlannedPrice;
          }, 0) *
            0.05 +
            planningData?.reduce((total, item) => {
              return total + item?.itemPlannedAmount * item?.itemPlannedPrice;
            }, 0)) *
            0.1,
      },
    });
  };

  return (
    <Fragment>
      {contextHolder}

      <LockLoadingModal
        isModalOpen={postPlanIsLoading}
        label="Đang tạo bản kế hoạch và gửi cho khách hàng ..."
      />

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

        {!readOnly && (
          <>
            <div className="flex items-center space-x-10 mt-12">
              <p className="w-[15%] text-lg font-medium">Tải tệp CSV: </p>

              <p
                onClick={handleGetCSVFile}
                className="text-lg font-medium bg-blue-500 text-white px-7 py-3 rounded-md cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-black/30"
              >
                Nhấn để tải bản mẫu
              </p>
            </div>

            <div className="flex items-center space-x-10 mt-12">
              <p className="w-[15%] text-lg font-medium">Tệp đã cập nhật: </p>

              {planningIsError ? (
                <p className="text-center text-slate-400 text-base font-medium">
                  Không thể lấy thông tin kế hoạch! Hãy thử lại sau
                </p>
              ) : !planningData?.length ? (
                <p className="text-center text-slate-400 text-base font-medium">
                  Chưa có thông tin kế hoạch
                </p>
              ) : (
                <p
                  onClick={handleExportCSVFile}
                  className="text-lg font-medium bg-blue-500 text-white px-7 py-3 rounded-md cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-black/30"
                >
                  Nhấn để tải bản kế hoạch đã cập nhật
                </p>
              )}
            </div>
          </>
        )}

        <div className="mt-10">
          <div className="mb-10 pb-10 border-b border-slate-300/50">
            <div className="flex items-center space-x-10">
              <p className="w-[15%] text-lg font-medium">Bảng kế hoạch</p>
              {planningIsError ? (
                <p className="text-center text-slate-400 text-base font-medium">
                  Không thể lấy thông tin kế hoạch! Hãy thử lại sau
                </p>
              ) : (
                !planningData?.length && (
                  <p className="text-center text-slate-400 text-base font-medium">
                    Chưa có thông tin kế hoạch
                  </p>
                )
              )}
            </div>

            {planningIsLoading && (
              <div className="flex flex-col items-center justify-center space-y-5">
                <Spin size="large" />
                <p className="text-lg font-medium">Đang tải bản kế hoạch ...</p>
              </div>
            )}

            <div
              className={clsx(
                "mt-5",
                {
                  "h-0 opacity-0": !planningData?.length,
                },
                {
                  "h-full opacity-100": !!planningData?.length,
                }
              )}
            >
              <Table
                ghost
                columns={[
                  {
                    title: "Loại hạng mục",
                    dataIndex: "categoryName",
                    onCell: (record, index) => {
                      if (mergeValue.has(record?.categoryName)) {
                        return { rowSpan: 0 };
                      } else {
                        const rowCount = planningData?.filter(
                          (data) => data?.categoryName === record?.categoryName
                        ).length;
                        mergeValue.add(record?.categoryName);
                        return { rowSpan: rowCount };
                      }
                    },
                    width: "12%",
                  },
                  {
                    title: "Hạng mục",
                    dataIndex: "itemName",
                    width: "15%",
                    render: (text) => <p className="line-clamp-2">{text}</p>,
                  },
                  {
                    title: "Diễn giải",
                    dataIndex: "itemDescription",
                    width: "25%",
                    render: (text) => <p className="line-clamp-4">{text}</p>,
                  },
                  {
                    title: "Độ ưu tiên",
                    dataIndex: "itemPriority",
                    align: "center",
                  },
                  {
                    title: "Đơn vị tính",
                    dataIndex: "itemPlannedUnit",
                    align: "center",
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "itemPlannedAmount",
                    align: "center",
                  },
                  {
                    title: "Ngày bắt đầu",
                    width: "10%",
                    dataIndex: "itemPlannedStartDate",
                    align: "center",
                    render: (text) => (
                      <p className="line-clamp-4">
                        {moment(text).format("DD/MM/YYYY")}
                      </p>
                    ),
                  },
                  {
                    title: "Ngày kết thúc",
                    width: "10%",
                    dataIndex: "itemPlannedEndDate",
                    align: "center",
                    render: (text) => (
                      <p className="line-clamp-4">
                        {moment(text).format("DD/MM/YYYY")}
                      </p>
                    ),
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "itemPlannedPrice",
                    render: (text) => (
                      <p className="line-clamp-4">
                        {text?.toLocaleString()} VNĐ
                      </p>
                    ),
                    align: "center",
                  },
                  {
                    title: "Tổng cộng",
                    dataIndex: "",
                    render: (text, record, index) => (
                      <p className="line-clamp-4">
                        {(
                          record?.itemPlannedAmount * record?.itemPlannedPrice
                        )?.toLocaleString()}{" "}
                        VNĐ
                      </p>
                    ),
                    align: "center",
                  },
                ]}
                dataSource={planningData}
                bordered
                pagination={false}
              />

              <p className="text-right text-lg mt-5">
                Tổng cộng :{" "}
                <span className="text-3xl font-semibold">
                  {planningData
                    ?.reduce((total, item) => {
                      return (
                        total + item?.itemPlannedAmount * item?.itemPlannedPrice
                      );
                    }, 0)
                    .toLocaleString()}{" "}
                  VNĐ
                </span>
              </p>
              <p className="text-right text-lg mt-5">
                Dự phòng (5%):{" "}
                <span className="text-3xl font-semibold">
                  {(
                    planningData?.reduce((total, item) => {
                      return (
                        total + item?.itemPlannedAmount * item?.itemPlannedPrice
                      );
                    }, 0) * 0.05
                  ).toLocaleString()}{" "}
                  VNĐ
                </span>
              </p>
              <p className="text-right text-lg mt-5">
                VAT (10%):{" "}
                <span className="text-3xl font-semibold">
                  {(
                    (planningData?.reduce((total, item) => {
                      return (
                        total + item?.itemPlannedAmount * item?.itemPlannedPrice
                      );
                    }, 0) *
                      0.05 +
                      planningData?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0)) *
                    0.1
                  ).toLocaleString()}{" "}
                  VNĐ
                </span>
              </p>
              <p className="text-right text-lg mt-5">
                Thành tiền:{" "}
                <span className="text-3xl font-semibold">
                  {(
                    planningData?.reduce((total, item) => {
                      return (
                        total + item?.itemPlannedAmount * item?.itemPlannedPrice
                      );
                    }, 0) +
                    planningData?.reduce((total, item) => {
                      return (
                        total + item?.itemPlannedAmount * item?.itemPlannedPrice
                      );
                    }, 0) *
                      0.05 +
                    (planningData?.reduce((total, item) => {
                      return (
                        total + item?.itemPlannedAmount * item?.itemPlannedPrice
                      );
                    }, 0) *
                      0.05 +
                      planningData?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0)) *
                      0.1
                  )?.toLocaleString() || 0}{" "}
                  VNĐ
                </span>
              </p>
            </div>

            {!planningIsLoading &&
              !planningIsError &&
              !!planningData?.length && (
                <p
                  onClick={goToCreateContractPage}
                  className="text-center text-lg font-medium bg-blue-500 text-white px-7 py-3 mt-8 mx-[40%] rounded-md cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-black/30"
                >
                  {readOnly ? "Xem hợp đồng" : "Tạo hợp đồng"}
                </p>
              )}
          </div>

          {!readOnly && (
            <Spin spinning={importFileIsLoading}>
              {!!planningData?.length && (
                <p className="text-lg font-medium mb-4 text-center">
                  Cập nhật lại kế hoạch
                </p>
              )}
              <Upload
                className="flex items-center justify-center space-x-3"
                maxCount={1}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                showUploadList={false}
                accept=".csv"
                onChange={(info) => {
                  setChosenImportCSV(info?.file?.originFileObj);
                }}
              >
                <div className="flex items-center space-x-3 border-dashed border-2 border-slate-400 rounded-lg px-10 py-5 group hover:border-black transition-colors">
                  <FiPlus className="text-2xl text-slate-400 group-hover:text-black transition-colors" />
                  <p className="text-xl text-slate-400 group-hover:text-black transition-colors">
                    Kéo tệp CSV vào đây
                  </p>
                </div>
              </Upload>

              <div
                className={clsx(
                  "mt-10 overflow-hidden transition-all mb-20",
                  {
                    "h-0 opacity-0": !tableData,
                  },
                  {
                    "h-full opacity-100": !!tableData,
                  }
                )}
              >
                <Table
                  columns={[
                    {
                      title: "Loại hạng mục",
                      dataIndex: "categoryName",
                      onCell: (record, index) => {
                        if (mergeImportValue.has(record?.categoryName)) {
                          return { rowSpan: 0 };
                        } else {
                          const rowCount = tableData?.success?.filter(
                            (data) =>
                              data?.categoryName === record?.categoryName
                          ).length;
                          mergeImportValue.add(record?.categoryName);
                          return { rowSpan: rowCount };
                        }
                      },
                      width: "12%",
                    },
                    {
                      title: "Hạng mục",
                      dataIndex: "itemName",
                      width: "15%",
                      render: (text) => <p className="line-clamp-2">{text}</p>,
                    },
                    {
                      title: "Diễn giải",
                      dataIndex: "itemDescription",
                      width: "25%",
                      render: (text) => <p className="line-clamp-4">{text}</p>,
                    },
                    {
                      title: "Độ ưu tiên",
                      dataIndex: "itemPriority",
                      align: "center",
                    },
                    {
                      title: "Đơn vị tính",
                      dataIndex: "itemPlannedUnit",
                      align: "center",
                    },
                    {
                      title: "Số lượng",
                      dataIndex: "itemPlannedAmount",
                      align: "center",
                    },
                    {
                      title: "Ngày bắt đầu",
                      width: "10%",
                      dataIndex: "itemPlannedStartDate",
                      align: "center",
                      render: (text) => (
                        <p className="line-clamp-4">
                          {moment(text).format("DD/MM/YYYY")}
                        </p>
                      ),
                    },
                    {
                      title: "Ngày kết thúc",
                      width: "10%",
                      dataIndex: "itemPlannedEndDate",
                      align: "center",
                      render: (text) => (
                        <p className="line-clamp-4">
                          {moment(text).format("DD/MM/YYYY")}
                        </p>
                      ),
                    },
                    {
                      title: "Đơn giá",
                      dataIndex: "itemPlannedPrice",
                      render: (text) => (
                        <p className="line-clamp-4">
                          {text?.toLocaleString()} VNĐ
                        </p>
                      ),
                      align: "center",
                    },
                    {
                      title: "Tổng cộng",
                      dataIndex: "",
                      render: (text, record, index) => (
                        <p className="line-clamp-4">
                          {(
                            record?.itemPlannedAmount * record?.itemPlannedPrice
                          )?.toLocaleString()}{" "}
                          VNĐ
                        </p>
                      ),
                      align: "center",
                    },
                  ]}
                  dataSource={tableData?.success}
                  bordered
                  pagination={false}
                />
                <p className="text-right text-lg mt-5">
                  Tổng cộng:{" "}
                  <span className="text-3xl font-semibold">
                    {tableData?.success
                      ?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0)
                      ?.toLocaleString() || 0}{" "}
                    VNĐ
                  </span>
                </p>
                <p className="text-right text-lg mt-5">
                  Dự phòng (5%):{" "}
                  <span className="text-3xl font-semibold">
                    {(
                      tableData?.success?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0) * 0.05
                    )?.toLocaleString() || 0}{" "}
                    VNĐ
                  </span>
                </p>
                <p className="text-right text-lg mt-5">
                  VAT (10%):{" "}
                  <span className="text-3xl font-semibold">
                    {(
                      (tableData?.success?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0) *
                        0.05 +
                        tableData?.success?.reduce((total, item) => {
                          return (
                            total +
                            item?.itemPlannedAmount * item?.itemPlannedPrice
                          );
                        }, 0)) *
                      0.1
                    )?.toLocaleString() || 0}{" "}
                    VNĐ
                  </span>
                </p>
                <p className="text-right text-lg mt-5">
                  Thành tiền:{" "}
                  <span className="text-3xl font-semibold">
                    {(
                      tableData?.success?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0) +
                      tableData?.success?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0) *
                        0.05 +
                      (tableData?.success?.reduce((total, item) => {
                        return (
                          total +
                          item?.itemPlannedAmount * item?.itemPlannedPrice
                        );
                      }, 0) *
                        0.05 +
                        tableData?.success?.reduce((total, item) => {
                          return (
                            total +
                            item?.itemPlannedAmount * item?.itemPlannedPrice
                          );
                        }, 0)) *
                        0.1
                    )?.toLocaleString() || 0}{" "}
                    VNĐ
                  </span>
                </p>

                {tableData?.TotalErrorsRecords !== 0 && (
                  <div className="mx-10 mt-5">
                    <p className="text-xl font-medium">
                      Đã có {tableData?.TotalErrorsRecords} hàng dữ liệu không
                      đọc được:
                    </p>
                    <div className="ml-5 my-2">
                      {tableData?.error?.map((item, index) => (
                        <p
                          key={index}
                          className="flex items-center text-base font-normal text-red-500"
                        >
                          <span className="mr-2">
                            <FaCircle className="text-[6px]" />
                          </span>{" "}
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="my-10 text-center">
                  <Popconfirm
                    title="Bạn có chắc chắn với bản kế hoạch này ?"
                    description={
                      tableData?.TotalErrorsRecords &&
                      `Mặc dù đang có ${tableData?.TotalErrorsRecords} dữ liệu chưa đọc được`
                    }
                    onConfirm={handlePostPlan}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button type="primary" size="large">
                      Cập nhật kế hoạch
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </Spin>
          )}
        </div>
      </motion.div>

      <FloatButton.BackTop />
    </Fragment>
  );
};

export default memo(PlanningPage);
