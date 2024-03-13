import React, { Fragment } from "react";

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
  return <Fragment></Fragment>;
};

export default PlanningPage;