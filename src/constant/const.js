// Get label using id, list and default name
export const getValueLabel = (dataId, List, defaultName) => {
  if (dataId) {
    const status = List && List?.find((data) => data?.value === dataId);
    return status ? status?.label : defaultName;
    // return status ? status?.label : dataId;
  } else {
    return `${defaultName}`;
  }
};

export const dateOptions = [
  {
    label: "Today",
    value: "Today",
  },
  {
    label: "Current Month",
    value: "Current Month",
  },
  {
    label: "From Date to Date",
    value: "Date Range",
  },
];

export const dateWeekOptions = [
  {
    label: "Today",
    value: "Today",
  },
  // {
  //   label: "Week",
  //   value: "Week",
  // },
  {
    label: "From Date - to Date",
    value: "Date Range",
  },
];

export const priorityToiletTypes_Id = ["1", "2", "3", "4", "5"];

// dashboard
export const priorityToiletTypes = [
  "Type-1 FRP Septic Tank",
  "Type-2 FRP Soak Pit",
  "Type-3 FRP Urinals",
  "Type-4 Prefab Steel Septic Tank",
  "Type-5 Prefab Steel Soak Pit",
];


