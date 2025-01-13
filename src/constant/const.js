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

export const renderSorting = (title, dataIndex, key) => {
  return {
    title: title,
    dataIndex: dataIndex,
    key: key,
    sorter: (a, b) => {
      // Calculate the percentage for sorting dynamically
      const percentageA = getPercentage(
        Number(a[dataIndex]) || 0,
        (Number(a?.toiletclean) || 0) + (Number(a?.toiletunclean) || 0)
      );
      const percentageB = getPercentage(
        Number(b[dataIndex]) || 0,
        (Number(b?.toiletclean) || 0) + (Number(b?.toiletunclean) || 0)
      );
      return percentageA - percentageB; // Compare the percentages
    },
    width: 50,
    render: (text, record) => {
      // Render the percentage for the given column dynamically
      return text
        ? getPercentage(
            Number(record[dataIndex]) || 0,
            (Number(record?.toiletclean) || 0) +
              (Number(record?.toiletunclean) || 0)
          ) + " %"
        : "0 %";
    },
  };
};

export const renderMonitoringSorting = (title, dataIndex, key) => {
  return {
    title: title,
    dataIndex: dataIndex,
    key: key,
    sorter: (a, b) => {
      const percentageA = getPercentage(
        Number(a[dataIndex]) || 0,
        Number(a?.registered) || 1
      );
      const percentageB = getPercentage(
        Number(b[dataIndex]) || 0,
        Number(b?.registered) || 1
      );
      return percentageA - percentageB; // Compare the percentages
    },
    width: 50,
    render: (text, record) => {
      // Render the percentage for the given column dynamically
      return text
        ? getPercentage(
            Number(record[dataIndex]) || 0,
            Number(record?.registered) || 1
          ) + " %"
        : "0 %";
    },
  };
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
    width: 200,
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
  renderMonitoringSorting(
    "Monitoring (%)",
    "todaysmonitaring",
    "todaysmonitaring%"
  ),
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
  renderSorting("Not Compliant (%)", "not_compliant", "not_compliant%"),
  {
    title: "Toilet Unclean",
    dataIndex: "toiletunclean",
    key: "toiletunclean",
    width: 50,
    sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
  },
  renderSorting("Toilet Unclean (%)", "toiletunclean", "toiletunclean%"),
  {
    title: "Toilet Clean",
    dataIndex: "toiletclean",
    key: "toiletclean",
    width: 50,
    sorter: (a, b) => a?.toiletclean - b?.toiletclean,
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

export const gsdWiseMonitoringcolumns = [
  {
    title: "GSD Name",
    dataIndex: "name",
    key: "name",
    width: 100,
    sorter: (a, b) => {
      const nameA = a?.name ? a?.name?.toString() : "";
      const nameB = b?.name ? b?.name?.toString() : "";
      return nameA?.localeCompare(nameB);
    },
  },
  // {
  //   title: "Total Quantity",
  //   dataIndex: "total",
  //   key: "total",
  //   width: 50,
  //   sorter: (a, b) => a?.total - b?.total,
  // },
  // {
  //   title: "Registered",
  //   dataIndex: "registered",
  //   key: "registered",
  //   width: 50,
  //   sorter: (a, b) => a?.total - b?.total,
  // },
  {
    title: "Total Allocation",
    dataIndex: "total_allocation",
    key: "total_allocation",
    width: 50,
    sorter: (a, b) => a?.total_allocation - b?.total_allocation,
  },
  {
    title: "Monitoring",
    dataIndex: "todaysmonitaring",
    key: "todaysmonitaring",
    width: 50,
    sorter: (a, b) => a?.todaysmonitaring - b?.todaysmonitaring,
  },
  // renderMonitoringSorting(
  //   "Monitoring (%)",
  //   "todaysmonitaring",
  //   "todaysmonitaring%"
  // ),
  // {
  //   title: "Partially Compliant",
  //   dataIndex: "partially_compliant",
  //   key: "partially_compliant",
  //   width: 50,
  //   sorter: (a, b) => a?.partially_compliant - b?.partially_compliant,
  // },
  // {
  //   title: "Compliant",
  //   dataIndex: "compliant",
  //   key: "compliant",
  //   width: 50,
  //   sorter: (a, b) => a?.compliant - b?.compliant,
  // },
  // {
  //   title: "Not Compliant",
  //   dataIndex: "not_compliant",
  //   key: "not_compliant",
  //   width: 50,
  //   sorter: (a, b) => a?.not_compliant - b?.not_compliant,
  // },
  // renderSorting("Not Compliant (%)", "not_compliant", "not_compliant%"),
  // {
  //   title: "Toilet Unclean",
  //   dataIndex: "toiletunclean",
  //   key: "toiletunclean",
  //   width: 50,
  //   sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
  // },
  // renderSorting("Toilet Unclean (%)", "toiletunclean", "toiletunclean%"),
  // {
  //   title: "Toilet Clean",
  //   dataIndex: "toiletclean",
  //   key: "toiletclean",
  //   width: 50,
  //   sorter: (a, b) => a?.toiletclean - b?.toiletclean,
  // },
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

export const staticUserRole = [
  { value: "1", label: "Super Admin" },
  { value: "2", label: "Admin" },
  { value: "3", label: "Mela Adhikari" },
  { value: "4", label: "Additional Mela Adhikari" },
  { value: "5", label: "Incharge Sanitation" },
  { value: "6", label: "Monitoring Agent (Swachhagrahis)" },
  { value: "7", label: "Supervisor Monitoring Agent (Swachhagrahis)" },
  { value: "8", label: "Vendor" }, // If you want to include Vendor, uncomment and add label
  { value: "9", label: "Sector Medical Officer (SMO)" },
  { value: "10", label: "Sub Divisional Magistrate (SDM)" },
  { value: "11", label: "Gram Panchayat / Vikas Adhikari" },
  { value: "12", label: "Circle Inspector" },
  { value: "13", label: "Vendor Supervisor" },
  { value: "14", label: "Nayab Tahsildar / Sector Magistrate" },
];
