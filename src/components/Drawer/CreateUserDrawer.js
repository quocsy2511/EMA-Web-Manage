import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  message,
} from "antd";
import React from "react";
import { createUser } from "../../apis/users";
import { getAllDivision } from "../../apis/divisions";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import dayjs from "dayjs";

const Label = ({ label }) => <p className="text-lg font-medium">{label}</p>;

const CreateUserDrawer = ({ showDrawer, setShowDrawer }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((user) => createUser(user), {
    onSuccess: () => {},
    onError: () => {
      messageApi.open({
        type: "error",
        content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
      });
    },
  });

  const {
    data: divisionData,
    isLoading: divisionLoading,
    isError,
  } = useQuery(
    ["division"],
    () => getAllDivision({ pageSize: 20, currentPage: 1 }),
    {
      select: (data) => {
        return data.data.map((division) => ({
          value: division.id,
          label: division.divisionName,
        }));
      },
    }
  );

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    // Setup fixed avatar
    values = {
      ...values,
      avatar:
        "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1061959920.jpg?crop=1xw:1.0xh;center,top&resize=640:*",
    };

    const { divisionId, ...restValues } = values;

    values = values.divisionId ? values : restValues;
    console.log("values: ", values);
    mutate(values);
  };

  return (
    <div>
      {contextHolder}
      <Drawer
        title="Khởi tạo 1 nhân viên"
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
          }}
        >
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
            ]}
          >
            <Input placeholder="090*******" />
          </Form.Item>
          <Form.Item
            name="nationalId"
            label={<Label label="CMND / Căn cước công dân" />}
            rules={[
              {
                required: true,
                message: `Chưa nhập thông tin!`,
              },
            ]}
          >
            <Input placeholder="Nhập thông tin ..." />
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
                  onChange={(value) => {
                    const formattedDate = dayjs(value).format(
                      "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                    );
                    form.setFieldsValue({ dob: formattedDate });
                  }}
                  disabledDate={(current) => {
                    // const sixteenYearsAgo = moment().subtract(16, "years");
                    // return current && current > sixteenYearsAgo;
                    const today = moment();
                    return current && current > today;
                  }}
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
            <Form.Item
              className="w-[45%]"
              name="role"
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
                  form.setFieldsValue({ role: value });
                }}
                options={[
                  {
                    value: "EMPLOYEE",
                    label: "Nhân viên",
                  },
                  {
                    value: "STAFF",
                    label: "Trưởng phòng",
                  },
                ]}
              />
            </Form.Item>
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
                // loading={divisionLoading}
                options={!divisionLoading ? divisionData : []}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              className="mt-5"
              type="primary"
              size="large"
              onClick={() => form.submit()}
              loading={isLoading}
            >
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateUserDrawer;
