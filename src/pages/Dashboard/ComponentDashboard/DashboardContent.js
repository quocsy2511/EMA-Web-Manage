// import React from "react";
// import { Column, Pie } from "@ant-design/plots";
// import HeadingTitle from "../../../components/common/HeadingTitle";
// import { Progress } from "antd";

// const DashboardContent = ({ selectEvent }) => {
//   //   Công việc của nhận viên
//   const dataColumn = [
//     {
//       name: "Công việc hoàn thành",
//       thang: "11/10",
//       value: 18,
//     },
//     {
//       name: "Công việc hoàn thành",
//       thang: "12/10",
//       value: 28,
//     },
//     {
//       name: "Công việc hoàn thành",
//       thang: "13/10",
//       value: 39,
//     },
//     {
//       name: "Công việc hoàn thành",
//       thang: "14/10",
//       value: 81,
//     },
//     {
//       name: "Công việc hoàn thành",
//       thang: "15/10",
//       value: 47,
//     },
//     {
//       name: "Công việc hoàn thành",
//       thang: "16/10",
//       value: 20,
//     },
//     {
//       name: "Công việc hoàn thành",
//       thang: "17/10",
//       value: 24,
//     },
//     {
//       name: "Công việc hoàn thành",
//       thang: "18/10",
//       value: 35,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "11/10",
//       value: 12,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "12/10",
//       value: 23,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "13/10",
//       value: 34,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "14/10",
//       value: 150,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "15/10",
//       value: 52,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "16/10",
//       value: 35,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "17/10",
//       value: 37,
//     },
//     {
//       name: "Công việc đang diễn ra",
//       thang: "18/10",
//       value: 42,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "11/10",
//       value: 16,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "12/10",
//       value: 27,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "13/10",
//       value: 38,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "14/10",
//       value: 80,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "15/10",
//       value: 45,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "16/10",
//       value: 22,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "17/10",
//       value: 26,
//     },
//     {
//       name: "Công việc đã huỷ",
//       thang: "18/10",
//       value: 39,
//     },
//   ];

//   const configColumn = {
//     data: dataColumn,
//     isGroup: true,
//     xField: "thang",
//     yField: "value",
//     seriesField: "name",
//     columnStyle: {
//       radius: [10, 10, 0, 0],
//     },
//     // intervalPadding: 50, // độ rộng cột to -> càng lơn thì cột bên càng nhỏ
//     // dodgePadding: 1, // khoảng cách giữa các cột nhỏ bên trong
//     //label là cái số ở giữa mỗi cột
//     label: {
//       position: "middle",
//       layout: [
//         {
//           type: "interval-adjust-position",
//         },
//         {
//           type: "interval-hide-overlap",
//         },
//         {
//           type: "adjust-color",
//         },
//       ],
//     },
//   };
//   // % tổng công việc hoàn thành
//   const conicColors = {
//     "0%": "#87d068",
//     "50%": "#ffe58f",
//     "100%": "#ffccc7",
//   };

//   //donut
//   const dataDonut = [
//     {
//       type: "Nhân viên 1",
//       value: 27,
//     },
//     {
//       type: "Nhân viên 2",
//       value: 25,
//     },
//     {
//       type: "Nhân viên 3",
//       value: 18,
//     },
//     {
//       type: "Nhân viên 4",
//       value: 15,
//     },
//     {
//       type: "Nhân viên 5",
//       value: 10,
//     },
//     {
//       type: "Nhân viên 6",
//       value: 5,
//     },
//   ];

//   const configDonut = {
//     appendPadding: 10, //muốn to thì số nhỏ độ lớn của donut
//     data: dataDonut,
//     angleField: "value",
//     colorField: "type",
//     radius: 1, //bán kính cảu donut không chỉnh
//     innerRadius: 0.6, //bán kính của donut là tròng bên trong của donut
//     label: {
//       //nổi dụng bên trong mỗi phần của cái donut
//       type: "inner",
//       offset: "-50%",
//       content: "{value}",
//       style: {
//         textAlign: "center",
//         fontSize: 14,
//       },
//     },
//     interactions: [
//       //xác định tương tác là bấm zô cái menu bên phải thì nó sẽ hoạt động
//       {
//         type: "element-selected",
//       },
//       {
//         type: "element-active",
//       },
//     ],
//     statistic: {
//       //nội dung bên trong của donut
//       title: false,
//       content: null,
//     },
//     height: 230,
//   };

//   return (
//     <div className="w-full bg-bgG h-full space-y-1">
//       <div className="flex flex-row pt-3">
//         {/* column */}
//         <div className="w-3/4 bg-white px-4 py-3 ml-2 rounded-lg">
//           <HeadingTitle>Công việc trong sự kiện </HeadingTitle>
//           <Column {...configColumn} />
//         </div>
//         {/* donut vs Progress */}
//         <div className="w-1/4 bg-white py-3 px-4 mx-2 rounded-lg flex flex-col gap-y-8">
//           <div>
//             <HeadingTitle>Số lượng công việc của nhân viên </HeadingTitle>
//             <Pie {...configDonut} />
//           </div>
//           <div>
//             <HeadingTitle> Công việc đã hoàn thành </HeadingTitle>
//             <div className="flex flex-row justify-around">
//               <div className="flex flex-col justify-center ">
//                 <Progress
//                   type="dashboard"
//                   percent={10}
//                   strokeColor={conicColors}
//                 />
//                 <h1 className="font-medium text-center text-gray-400">
//                   Trưởng bộ phận
//                 </h1>
//               </div>
//               <div className="flex flex-col justify-center ">
//                 <Progress
//                   type="dashboard"
//                   percent={20}
//                   strokeColor={conicColors}
//                 />
//                 <h1 className="font-medium text-center text-gray-400">
//                   Nhân viên
//                 </h1>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-full flex-1 pt-3">
//         <div className="bg-white px-4 py-3 ml-2 rounded-lg">
//           <h1> employee</h1>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DashboardContent;
