import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";

import React, { useState } from "react";
import { uploadFile } from "../../../apis/files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../../apis/users";

const EditProfileModal = ({ isOpenEditModal, setIsOpenEditModal, data }) => {
  const [formEdited, setFormEdited] = useState(false);
  const { Option } = Select;
  const oldAvatar = data?.avatar;
  const [newDob, setNewDob] = useState(data?.dob);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState();
  const [fileListNationalIdImage, setFileListNationalIdImage] = useState();
  const [isMultiFile, setIsMultiFile] = useState(false);
  const [fileTemp, setFileTemp] = useState();
  const avatarDefault = [
    {
      uid: "-1",
      status: "done",
      name: "image.png",
      url: `${data?.avatar ? data?.avatar : ""}`,
    },
  ];
  const nationalImagesDefault = [
    {
      uid: "-1",
      status: "done",
      name: "nationalImages.png",
      url: `${data?.nationalImages ? data?.nationalImages : ""}`,
    },
  ];

  const handleFormChange = () => {
    if (form.isFieldsTouched()) {
      setFormEdited(true);
    } else {
      setFormEdited(false);
    }
  };

  const queryClient = useQueryClient();
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Thêm ảnh
      </div>
    </div>
  );
  const disabledDate = (current) => {
    // return current.isAfter(today, "day");
    return current && current >= dayjs().endOf("day");
  };
  const onChange = (date, dateString) => {
    const formatStart = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
    const isoStartDate = moment(formatStart).toISOString();
    setNewDob(isoStartDate);
  };

  const { mutate: updateProfileMutate, isLoading } = useMutation(
    (user) => updateProfile(user),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profile");
        setIsOpenEditModal(false);
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
  const {
    mutate: uploadFileNationalIdMutate,
    isLoading: isLoadingUploadFileNationalId,
  } = useMutation(({ formData2, user }) => uploadFile(formData2), {
    onSuccess: (data, variables) => {
      const user = variables.user;
      variables.user = {
        nationalIdImage: data?.downloadUrl,
        ...user,
      };

      updateProfileMutate(variables.user);
    },
    onError: () => {
      message.open({
        type: "error",
        content: "Ko thể tải ảnh căn cước công dân lên! Hãy thử lại sau",
      });
    },
  });

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, user }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        const user = variables.user;
        variables.user = {
          avatar: data?.downloadUrl,
          ...user,
        };

        if (isMultiFile) {
          uploadFileNationalIdMutate({
            formData2: fileTemp,
            user: variables.user,
          });
        } else {
          updateProfileMutate(variables.user);
        }
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  const onFinish = (values) => {
    const { dob, urlImage, nationalImg, ...data } = values;
    const user = { dob: newDob, ...data };
    user.phoneNumber = "0" + user.phoneNumber.toString();

    if (values.urlImage === undefined || values.urlImage?.length === 0) {
      setIsMultiFile(false);
      const newProfile = {
        avatar: oldAvatar,
        ...user,
      };
      if (
        values.nationalImg === undefined ||
        values.nationalImg?.length === 0
      ) {
        
        updateProfileMutate(newProfile);
      } else {
        const formData2 = new FormData();
        formData2.append("file", fileListNationalIdImage);
        formData2.append("folderName", "nationalCard");
        uploadFileNationalIdMutate({ formData2, user: newProfile });
      }
    } else {
      if (
        values.nationalImg === undefined ||
        values.nationalImg?.length === 0
      ) {
        const formData = new FormData();
        formData.append("file", fileList);
        formData.append("folderName", "avatar");
        uploadFileMutate({ formData, user });
      } else {
        setIsMultiFile(true);
        const formData = new FormData();
        formData.append("file", fileList);
        formData.append("folderName", "avatar");

        const formData2 = new FormData();
        formData2.append("file", fileListNationalIdImage);
        formData2.append("folderName", "nationalCard");
        setFileTemp(formData2);

        uploadFileMutate({ formData, user });
      }
    }
  };
  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      width={800}
      footer={false}
      open={isOpenEditModal}
      onCancel={() => setIsOpenEditModal(false)}
    >
      <div className="mt-4 p-4">
        <Form
          form={form}
          onFinish={onFinish}
          size="large"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          layout="horizontal"
          autoComplete="off"
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                type: "string",
                message: "Hãy nhập Họ và tên!",
              },
              { whitespace: true, message: "Họ và tên không được để trống!" },
              {
                min: 5,
                max: 200,
                message: "Họ và tên tối thiểu 5 tới 200 kí tự!",
              },
            ]}
            initialValue={data?.fullName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                type: "string",
                message: "Hãy nhập Địa chỉ !",
              },
              { whitespace: true, message: "Địa chỉ không được để trống!" },
              {
                min: 5,
                max: 200,
                message: "Địa chỉ tối thiểu 5 tới 200 kí tự!",
              },
            ]}
            initialValue={data?.address}
          >
            <Input />
          </Form.Item>
          <div className="flex flex-row gap-x-2 justify-start items-center w-full">
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="Giới tính"
              name="gender"
              className="text-sm font-medium w-1/2"
              initialValue={data?.gender}
            >
              <Select
                placeholder="Giới tính "
                options={[
                  {
                    value: "MALE",
                    label: "Nam",
                  },
                  {
                    value: "FEMALE",
                    label: "Nữ",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              name="nationalId"
              label="Số CCCD"
              className="w-1/2"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số CCCD",
                },
                {
                  pattern: /^[0-9]{12}$/,
                  message: "Số CCCD cần bao gồm 12 số!",
                },
              ]}
              initialValue={data?.nationalId}
            >
              <Input pattern="[0-9]*" maxLength={12} />
            </Form.Item>
          </div>
          <div className="flex flex-row gap-x-2 justify-start items-center w-full">
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              className="text-sm font-medium w-1/2"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              rules={[
                {
                  required: true,
                  type: "number",
                  message: "Hãy nhập  số điện thoại!",
                },
                {
                  validator: async (rule, value) => {
                    if (value && !/^\d{9}$/.test(value)) {
                      throw new Error("Số điện thoại phải có đúng 9 số!");
                    }
                  },
                },
              ]}
              initialValue={parseInt(data?.phoneNumber, 10)}
            >
              <InputNumber
                prefix={<p>+84</p>}
                className="w-full"
                controls={false}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              label="Ngày sinh"
              name="dob"
              className="text-sm font-medium w-1/2 "
              rules={[
                {
                  type: "date",
                  required: true,
                  message: "Hãy chọn thời gian!",
                },
              ]}
              initialValue={dayjs(data?.dob, "YYYY-MM-DD")}
            >
              <DatePicker
                onChange={onChange}
                className="w-full"
                disabledDate={disabledDate}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </div>
          <div className="flex flex-row gap-x-2 justify-start items-center w-full">
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="Ảnh đại diện"
              className="text-sm font-medium w-1/2"
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
                accept=".png,.jpg,.jpeg"
                defaultFileList={avatarDefault}
                maxCount={1}
                listType="picture-card"
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
                {uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              label="Ảnh CCCD"
              className="text-sm font-medium w-1/2"
              name="nationalImg"
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
                defaultFileList={
                  data?.nationalImages ? nationalImagesDefault : null
                }
                maxCount={1}
                listType="picture-card"
                action=""
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                showUploadList={{
                  showPreviewIcon: false,
                }}
                accept=".png,.jpg,.jpeg"
                beforeUpload={(file) => {
                  return new Promise((resolve, reject) => {
                    if (file && file?.size > 10 * 1024 * 1024) {
                      reject("File quá lớn ( <10MB )");
                      return false;
                    } else {
                      setFileListNationalIdImage(file);
                      resolve();
                      return true;
                    }
                  });
                }}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </div>
          <Form.Item
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            label=" "
            colon={false}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={!formEdited}
              className="w-full"
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
