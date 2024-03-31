import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { createUser, getRoles } from "../../apis/users";
import { getAllDivision } from "../../apis/divisions";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import dayjs from "dayjs";
import { uploadFile } from "../../apis/files";
import { useRouteLoaderData } from "react-router-dom";
import TEXT from "../../constants/string";
import { defaultAvatarFireBase } from "../../constants/global";

const Label = ({ label }) => <p className="text-lg font-medium">{label}</p>;

const CreateUserDrawer = ({ showDrawer, setShowDrawer, page }) => {
  const [divisionMode, setDivisionMode] = useState(2);
  const [fileList, setFileList] = useState({ url: defaultAvatarFireBase });
  const admin = useRouteLoaderData("administrator");
  const staff = useRouteLoaderData("staff");

  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [showDrawer]);

  const { mutate: createUserMutate, isLoading } = useMutation(
    (user) => createUser(user),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", page]);
        queryClient.invalidateQueries(["divisions", 2]);

        form.resetFields();
        setDivisionMode(1);
        setFileList({ url: defaultAvatarFireBase });
        setShowDrawer(false);

        messageApi.open({
          type: "success",
          content: "Đã tạo 1 nhân viên",
        });
      },
      onError: (error) => {
        if (error.response?.data?.message === "EMAIL_EXIST") {
          messageApi.open({
            type: "error",
            content: "Email đã được sử dụng! Hãy thử lại sau",
          });
        } else if (error.response?.data?.message.includes("Duplicate entry")) {
          messageApi.open({
            type: "error",
            content: "Số điện thoại đã được sử dụng! Hãy thử lại sau",
          });
        } else {
          messageApi.open({
            type: "error",
            content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
          });
        }
      },
    }
  );

  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, user }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        const user = variables.user;
        variables.user = { ...user, avatar: data.downloadUrl };
        createUserMutate(variables.user);
        console.log("🚀 ~ CreateUserDrawer ~ variables.user :", variables.user);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải tệp tin lên! Hãy thử lại sau",
        });
      },
    }
  );

  const {
    data: divisionData,
    isLoading: divisionLoading,
    isError: divisionIsError,
  } = useQuery(
    ["divisions", 1],
    () => getAllDivision({ pageSize: 20, currentPage: 1, mode: 1 }),
    {
      select: (data) =>
        data
          .filter((division) => division.status)
          .map((division) => ({
            value: division.id,
            label: division.divisionName,
          })),
      refetchOnWindowFocus: false,
    }
  );
  // console.log("divisionData: ", divisionData);

  const {
    data: divisionsWithoutStaff,
    isLoading: divisionsWithoutStaffIsLoading,
    isError: divisionsWithoutStaffIsError,
  } = useQuery(
    ["divisions", 2],
    () => getAllDivision({ pageSize: 20, currentPage: 1, mode: 2 }),
    {
      select: (data) =>
        data
          .filter((division) => division.status)
          .map((division) => ({
            value: division.id,
            label: division.divisionName,
          })),
      refetchOnWindowFocus: false,
    }
  );
  // console.log("divisionsWithoutStaff >", divisionsWithoutStaff);

  const {
    data: roles,
    isLoading: rolesIsLoading,
    isError: rolesIsError,
  } = useQuery(["roles"], getRoles, {
    select: (data) =>
      data
        ?.filter(
          (role) =>
            role?.roleName !== "Administrator" &&
            role?.roleName !== "Khách Hàng"
        )
        .map((role) => ({ value: role?.id, label: role?.roleName })),
    refetchOnWindowFocus: false,
    enabled: !!admin,
  });
  console.log("roles > ", roles);

  const {
    data: roleEmployee,
    isLoading: roleEmployeeLoading,
    isError: roleEmployeeError,
  } = useQuery(["roles-Employee"], getRoles, {
    select: (data) => {
      const findRole = data?.find((role) => role?.roleName === "Nhân Viên");
      return findRole;
    },
    refetchOnWindowFocus: false,
    enabled: !!staff,
  });

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    console.log("FORM DATA: ", values);
    console.log("fileList: ", fileList);
    // const { avatar, ...user } = values;
    // const formData = new FormData();
    // formData.append("file", fileList);
    // formData.append("folderName", "avatar");

    if (fileList?.url) {
      if (staff) {
        values.roleId = roleEmployee?.id;
        values.divisionId = staff?.divisionId;
        values.typeEmployee = "PART_TIME";
      }
      values.avatar = fileList?.url;
      console.log("values > ", values);

      createUserMutate(values);
    } else {
      const formData = new FormData();
      formData.append("file", fileList);
      formData.append("folderName", "avatar");

      if (staff) {
        values.roleId = roleEmployee?.id;
        values.divisionId = staff?.divisionId;
        values.typeEmployee = "PART_TIME";
      }
      console.log("values > ", values);

      uploadFileMutate({ formData, user: values });
    }
  };

  return (
    <div>
      {contextHolder}
      <Drawer
        title={staff ? "Quản lý nhân sự" : "Tạo mới nhân viên"}
        width={580}
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        bodyStyle={{
          padding: 50,
          paddingTop: 20,
        }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          requiredMark={false}
          initialValues={{
            gender: "MALE",
            typeEmployee: "FULL_TIME",
            dob: moment("2001-01-01", "YYYY-MM-DD").format("YYYY-MM-DD"),
            roleId: roles?.[0]?.value,
          }}
        >
          <Form.Item
            className="text-center"
            name="avatar"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              {
                validator(_, fileList) {
                  return new Promise((resolve, reject) => {
                    if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
                      reject("File quá lớn ( Dung lượng <10MB )");
                    } else {
                      resolve();
                    }
                  });
                },
              },
            ]}
          >
            <Upload
              className="flex items-center gap-x-3 flex-row-reverse space-x-reverse"
              maxCount={1}
              listType="picture-circle"
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: false,
                removeIcon: false,
              }}
              // accept=".png,.jpg,.pdf"
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
              defaultFileList={[{ url: defaultAvatarFireBase }]}
            >
              Ảnh dại diện
            </Upload>
          </Form.Item>
          <Form.Item
            name="fullName"
            label={<Label label="Họ và tên" />}
            rules={[
              {
                required: true,
                message: `Chưa nhập thông tin!`,
              },
            ]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item
            name="email"
            label={<Label label="Email" />}
            rules={[
              {
                required: true,
                message: `Chưa nhập thông tin!`,
              },
            ]}
          >
            <Input placeholder="bao@gmail.com" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={<Label label="Số điện thoại" />}
            rules={[
              {
                required: true,
                message: `Chưa nhập thông tin!`,
              },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại bao gồm 12 số!",
              },
            ]}
          >
            <Input type="" placeholder="090*******" pattern="[0-9]*"
              maxLength={10}/>
          </Form.Item>
          <Form.Item
            name="nationalId"
            label={<Label label="CMND / Căn cước công dân" />}
            rules={[
              {
                required: true,
                message: `Chưa nhập thông tin!`,
              },
              {
                pattern: /^[0-9]{12}$/,
                message: "CCCD / CMND cần bao gồm 12 số!",
              },
            ]}
          >
            <Input
              placeholder="Nhập thông tin ..."
              pattern="[0-9]*"
              maxLength={12}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label={<Label label="Địa chỉ" />}
            rules={[
              {
                required: true,
                message: `Chưa nhập thông tin!`,
              },
            ]}
          >
            <Input placeholder="Nhập thông tin ..." />
          </Form.Item>

          <div className="flex flex-wrap justify-between">
            <Form.Item
              className="w-[45%]"
              name="dob"
              label={<Label label="Ngày sinh" />}
              rules={[
                {
                  required: true,
                  message: `Chưa chọn ngày sinh! (16+)`,
                },
              ]}
            >
              <ConfigProvider locale={viVN}>
                <DatePicker
                  className="w-full"
                  defaultValue={dayjs("2001-01-01", "YYYY-MM-DD")}
                  onChange={(value) => {
                    const formattedDate = moment(value.$d).format("YYYY-MM-DD");
                    form.setFieldsValue({ dob: formattedDate });
                  }}
                  disabledDate={(current) => {
                    const today = moment();
                    return current && current > today;
                  }}
                  format={"DD-MM-YYYY"}
                />
              </ConfigProvider>
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              name="gender"
              label={<Label label="Giới tính" />}
              rules={[
                {
                  required: true,
                  message: `Chưa chọn giới tính!`,
                },
              ]}
            >
              <Select
                placeholder="Giới tính"
                onChange={(value) => {
                  form.setFieldsValue({ gender: value });
                }}
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
            {admin && (
              <>
                <Form.Item
                  className="w-[45%]"
                  name="roleId"
                  label={<Label label="Vai trò" />}
                  rules={[
                    {
                      required: true,
                      message: `Chưa chọn vai trò!`,
                    },
                  ]}
                >
                  <Select
                    placeholder="Vai trò"
                    onChange={(value) => {
                      const roleId = roles?.find(
                        (item) => item?.label === TEXT.EMPLOYEE
                      )?.value;
                      if (value === roleId) setDivisionMode(1);
                      else setDivisionMode(2);

                      form.setFieldsValue({ role: value });
                      form.setFieldsValue({ typeEmployee: "FULL_TIME" });
                      form.resetFields(["divisionId"]);
                    }}
                    loading={rolesIsLoading || rolesIsError}
                    options={roles ?? []}
                  />
                </Form.Item>
                {
                  <Form.Item
                    className="w-[45%]"
                    name="divisionId"
                    label={
                      <div className="md:flex md:items-center md:gap-x-1">
                        <Label label="Bộ phận" />
                        <p className="text-sm text-slate-400">(tùy chọn)</p>
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: `Chưa chọn bộ phận!`,
                      },
                    ]}
                  >
                    <Select
                      placeholder="Bộ phận"
                      onChange={(value) => {
                        form.setFieldsValue({ divisionId: value });
                      }}
                      loading={
                        divisionLoading ||
                        divisionsWithoutStaffIsLoading ||
                        divisionIsError ||
                        divisionsWithoutStaffIsError
                      }
                      options={
                        divisionMode === 1
                          ? divisionData
                          : divisionsWithoutStaff
                      }
                    />
                  </Form.Item>
                }
              </>
            )}
          </div>

          {!staff && (
            <Form.Item name="typeEmployee">
              {divisionMode === 1 && (
                <Radio.Group>
                  <Radio value="FULL_TIME">Toàn thời gian</Radio>
                  <Radio value="PART_TIME">Bán thời gian</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          )}

          <div className="text-center">
            <Form.Item>
              <Button
                className="mt-5"
                type="primary"
                size="large"
                onClick={() => form.submit()}
                loading={isLoading || uploadIsLoading}
              >
                Tạo
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateUserDrawer;
