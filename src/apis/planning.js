import http from "../utils/axios-utils";

export const downloadTemplate = () =>
  http({
    url: "/items/download-template",
  });

export const exportPlan = (eventId) =>
  http({
    url: `/items/export-plan?eventId=${eventId}`,
  });

export const getPlanByEvent = (eventId) =>
  http({
    url: `/items/${eventId}`,
  });

// data = [
//   {
//     categoryId: "string",
//     items: [
//       {
//         itemName: "string",
//         description: "string",
//         priority: 0,
//         plannedAmount: 0,
//         plannedPrice: 0,
//         plannedUnit: "string",
//       },
//     ],
//   },
// ];
export const postPlan = (eventId, data) =>
  http({
    url: `/items/${eventId}`,
    method: "post",
    data,
  });

export const importCSV = (formData) =>
  http({
    url: "/items/import-csv",
    method: "post",
    data: formData,
  });

// {
//   itemName: "string",
//   description: "string",
//   priority: 0,
//   plannedAmount: 0,
//   plannedPrice: 0,
//   plannedUnit: "string",
//   categoryId: "string",
// };
export const updatePlanItem = (itemId, data) =>
  http({
    url: `/items/${itemId}`,
    method: "post",
    data,
  });

export const deletePlanItem = (itemId) =>
  http({
    url: `/items/${itemId}`,
    method: "delete",
  });
