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

export const getPercentage = (numerator, denominator) => {
  if (!numerator || !denominator) {
    return 0;
  }
  const num = Number(numerator) || 0;
  const den = Number(denominator) || 1;
  const percentage = (num * 100) / den;

  // return Number(percentage.toFixed(2));
  return Math.round(percentage); // Round the percentage to the nearest integer
};

export const statusOptions = [
  { value: 1, label: "Active" },
  { value: 2, label: "Deactive" },
];

export const yesNoType = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];
export const cleanStatus = [
  { value: "clean", label: "Clean" },
  { value: "unclean", label: "Unclean" },
];
export const CompliantStatus = [
  { value: "compliant", label: "Compliant" },
  { value: "partial_compliant", label: "Partial Compliant" },
  { value: "not_compliant", label: "Not Compliant" },
];

export const QuestionType = [
  { value: "M", label: "Maintenance" },
  { value: "C", label: "Cleaning" },
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
    width: 350,
    sorter: (a, b) => {
      const nameA = a?.name ? a?.name?.toString() : "";
      const nameB = b?.name ? b?.name?.toString() : "";
      return nameA?.localeCompare(nameB);
    },
  },
  {
    title: "Total Quantity",
    dataIndex: "total",
    key: "total",
    width: 50,
    sorter: (a, b) => a?.total - b?.total,
  },
  {
    title: "Registered",
    dataIndex: "registered",
    key: "registered",
    width: 50,
    sorter: (a, b) => a?.total - b?.total,
  },
  {
    title: "Monitoring",
    dataIndex: "todaysmonitaring",
    key: "todaysmonitaring",
    width: 50,
    sorter: (a, b) => a?.todaysmonitaring - b?.todaysmonitaring,
  },
  {
    title: "Partially Compliant",
    dataIndex: "partially_compliant",
    key: "partially_compliant",
    width: 50,
    sorter: (a, b) => a?.partially_compliant - b?.partially_compliant,
  },
  {
    title: "Compliant",
    dataIndex: "compliant",
    key: "compliant",
    width: 50,
    sorter: (a, b) => a?.compliant - b?.compliant,
  },
  {
    title: "Not Compliant",
    dataIndex: "not_compliant",
    key: "not_compliant",
    width: 50,
    sorter: (a, b) => a?.not_compliant - b?.not_compliant,
  },
  {
    title: "Toilet Unclean",
    dataIndex: "toiletunclean",
    key: "toiletunclean",
    width: 50,
    sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
  },
];

// asset type list and vehicle dashboard
export const vendorColumn = [
  {
    title: "Sr No",
    dataIndex: "sr_no",
    key: "sr_no",
    width: "10%",
  },
  {
    title: "Vendor Name",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "Allotted Quantity",
    dataIndex: "total_allotted_quantity",
    key: "total_allotted_quantity",
    width: "20%",
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
