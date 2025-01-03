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

export const checkLoginAvailability = (loginData, navigate) => {
  if (loginData) {
    if (loginData?.user_type_id === "8") {
      if (loginData?.allocatedmaintype?.[0]?.asset_main_type_id === "2") {
        navigate("/tentage-dashboard"); // vendor login tentage
      } else {
        navigate("/vendor-dashboard"); // vendor login
      }
    } else {
      navigate("/sanitation-dashboard");
    }
  } else {
    navigate("/login");
  }
};

export const statusOptions = [
  { value: 1, label: "Active" },
  { value: 2, label: "Deactive" },
];

export const yesNoType = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];

export const vehicleType = [
  { value: "Compactor", label: "Compactor" },
  { value: "Tipper", label: "Tipper" },
];

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

export const dateDayOptions = [
  {
    label: "Today",
    value: "Today",
  },
  {
    label: "Select Date",
    value: "date",
  },
];

export const VendorWiseReportcolumns = [
  {
    title: "Vendor Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Total Quantity",
    dataIndex: "total",
    key: "total",
  },
  {
    title: "Registered",
    dataIndex: "registered",
    key: "registered",
  },
  {
    title: "Clean",
    dataIndex: "clean",
    key: "clean",
  },
  {
    title: "Maintenance",
    dataIndex: "maintenance",
    key: "maintenance",
  },
  {
    title: "Unclean",
    dataIndex: "unclean",
    key: "unclean",
  },
];

const nameColumn = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
];

// total quantity
export const tableColumn = [
  ...nameColumn,
  {
    title: "Total Quantity",
    dataIndex: "total_quantity",
    key: "total_quantity",
    width: "20%",
  },
];

// register quantity
export const registerColumn = [
  ...nameColumn,
  {
    title: "Registered Quantity",
    dataIndex: "registered",
    key: "registered",
    width: "20%",
    render: (text) => {
      return text ? text : 0;
    },
  },
];

export const priorityToiletTypes_Id = ["1", "2", "3", "4", "5"];
