import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Select,
  Space,
  Upload,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { memo, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { getAllUser } from "../../../apis/users";
import AnErrorHasOccured from "../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../Indicator/LoadingComponentIndicator";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";

const NewTaskModalTemplate = ({
  addNewTaskTemplate,
  setAddNewTaskTemplate,
  taskTemplateModal,
  TaskParent,
}) => {
  const { id, eventID, title } = TaskParent;
  const [fileList, setFileList] = useState();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState(taskTemplateModal.startDate);
  const [endDate, setEndDate] = useState(taskTemplateModal.endDate);
  const [assignee, setAssignee] = useState([]);
  const divisionId = useRouteLoaderData("staff").divisionID;
  const [priority, setPriority] = useState({ label: "THẤP", value: "LOW" });
  const [descriptionQuill, setDescriptionQuill] = useState({
    ops: JSON.parse(taskTemplateModal.description),
  });
  const {
    data: employees,
    isError: isErrorEmployees,
    isLoading: isLoadingEmployees,
  } = useQuery(
    ["employees"],
    () =>
      getAllUser({
        divisionId,
        pageSize: 10,
        currentPage: 1,
        role: "EMPLOYEE",
      }),
    {
      select: (data) => {
        const listUsers = data.data.map(({ ...item }) => {
          item.dob = moment(item.dob).format("YYYY-MM-DD");
          return {
            key: item.id,
            ...item,
          };
        });
        return listUsers;
      },
    }
  );
  //chọn member
  const handleChangeSelectMember = (value) => {
    let listMember = [];
    if (value.length > 0) {
      listMember = [...assignee, value];
    }
    setAssignee(listMember);
  };

  const onCloseModal = () => {
    setAddNewTaskTemplate(false);
  };
  const onChangeDate = (value, dateString) => {
    // Chuyển đổi thành định dạng ISO 8601
    const isoStartDate = moment(dateString[0]).toISOString();
    const isoEndDate = moment(dateString[1]).toISOString();
    setStartDate(isoStartDate);
    setEndDate(isoEndDate);
  };
  const onFinish = (values) => {};
  return (
    <Modal
      title={`Danh sách công việc - ${title}`}
      open={addNewTaskTemplate}
      footer={false}
      onCancel={onCloseModal}
      width={900}
      className="text-lg font-bold"
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
          initialValues={taskTemplateModal}
        >
          {/* title */}
          <Form.Item
            label="Tên công việc"
            name="title"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                message: "Hãy nhập  tên công việc!",
              },
              {
                whitespace: true,
                message: " Tên công việc không được để trống!",
              },
              {
                min: 3,
                max: 200,
                message: "tên công việc từ 3 đến 200 kí tự!",
              },
            ]}
          >
            <Input placeholder="Tên công việc ..." />
          </Form.Item>
          {/* date */}
          <Form.Item
            name="date"
            label="Thời hạn"
            className="text-sm font-medium "
            rules={[
              {
                type: "array",
                required: true,
                message: "Hãy chọn thời gian!",
              },
            ]}
            initialValue={[
              dayjs(startDate).utcOffset(7).local(),
              dayjs(endDate).utcOffset(7).local(),
            ]}
          >
            {/* <ConfigProvider locale={viVN}> */}
            <RangePicker
              placeholder={["ngày bắt đầu  ", "ngày kết thúc "]}
              //   disabledTime={disabledRangeTime}
              //   disabledDate={disabledDate}
              showTime={{
                format: "HH:mm:ss",
                hideDisabledOptions: true,
              }}
              onChange={onChangeDate}
              format="DD-MM-YYYY"
              allowClear={false}
            />
          </Form.Item>
          {/* member */}
          <Form.Item
            label="Phân công"
            name="assignee"
            className="text-sm font-medium "
            rules={[
              {
                required: true,
                message: "Hãy chọn nhân viên!",
              },
            ]}
          >
            {!isLoadingEmployees ? (
              !isErrorEmployees ? (
                <Select
                  autoFocus
                  allowClear
                  mode="multiple"
                  placeholder="Người được chọn đầu tiên là nhóm trưởng"
                  style={{
                    width: "100%",
                  }}
                  onChange={(value) => handleChangeSelectMember(value)}
                  optionLabelProp="label"
                >
                  {employees?.map((item, index) => {
                    return (
                      <Option
                        value={item.id}
                        label={item.fullName}
                        key={item.id}
                      >
                        <Space>
                          <span role="img" aria-label={item.fullName}>
                            <Avatar src={item.avatar} />
                          </span>
                          {item.fullName}
                        </Space>
                      </Option>
                    );
                  })}
                </Select>
              ) : (
                <AnErrorHasOccured />
              )
            ) : (
              <LoadingComponentIndicator />
            )}
          </Form.Item>
          <Form.Item
            //   initialValue={0.0}
            label="Ước tính giờ làm"
            name="estimationTime"
            className="text-sm font-medium "
            rules={[
              {
                type: "number",
                message: "Chỉ được nhập số ",
              },
            ]}
          >
            <InputNumber
              placeholder="Chọn thời gian ước tính làm"
              className="w-1/3"
              type="number"
              // step="0.1"
              // stringMode
            />
          </Form.Item>
          <Form.Item
            label="Độ ưu tiên"
            name="priority"
            className="text-sm font-medium "
            initialValue={priority.value}
          >
            <Segmented
              // defaultValue="LOW"
              options={[
                { label: "THẤP", value: "LOW" },
                { label: "VỪA", value: "MEDIUM" },
                { label: "CAO", value: "HIGH" },
              ]}
              value={priority.value}
              onChange={setPriority}
            />
          </Form.Item>
          <Form.Item
            initialValue={descriptionQuill}
            label="Mô tả"
            className="text-sm font-medium "
            name="desc"
          >
            <ReactQuill
              theme="snow"
              // value={description}
              onChange={(content, delta, source, editor) => {
                form.setFieldsValue({ desc: editor.getContents() });
              }}
              className="bg-transparent  py-2 rounded-md text-sm border-none  border-gray-600 focus:outline-secondary outline-none ring-0 w-full "
            />
          </Form.Item>
          {/* file */}
          <Form.Item
            label="Tài liệu"
            className="text-sm font-medium "
            name="fileUrl"
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
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="mt-9"
              // loading={isLoadingUploadFile || isLoading}
            >
              Tạo công việc
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default memo(NewTaskModalTemplate);
