import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { updateBudget } from "../../../../apis/budgets";
import { uploadFile } from "../../../../apis/files";

const EditBudget = ({
  isOpenEditBudget,
  selectedBudget,
  setIsOpenEditBudget,
  isConfirmedBudget,
  setIsConfirmedBudget,
}) => {
  const budgetsId = selectedBudget.id;
  const eventID = selectedBudget.eventID;
  const [fileList, setFileList] = useState();

  const onCloseModal = () => {
    console.log("Close");
    setIsOpenEditBudget(false);
    setIsConfirmedBudget(false);
  };
  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <p>VND</p>
    </Form.Item>
  );
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutate: updateBudgetMutate, isLoading } = useMutation(
    ({ budgetsId, budget }) => updateBudget({ budgetsId, budget }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listBudgetConfirming");
        queryClient.invalidateQueries("listBudgetConfirmed");
        setIsOpenEditBudget(false);
        form.resetFields();
        message.open({
          type: "success",
          content: "cập nhật chi phí  thành công",
        });
      },
      onError: () => {
        message.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    }
  );

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, budget }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        const budget = variables.budget;
        variables.budget = {
          urlImage: data.downloadUrl,
          ...budget,
        };
        updateBudgetMutate(variables.budget);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  const onFinish = (values) => {
    const { urlImage, ...data } = values;
    const budget = {
      ...data,
      eventID: eventID,
    };
    if (values.urlImage === undefined || values.urlImage?.length === 0) {
      console.log("NOOO FILE");
      updateBudgetMutate({ budget, budgetsId });
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "event");
      uploadFileMutate({ formData, budget });
    }
  };

  return (
    <Modal
      title="Chỉnh sửa yêu cầu thu chi"
      open={isOpenEditBudget}
      footer={false}
      width={700}
      onCancel={onCloseModal}
      style={{
        top: 10,
      }}
    >
      <div className="w-full p-8 bg-white rounded-xl overflow-y-auto flex justify-center items-center">
        <Form
          form={form}
          onFinish={onFinish}
          size="large"
          layout="vertical"
          autoComplete="off"
          className="w-full"
        >
          {/* tên */}
          <Form.Item
            label="Tên chi phí"
            name="budgetName"
            rules={[
              {
                required: true,
                message: "Tên chi phí bắt buộc nhập",
              },
              {
                whitespace: true,
                message: "Tên chi phí không được để trống",
              },
            ]}
            initialValue={selectedBudget?.budgetName}
          >
            <Input placeholder="tên chi phí yêu cầu" />
          </Form.Item>
          {/* chi phí ước chừng */}
          <Form.Item
            label="Chi phí ước chừng"
            name="estExpense"
            rules={[
              {
                required: true,
                message: "Số tiền bắt buộc nhập",
              },
              {
                type: "number",
                min: 1000,
                message: "Số tiền tối thiểu là 1000",
              },
            ]}
            initialValue={selectedBudget?.estExpense}
          >
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              //   Phân tích giá trị nhập vào (loại bỏ dấu ",")
              parser={(value) => value.replace(/(,*)/g, "")}
              addonAfter={suffixSelector}
              style={{
                width: "100%",
              }}
              placeholder="số tiền dự kiến phải chi"
            />
          </Form.Item>
          {/* chi  phí thực tế */}
          {isConfirmedBudget && (
            <Form.Item
              label="Chi phí thực tế"
              name="realExpense"
              rules={[
                {
                  type: "number",
                  min: 1000,
                  message: "Số tiền tối thiểu là 1000",
                },
              ]}
              initialValue={selectedBudget?.realExpense}
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/(,*)/g, "")}
                addonAfter={suffixSelector}
                style={{
                  width: "100%",
                }}
                placeholder="số tiền dự kiến phải chi"
              />
            </Form.Item>
          )}
          {/* nhà cung */}
          <Form.Item
            label="Nhà cung cấp"
            name="supplier"
            initialValue={selectedBudget.supplier}
          >
            <Input placeholder="tên nhà cung cấp" />
          </Form.Item>
          {/* mô tả */}
          <Form.Item
            label="Mô tả"
            name="description"
            initialValue={selectedBudget.description}
          >
            <TextArea rows={2} placeholder="chi tiết số tiền được dùng" />
          </Form.Item>
          {/* tải file */}
          {isConfirmedBudget && (
            <Form.Item
              label="Hoá đơn"
              className="text-sm font-medium mb-1"
              name="urlImage"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  validator(_, fileList) {
                    return new Promise((resolve, reject) => {
                      if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
                        reject("File quá lớn ( dung lượng < 10MB )");
                      } else {
                        resolve();
                      }
                    });
                  },
                },
              ]}
            >
              <Upload
                className="upload-list-inline"
                maxCount={1}
                listType="picture"
                action=""
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                showUploadList={{
                  showPreviewIcon: false,
                }}
                beforeUpload={(file) => {
                  return new Promise((resolve, reject) => {
                    if (file && file?.size > 10 * 1024 * 1024) {
                      reject("File quá lớn ( <10MB )");
                      return false;
                    } else {
                      setFileList(file);
                      resolve();
                      return true;
                    }
                  });
                }}
              >
                <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ span: 24 }} className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              className="mt-9"
              loading={isLoadingUploadFile || isLoading}
            >
              Cập nhật chi phí
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditBudget;
