import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
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
  const oldAvatar = data.avatar;
  const [newDob, setNewDob] = useState(data?.dob);
  const [fileList, setFileList] = useState();
  //   const [avatar, setAvatar] = useState([
  //     {
  //       uid: "-1",
  //       status: "done",
  //       name: "image.png",
  //       url: `${data?.avatar}`,
  //     },
  //   ]);
  const avatarDefault = [
    {
      uid: "-1",
      status: "done",
      name: "image.png",
      url: `${data?.avatar}`,
    },
  ];
  const queryClient = useQueryClient();
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const disabledDate = (current) => {
    // return current.isAfter(today, "day");
    return current && current >= dayjs().endOf("day");
  };
  const onChange = (date, dateString) => {
    const isoStartDate = moment(dateString).toISOString();
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

  const { mutate: uploadFileMutate, isLoading: isLoadingUploadFile } =
    useMutation(({ formData, user }) => uploadFile(formData), {
      onSuccess: (data, variables) => {
        const user = variables.user;
        variables.user = {
          avatar: data?.downloadUrl,
          ...user,
        };
        console.log(
          "🚀 ~ file: EditProfileModal.js:89 ~ useMutation ~ variables.user:",
          variables.user
        );
        updateProfileMutate(variables.user);
      },
      onError: () => {
        message.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    });

  const onFinish = (values) => {
    const { dob, urlImage, ...data } = values;
    const user = { dob: newDob, ...data };
    if (values.urlImage === undefined || values.urlImage?.length === 0) {
      console.log("NOOO FILE");
      const newProfile = { avatar: oldAvatar, ...user };
      updateProfileMutate(newProfile);
      //   console.log(
      //     "🚀 ~ file: EditProfileModal.js:106 ~ onFinish ~ newProfile:",
      //     newProfile
      //   );
    } else {
      console.log("HAS FILE");
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "avatar");
      uploadFileMutate({ formData, user });
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
            hasFeedback
            initialValue={data?.fullName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            className="text-sm font-medium "
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
            hasFeedback
            initialValue={parseInt(data?.phoneNumber, 10)}
          >
            <InputNumber className="w-2/3" />
          </Form.Item>
          <Form.Item
            label="Năm sinh"
            name="dob"
            className="text-sm font-medium "
            rules={[
              {
                type: "date",
                required: true,
                message: "Hãy chọn thời gian!",
              },
            ]}
            hasFeedback
            initialValue={dayjs(data?.dob)}
          >
            <DatePicker
              onChange={onChange}
              className="w-2/3"
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
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
            hasFeedback
            initialValue={data?.address}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ảnh đại diện"
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
              //   className="upload-list-inline"
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
              span: 4,
            }}
            wrapperCol={{
              span: 18,
            }}
            label=" "
            colon={false}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading || isLoadingUploadFile}
            >
              Gửi cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
