import React, { Fragment, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  App,
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Progress,
  Select,
  Spin,
  Steps,
  Switch,
  Tooltip,
  Upload,
  message,
} from "antd";
import viVN from "antd/locale/vi_VN";
import moment from "moment";
import momenttz from "moment-timezone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createEvent } from "../../apis/events";
import { uploadFile } from "../../apis/files";
import { createContract } from "../../apis/contract";
import LockLoadingModal from "../../components/Modal/LockLoadingModal";
import { getCustomerContactDetail } from "../../apis/contact";
import dayjs from "dayjs";
import clsx from "clsx";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { FaPlus } from "react-icons/fa6";

const { RangePicker } = DatePicker;

const parseJson = (data) => JSON.stringify([{ insert: data + "\n" }]);

const Title = memo(({ title }) => (
  <p className="text-base font-medium truncate">{title}</p>
));

const DefaultTemplateTask = memo(
  ({ isDefault, custom, toggleSelectTemplateTasks, messageApi }) => {
    const [isSelected, setIsSelected] = useState(true);
    const [budget, setBudget] = useState(0);
    console.log("budget >> ", budget);

    return (
      <Tooltip title={!isDefault && !custom && "Chọn"}>
        <div
          className={clsx(
            "rounded-2xl mb-10 overflow-hidden shadow-[0_0_8px_1px_rgba(0,0,0,0.15)]",
            { "relative w-[45%] mx-[2.5%]": isDefault || custom },
            {
              "hover:scale-[102%] cursor-pointer transition-transform duration-100":
                !isDefault && !custom,
            }
          )}
          onClick={() => {
            !isDefault && !custom && toggleSelectTemplateTasks();
          }}
        >
          <div className="flex justify-between items-center space-x-5 p-5 pb-3 border-b">
            <p className="text-xl font-medium truncate max-w-[80%]">
              Tên hạng mục 1
            </p>
            {isDefault ? (
              <ConfigProvider
                theme={{
                  components: {
                    Switch: {
                      handleSize: 20,
                      trackHeight: 30,
                      trackPadding: 5,
                      trackMinWidth: 50,
                    },
                  },
                }}
              >
                <Switch
                  className="bg-slate-300"
                  defaultChecked
                  // defaultValue={true}
                  // value={isSelected}
                  onChange={(checked) => {
                    console.log(`switch to ${checked}`);
                    setIsSelected(checked);
                  }}
                />
              </ConfigProvider>
            ) : (
              custom && (
                <Popconfirm
                  title={<p>Bạn đang hạng mục này ?</p>}
                  okText="Xác nhận"
                  cancelText="Hủy bỏ"
                  onConfirm={() => toggleSelectTemplateTasks()}
                >
                  <div className="rotate-45 cursor-pointer p-2 pt-0">
                    <FaPlus className="text-xl text-red-500" />
                  </div>
                </Popconfirm>
              )
            )}
          </div>

          <div className="p-5 pt-3">
            <Title title="Mô tả" />
            <p
              className="text-base text-slate-500 mt-1 border rounded-lg p-3 max-h-44 overflow-y-scroll"
              dangerouslySetInnerHTML={{
                __html: new QuillDeltaToHtmlConverter(
                  JSON.parse(
                    '[{"insert":"Hội thảo chuyên đề này sẽ tập trung vào việc chia sẻ những xu hướng mới nhất trong ngành quảng cáo và tiếp thị, giúp các doanh nghiệp cập nhật những chiến lược hiệu quả nhất để thu hút khách hàng tiềm năng và tăng doanh thu.\\n\\n Các chuyên gia hàng đầu trong ngành sẽ chia sẻ kiến thức và kinh nghiệm của họ về các chủ đề như quảng cáo kỹ thuật số, marketing nội dung, SEO, và mạng xã hội. \\n\\nHội thảo cũng sẽ cung cấp cho các doanh nghiệp cơ hội để giao lưu và học hỏi lẫn nhau.\\n"}]'
                  )
                ).convert(),
              }}
            />

            {(isDefault || custom) && (
              <div className="mt-5 flex space-x-5 items-center">
                <Title title="Ngân sách" />
                <InputNumber
                  size="large"
                  className="w-1/3"
                  // defaultValue={form.getFieldValue("estBudget")}
                  defaultValue={0}
                  min={0}
                  step={100000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => {
                    setBudget(value.replace(/,/g, ""));
                    return `${value}`.replace(/,/g, "");
                  }}
                  onStep={(value) => {
                    setBudget(value);
                  }}
                />
                <p>VNĐ</p>
              </div>
            )}
          </div>
        </div>
      </Tooltip>
    );
  }
);

const DrawerContainer = memo(
  ({
    isDrawerOpen,
    setIsDrawerOpen,
    toggleSelectTemplateTasks,
    messageApi,
  }) => {
    return (
      <Drawer
        title="Danh sách hạng mục mẫu"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={"30%"}
      >
        {/* Content */}
        <div className="mx-5">
          <p className="mb-6 text-lg text-black/60">Chọn các hạng mục mẫu</p>
          <DefaultTemplateTask
            toggleSelectTemplateTasks={toggleSelectTemplateTasks}
            messageApi={messageApi}
          />
          <DefaultTemplateTask
            toggleSelectTemplateTasks={toggleSelectTemplateTasks}
            messageApi={messageApi}
          />
          <DefaultTemplateTask
            toggleSelectTemplateTasks={toggleSelectTemplateTasks}
            messageApi={messageApi}
          />
        </div>
      </Drawer>
    );
  }
);

const EventCreationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fileList, setFileList] = useState();
  const [current, setCurrent] = useState(0);
  const [selectTemplateTasks, setSelectTemplateTasks] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const { notification } = App.useApp();

  const { data: contactInfo, isLoading: contactInfoIsLoading } = useQuery(
    ["contact", location.state?.contactId],
    () => getCustomerContactDetail(location.state?.contactId),
    {
      select: (data) => {
        return {
          ...data,
          startDate: momenttz(data?.startDate).format("YYYY-MM-DD"),
          endDate: momenttz(data?.endDate).format("YYYY-MM-DD"),
        };
      },
      refetchOnWindowFocus: false,
    }
  );
  console.log("contactInfo > ", contactInfo);

  // Create event after upload banner image
  const { mutate: createEventMutate, isLoading: createEventIsLoading } =
    useMutation((event) => createEvent(event), {
      onSuccess: (data, variables) => {
        // createContractMutate({
        //   eventId: data?.split(" ")?.[0],
        //   contract: variables?.contract,
        // });
        console.log("event success data > ", data);

        notification.success({
          message: <p className="font-medium">Tạo sự kiện thành công</p>,
          // description: "Hello, Ant Design!!",
          placement: "topRight",
          duration: 3,
        });

        navigate(-1);
        // navigate(`/manager/event/${variables?.eventId}`, { replace: true });
      },
      onError: (error) => {
        messageApi.open({
          type: "error",
          content: "1 lỗi bất ngờ đã xảy ra! Hãy thử lại sau",
        });
      },
    });

  // Upload banner image
  const { mutate: uploadFileMutate, isLoading: uploadIsLoading } = useMutation(
    ({ formData, event, contract }) => uploadFile(formData),
    {
      onSuccess: (data, variables) => {
        console.log("variables upload > ", variables);
        variables.event = {
          coverUrl: data.downloadUrl,
          ...variables.event,
          ...variables.contract,
          contactId: location.state?.contactId,
        };
        createEventMutate(variables.event);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Ko thể tải ảnh lên! Hãy thử lại sau",
        });
      },
    }
  );

  const toggleSelectTemplateTasks = () => {
    setSelectTemplateTasks((prev) => [...prev, 1]);
  };

  const setupEventValues = (values) => {
    return {
      eventName: values?.eventName,
      description: JSON.stringify(values?.description.ops),
      // ===========================================
      startDate: values?.processingDate,
      processingDate: values?.date?.[0],
      endDate: values?.date?.[1],
      // ===========================================
      location: values?.location,
      estBudget: +values?.estBudget,
      eventTypeId: values?.eventTypeId,
    };
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const formData = new FormData();
    formData.append("file", fileList);
    formData.append("folderName", "event");

    const eventValues = setupEventValues(values);

    const contractValues = {
      ...values.contract,
      contractValue: `${values.contract.contractValue}`,
      paymentDate: momenttz().format("YYYY-MM-DD"),
    };

    uploadFileMutate({
      formData,
      event: eventValues,
      contract: contractValues,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const steps = [
    // {
    //   key: 1,
    //   title: "Thông tin cơ bản",
    //   content: (
    //     <div className="">
    //       <div className="flex space-x-10">
    //         <Form.Item
    //           className="w-[30%]"
    //           label={<Title title="Tên sự kiện" />}
    //           name="eventName"
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập tên sự kiện!",
    //             },
    //           ]}
    //           onChange={(value) => {
    //             // Update to specific field
    //             form.setFieldsValue({ eventName: value.target.value });
    //           }}
    //         >
    //           <Input placeholder="Nhập tên sự kiện" size="large" />
    //         </Form.Item>
    //         <Form.Item
    //           className="w-[70%]"
    //           label={<Title title="Địa điểm" />}
    //           name="location"
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập địa điểm!",
    //             },
    //           ]}
    //           onChange={(value) => {
    //             // Update to specific field
    //             form.setFieldsValue({ location: value.target.value });
    //           }}
    //         >
    //           <Input placeholder="Nhập địa điểm" size="large" />
    //         </Form.Item>
    //       </div>

    //       <Form.Item
    //         label={<Title title="Mô tả" />}
    //         name="description"
    //         rules={[
    //           {
    //             required: true,
    //             message: "Chưa nhập mô tả!",
    //           },
    //         ]}
    //       >
    //         <ReactQuill
    //           className="h-36 mb-10"
    //           theme="snow"
    //           placeholder="Nhập mô tả"
    //           onChange={(content, delta, source, editor) => {
    //             // Update to specific field
    //             form.setFieldsValue({ description: editor.getContents() });
    //           }}
    //         />
    //       </Form.Item>

    //       <div className="flex justify-end mt-5">
    //         <Button
    //           className=""
    //           onClick={() => {
    //             form
    //               .validateFields()
    //               .then((values) => {
    //                 setCurrent((prev) => prev + 1);
    //               })
    //               .catch((errorInfo) => {
    //                 console.log("Validation Fields:", errorInfo);
    //                 const values = errorInfo.values;
    //                 if (
    //                   !!values.eventName &&
    //                   !!values.location &&
    //                   !!values.description
    //                 ) {
    //                   setCurrent((prev) => prev + 1);
    //                 }
    //               });
    //           }}
    //           size="large"
    //           type="primary"
    //         >
    //           Tiếp tục
    //         </Button>
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   key: 2,
    //   title: "Thông tin chi tiết",
    //   content: (
    //     <>
    //       <div className="flex space-x-10">
    //         <Form.Item
    //           className="w-[40%]"
    //           label={<Title title="Ngày bắt đầu - kết thúc sự kiện" />}
    //           name="date"
    //           rules={[
    //             {
    //               validator: (rule, value) => {
    //                 if (value && value?.[0] && value?.[1]) {
    //                   return Promise.resolve();
    //                 }
    //                 return Promise.reject("Chưa chọn thời gian tổ chức");
    //               },
    //             },
    //           ]}
    //         >
    //           <ConfigProvider locale={viVN}>
    //             <RangePicker
    //               size="large"
    //               className="w-full"
    //               defaultValue={[
    //                 dayjs(contactInfo?.startDate, "YYYY-MM-DD"),
    //                 dayjs(contactInfo?.endDate, "YYYY-MM-DD"),
    //               ]}
    //               onChange={(value) => {
    //                 // Update to specific field
    //                 form.setFieldsValue({
    //                   date: value?.map((item) =>
    //                     moment(item?.$d).format("YYYY-MM-DD")
    //                   ),
    //                 });

    //                 // Get date in range
    //                 const startDate = moment(value?.[0]?.$d);
    //                 const endDate = moment(value?.[1]?.$d);

    //                 // Get processing date in range
    //                 const selectedDate = moment(
    //                   form.getFieldValue("processingDate")?.$d
    //                 );

    //                 // Check if processing date is not in range  => reset processing date
    //                 if (
    //                   !selectedDate.isBetween(startDate, endDate, null, "[]") ||
    //                   !value
    //                 ) {
    //                   form.resetFields(["processingDate"]);
    //                 }
    //               }}
    //               disabledDate={(current) => {
    //                 return current && current < moment().startOf("day");
    //               }}
    //               format={"DD/MM/YYYY"}
    //             />
    //           </ConfigProvider>
    //         </Form.Item>

    //         <Form.Item
    //           className="w-[30%]"
    //           label={<Title title="Ngày bắt đầu dự án" />}
    //           name="processingDate"
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa chọn ngày bắt đầu!",
    //             },
    //           ]}
    //         >
    //           <ConfigProvider locale={viVN}>
    //             <DatePicker
    //               size="large"
    //               defaultValue={
    //                 form.getFieldValue("processingDate")
    //                   ? dayjs(
    //                       form.getFieldValue("processingDate"),
    //                       "YYYY-MM-DD"
    //                     )
    //                   : null
    //               }
    //               className="w-full"
    //               onChange={(value) => {
    //                 form.setFieldsValue({
    //                   processingDate: moment(value?.$d).format("YYYY-MM-DD"),
    //                 });
    //               }}
    //               disabledDate={(current) => {
    //                 const startDate = form.getFieldValue("date")?.[0];
    //                 const endDate = form.getFieldValue("date")?.[1];

    //                 if (!startDate && !endDate) {
    //                   return current && current < moment().startOf("day");
    //                 }

    //                 return (
    //                   current >
    //                   moment(startDate, "YYYY-MM-DD")
    //                     .add(1, "day")
    //                     .startOf("day")
    //                   //  || current > moment(endDate, "YYYY-MM-DD").endOf("day")
    //                 );
    //               }}
    //               format={"DD/MM/YYYY"}
    //             />
    //           </ConfigProvider>
    //         </Form.Item>
    //       </div>

    //       <div className="flex space-x-10">
    //         <Form.Item
    //           className="w-[40%]"
    //           label={<Title title="Thể loại sự kiện" />}
    //           name="eventTypeId"
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa chọn thể loại sự kiện!",
    //             },
    //           ]}
    //         >
    //           <Select
    //             size="large"
    //             options={
    //               eventType?.map((item) => ({
    //                 value: item?.id,
    //                 label: item?.typeName,
    //               })) ?? []
    //             }
    //             loading={eventTypeIsLoading}
    //             placeholder="Chọn 1 thể loại"
    //           />
    //         </Form.Item>

    //         <Form.Item
    //           className="w-[30%]"
    //           label={<Title title="Ngân sách ước lượng" />}
    //           name="estBudget"
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập ngân sách!",
    //             },
    //           ]}
    //         >
    //           <div className="flex items-center gap-x-3">
    //             <InputNumber
    //               size="large"
    //               className="w-full"
    //               defaultValue={form.getFieldValue("estBudget")}
    //               min={10000}
    //               step={100000}
    //               formatter={(value) =>
    //                 `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //               }
    //               parser={(value) => {
    //                 form.setFieldsValue({
    //                   estBudget: value.replace(/,/g, ""),
    //                 });
    //                 return `${value}`.replace(/,/g, "");
    //               }}
    //               onStep={(value) => {
    //                 form.setFieldsValue({ estBudget: value });
    //               }}
    //             />
    //             <p className="text-base font-medium">VNĐ</p>
    //           </div>
    //         </Form.Item>
    //       </div>

    //       <Form.Item
    //         className="w-[20%]"
    //         name="coverUrl"
    //         label={<Title title="Ảnh về sự kiện" />}
    //         valuePropName="fileList"
    //         getValueFromEvent={(e) => e?.fileList}
    //         rules={[
    //           {
    //             required: true,
    //             message: "Chưa chọn ảnh đại diện",
    //           },
    //           {
    //             validator(_, fileList) {
    //               return new Promise((resolve, reject) => {
    //                 if (fileList && fileList[0]?.size > 10 * 1024 * 1024) {
    //                   reject("File quá lớn ( <10MB )");
    //                 } else {
    //                   resolve();
    //                 }
    //               });
    //             },
    //           },
    //         ]}
    //       >
    //         <Upload.Dragger
    //           maxCount={1}
    //           listType="picture"
    //           customRequest={({ file, onSuccess }) => {
    //             setTimeout(() => {
    //               onSuccess("ok");
    //             }, 0);
    //           }}
    //           showUploadList={{
    //             showPreviewIcon: false,
    //           }}
    //           beforeUpload={(file) => {
    //             return new Promise((resolve, reject) => {
    //               if (file && file?.size > 10 * 1024 * 1024) {
    //                 reject("File quá lớn ( <10MB )");
    //                 return false;
    //               } else {
    //                 setFileList(file);
    //                 resolve();
    //                 return true;
    //               }
    //             });
    //           }}
    //         >
    //           Kéo tập tin vào đây
    //         </Upload.Dragger>
    //       </Form.Item>

    //       <div
    //         className={clsx(
    //           "flex justify-between",
    //           { "mt-5": fileList },
    //           { "mt-10": !fileList }
    //         )}
    //       >
    //         <Button
    //           onClick={() => setCurrent((prev) => prev - 1)}
    //           size="large"
    //           type="default"
    //         >
    //           Quay lại
    //         </Button>
    //         <Button
    //           className=""
    //           onClick={() => {
    //             form
    //               .validateFields()
    //               .then((values) => {
    //                 console.log("success > ", values);
    //                 setCurrent((prev) => prev + 1);
    //               })
    //               .catch((errorInfo) => {
    //                 console.log("Validation Fields:", errorInfo);
    //                 const values = errorInfo.values;
    //                 if (
    //                   !!values.date &&
    //                   !!values.processingDate &&
    //                   !!values.description &&
    //                   !!values.estBudget &&
    //                   !!values.coverUrl
    //                 ) {
    //                   setCurrent((prev) => prev + 1);
    //                 }
    //               });
    //           }}
    //           size="large"
    //           type="primary"
    //         >
    //           Tiếp tục
    //         </Button>
    //       </div>
    //     </>
    //   ),
    // },
    // {
    //   key: 3,
    //   title: "Điều khoản hợp đồng",
    //   content: (
    //     <>
    //       <div className="flex space-x-10">
    //         <Form.Item
    //           className="w-1/2"
    //           label={<Title title="Tên khách hàng" />}
    //           // name="customerName"
    //           name={["contract", "customerName"]}
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập tên khách hàng!",
    //             },
    //           ]}
    //           onChange={(value) => {
    //             // Update to specific field
    //             form.setFieldsValue({
    //               contract: { customerName: value.target.value },
    //             });
    //           }}
    //         >
    //           <Input disabled placeholder="Nhập tên khách hàng" size="large" />
    //         </Form.Item>

    //         <Form.Item
    //           className="w-1/2"
    //           label={<Title title="Email" />}
    //           // name="customerEmail"
    //           name={["contract", "customerEmail"]}
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập email khách hàng!",
    //             },
    //             {
    //               type: "email",
    //               message: "Địa chỉ email không hợp lệ!",
    //             },
    //           ]}
    //           onChange={(value) => {
    //             // Update to specific field
    //             form.setFieldsValue({
    //               contract: { customerEmail: value.target.value },
    //             });
    //           }}
    //         >
    //           <Input
    //             disabled
    //             placeholder="Nhập email khách hàng"
    //             size="large"
    //           />
    //         </Form.Item>
    //       </div>

    //       <Form.Item
    //         className="w-full"
    //         label={<Title title="Địa chỉ" />}
    //         // name="customerAddress"
    //         name={["contract", "customerAddress"]}
    //         rules={[
    //           {
    //             required: true,
    //             message: "Chưa nhập địa chỉ khách hàng!",
    //           },
    //         ]}
    //         onChange={(value) => {
    //           // Update to specific field
    //           form.setFieldsValue({
    //             contract: { customerAddress: value.target.value },
    //           });
    //         }}
    //       >
    //         <Input
    //           disabled
    //           placeholder="Nhập địa chỉ khách hàng"
    //           size="large"
    //         />
    //       </Form.Item>

    //       <div className="flex space-x-10">
    //         <Form.Item
    //           className="flex-1"
    //           label={<Title title="Căn cước công dân / Chứng minh nhân dân" />}
    //           // name="customerNationalId"
    //           name={["contract", "customerNationalId"]}
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập CCCD / CMND!",
    //             },
    //             {
    //               pattern: /^[0-9]{12}$/,
    //               message: "CCCD / CMND cần bao gồm 12 số!",
    //             },
    //           ]}
    //           onChange={(value) => {
    //             // Update to specific field
    //             form.setFieldsValue({
    //               contract: { customerNationalId: value.target.value },
    //             });
    //           }}
    //         >
    //           <Input
    //             disabled
    //             pattern="[0-9]*"
    //             maxLength={12}
    //             placeholder="Nhập CCCD / CMND"
    //             size="large"
    //           />
    //         </Form.Item>

    //         <div className="w-[10%] rounded-lg overflow-hidden">
    //           <Image
    //             className="rounded-lg overflow-hidden"
    //             src={
    //               contactInfo?.customerInfo?.nationalImages ??
    //               "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    //             }
    //           />
    //         </div>

    //         <Form.Item
    //           className="flex-1"
    //           label={<Title title="Số điện thoại" />}
    //           // name="customerPhoneNumber"
    //           name={["contract", "customerPhoneNumber"]}
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập số điện thoại khách hàng!",
    //             },
    //             {
    //               pattern: /^[0-9]{10}$/,
    //               message: "Số điện thoại cần phải có 10 số!",
    //             },
    //           ]}
    //           onChange={(value) => {
    //             // Update to specific field
    //             form.setFieldsValue({
    //               contract: { customerPhoneNumber: value.target.value },
    //             });
    //           }}
    //         >
    //           <Input
    //             disabled
    //             pattern="[0-9]*"
    //             maxLength={10}
    //             max={10}
    //             placeholder="Nhập số điện thoại khách hàng"
    //             size="large"
    //           />
    //         </Form.Item>
    //       </div>

    //       <div className="flex space-x-10">
    //         <Form.Item
    //           className="w-[30%]"
    //           label={<Title title="Giá trị hợp đồng" />}
    //           name={["contract", "contractValue"]}
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập giá trị hợp đồng!",
    //             },
    //             {
    //               pattern: /^[0-9,]*$/,
    //               message: "Giá trị hợp đồng không có hiệu lực!!",
    //             },
    //           ]}
    //         >
    //           {/* <Input placeholder="Nhập giá trị hợp đồng" size="large" /> */}
    //           <div className="flex items-center gap-x-3">
    //             <InputNumber
    //               size="large"
    //               value={form.getFieldsValue().contract?.contractValue}
    //               className="w-full"
    //               placeholder="Nhập giá trị hợp đồng"
    //               min={0}
    //               step={100000}
    //               formatter={(value) =>
    //                 `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //               }
    //               parser={(value) => {
    //                 form.setFieldsValue({
    //                   contract: { contractValue: +value.replace(/,/g, "") },
    //                 });
    //                 return `${value}`.replace(/,/g, "");
    //               }}
    //               onStep={(value) => {
    //                 form.setFieldsValue({
    //                   contract: { contractValue: +value },
    //                 });
    //               }}
    //             />
    //             <p className="text-base">VNĐ</p>
    //           </div>
    //         </Form.Item>
    //         <Form.Item
    //           className="w-[30%]"
    //           label={<Title title="Hình thức thanh toán" />}
    //           // name="paymentMethod"
    //           name={["contract", "paymentMethod"]}
    //           rules={[
    //             {
    //               required: true,
    //               message: "Chưa nhập hình thức thanh toán!",
    //             },
    //           ]}
    //           onChange={(value) => {
    //             // Update to specific field
    //             form.setFieldsValue({
    //               contract: { paymentMethod: value.target.value },
    //             });
    //           }}
    //         >
    //           <Select
    //             options={[
    //               {
    //                 value: "Tiền Mặt",
    //                 label: "Tiền Mặt",
    //               },
    //               {
    //                 value: "Chuyển Khoản",
    //                 label: "Chuyển Khoản",
    //               },
    //             ]}
    //             placeholder="Chọn hình thức thanh toán"
    //             size="large"
    //           />
    //         </Form.Item>
    //       </div>

    //       <div className="flex justify-between mt-5">
    //         <Button
    //           onClick={() => setCurrent((prev) => prev - 1)}
    //           size="large"
    //           type="default"
    //         >
    //           Quay lại
    //         </Button>

    //         <Button size="large" type="primary" onClick={() => form.submit()}>
    //           Tạo sự kiện
    //         </Button>
    //       </div>
    //     </>
    //   ),
    // },
    {
      key: 4,
      title: "Hạng mục",
      content: (
        <>
          <div className="mb-10">
            <Title title="Ngân sách" />
            <div className="flex justify-between my-1">
              <p className="text-base text-slate-400">Đã sử dụng</p>
              <p className="text-base text-slate-400">Hạn mức</p>
            </div>
            <ConfigProvider theme={{}}>
              <Progress
                percent={10}
                // success={{ percent: 10 }}
              />
            </ConfigProvider>
            <div className="flex justify-between">
              <p className="text-lg text-slate-500 font-medium">10,000 VNĐ</p>
              <p className="text-lg text-slate-500 font-medium">100,000 VNĐ</p>
            </div>
          </div>

          <div className="mb-10">
            <Title title="Hạng mục mẫu" />
            <div className="flex flex-wrap items-center mt-5">
              {!!selectTemplateTasks?.length &&
                selectTemplateTasks?.map((item) => (
                  <DefaultTemplateTask custom />
                ))}

              <div className="w-[45%] mx-[2.5%] flex justify-center items-center">
                <div
                  onClick={() => setIsDrawerOpen(true)}
                  className="w-28 h-28 flex justify-center items-center border-dashed border-4 rounded-xl cursor-pointer border-slate-200 group hover:border-black/30 transition-colors"
                >
                  <FaPlus className="text-2xl text-slate-200 group-hover:text-black/30 transition-colors" />
                </div>
              </div>

              {/* <DefaultTemplateTask /> */}
            </div>
          </div>

          <div className="">
            <Title title="Hạng mục mặc định" />
            <div className="flex flex-wrap mt-5">
              <DefaultTemplateTask isDefault />
              <DefaultTemplateTask isDefault />
              <DefaultTemplateTask isDefault />
              <DefaultTemplateTask isDefault />
              <DefaultTemplateTask isDefault />
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Fragment>
      <LockLoadingModal
        isModalOpen={
          uploadIsLoading || createEventIsLoading
          // createContractIsLoading ||
          // createContractIsLoading
        }
        label="Đang khởi tạo sự kiện ..."
      />

      <DrawerContainer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        toggleSelectTemplateTasks={toggleSelectTemplateTasks}
        messageApi={messageApi}
      />

      <motion.div
        initial={{ y: -75 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center"
      >
        <p className="text-base font-medium text-slate-400">
          <Link to=".." relative="path">
            Sự kiện{" "}
          </Link>
          / Tạo mới
        </p>
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white px-8 py-5 rounded-2xl mt-6"
      >
        <Spin spinning={contactInfoIsLoading}>
          {contactInfoIsLoading ? (
            <div className="h-[calc(100vh/2)]" />
          ) : (
            <div className="min-h-[calc(100vh*2/3)]">
              <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                initialValues={{
                  location: contactInfo?.address,
                  description: contactInfo?.note
                    ? {
                        ops: JSON.parse(
                          contactInfo?.note?.startsWith(`[{"`)
                            ? contactInfo?.note
                            : parseJson(contactInfo?.note)
                        ),
                      }
                    : null,
                  date: [
                    momenttz(contactInfo?.startDate).format("YYYY-MM-DD"),
                    momenttz(contactInfo?.endDate).format("YYYY-MM-DD"),
                  ],
                  eventTypeId: location.state?.eventType,
                  estBudget: contactInfo?.budget ?? 0,
                  contract: {
                    customerName: contactInfo?.customerInfo?.fullName,
                    customerEmail: contactInfo?.customerInfo?.email,
                    customerAddress: contactInfo?.customerInfo?.address,
                    customerNationalId: contactInfo?.customerInfo?.nationalId,
                    customerPhoneNumber: contactInfo?.customerInfo?.phoneNumber,
                    contractValue: contactInfo?.budget ?? 0,
                    paymentMethod: "Chuyển Khoản",
                  },
                }}
              >
                <Steps direction="horizontal" current={current} items={steps} />

                <div className="mt-8">{steps[current].content}</div>

                <div className="h-0 overflow-hidden">
                  <Form.Item
                    name="eventName"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập tên sự kiện!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập địa điểm!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập mô tả!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="date"
                    rules={[
                      {
                        validator: (rule, value) => {
                          if (value && value[0] && value[1]) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Chưa chọn thời gian tổ chức");
                        },
                      },
                    ]}
                  />
                  <Form.Item
                    name="processingDate"
                    rules={[
                      {
                        required: true,
                        message: "Chưa chọn ngày bắt đầu!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="eventTypeId"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập ngân sách!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="estBudget"
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập ngân sách!",
                      },
                    ]}
                  />
                  <Form.Item
                    name="coverUrl"
                    rules={[
                      {
                        required: true,
                        message: "Chưa chọn ảnh đại diện",
                      },
                      {
                        validator(_, fileList) {
                          return new Promise((resolve, reject) => {
                            if (
                              fileList &&
                              fileList[0]?.size > 10 * 1024 * 1024
                            ) {
                              reject("File quá lớn ( <10MB )");
                            } else {
                              resolve();
                            }
                          });
                        },
                      },
                    ]}
                  />

                  <Form.Item
                    // name="customerName"
                    name={["contract", "customerName"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập tên khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerNationalId"
                    name={["contract", "customerNationalId"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập CCCD / CMND!",
                      },
                      {
                        pattern: /^[0-9]{12}$/,
                        message: "CCCD / CMND cần phải có 12 số!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerAddress"
                    name={["contract", "customerAddress"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập địa chỉ khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerEmail"
                    name={["contract", "customerEmail"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập email khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="customerPhoneNumber"
                    name={["contract", "customerPhoneNumber"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập số điện thoại khách hàng!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại cần phải có 10 số!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="contractValue"
                    name={["contract", "contractValue"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập giá trị hợp đồng khách hàng!",
                      },
                    ]}
                  />
                  <Form.Item
                    // name="paymentMethod"
                    name={["contract", "paymentMethod"]}
                    rules={[
                      {
                        required: true,
                        message: "Chưa nhập hình thức thanh toán!",
                      },
                    ]}
                  />
                </div>
              </Form>
            </div>
          )}
        </Spin>
      </motion.div>
    </Fragment>
  );
};

export default memo(EventCreationPage);
