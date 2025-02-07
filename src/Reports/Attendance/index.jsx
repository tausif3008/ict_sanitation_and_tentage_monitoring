import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import search from "../../assets/Dashboard/icon-search.png";
import {
  dateWeekOptions,
  getFormatedNumber,
  getValueLabel,
} from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
// import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
// import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import CustomTable from "../../commonComponents/CustomTable";
import ExportToExcel from "../ExportToExcel";
// import ExportToPDF from "../reportFile";
import URLS from "../../urils/URLS";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import MonitoringSelector from "../../complaince/monitoringSelector";
import { getAttendanceReports } from "./Slice/attendanceslice";
import AttendanceSelector from "./Slice/attendanceSelector";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";

const AttendanceReport = () => {
  // const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  // const [tableColumns, setTableColumns] = useState([
  //   {
  //     title: "Name",
  //     dataIndex: "name",
  //     key: "name",
  //     width: 150,
  //   },
  // ]);
  const [tableData, setTableData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  // const [count, setCount] = useState({
  //   total: 0,
  //   registered: 0,
  //   todaysmonitaring: 0,
  //   totalPendingMonitoring: 0,
  //   total_allocation: 0,
  // });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop
  const { AttendanceData, loading } = AttendanceSelector();

  const userRoleId = localStorage.getItem("role_id");
  const isSmoUser = Number(userRoleId) === 9;
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;
  const userSectorId = sessionData?.allocatedsectors?.[0]?.sector_id;
  const userSectorArray = sessionData?.allocatedsectors || [];

  const SectorArray = useMemo(() => {
    return (
      SectorListDrop?.filter((obj1) =>
        userSectorArray?.some((obj2) => obj2?.sector_id === obj1?.value)
      ) || []
    );
  }, [SectorListDrop, userSectorArray]);

  const agentName = getValueLabel(
    formValue?.user_id,
    monitoringAgentDrop,
    null
  );
  const sectorName = getValueLabel(formValue?.sector_id, SectorListDrop, null);
  // const percentageName = getValueLabel(
  //   `${formValue?.percentage}`,
  //   percentageOptions,
  //   null
  // );
  // const fileDateName = `(${dayjs(formValue?.date).format("DD-MMM-YYYY")})`;
  const fileDateName =
    formValue?.date_format === "Today"
      ? moment().format("DD-MMM-YYYY")
      : formValue?.date_format === "Date Range"
      ? `${dayjs(formValue?.form_date).format("DD-MMM-YYYY")} to ${dayjs(
          formValue?.to_date
        ).format("DD-MMM-YYYY")}`
      : "All Dates";

  // file name
  const getReportName = () => {
    let name = "Attendance";
    if (agentName) {
      name += `- ${agentName}`;
    }
    if (sectorName) {
      name += `- ${sectorName}`;
    }
    // if (percentageName) {
    //   name += `- ${percentageName}`;
    // }
    name += `- Report ${fileDateName}`;
    return name;
  };
  const fileName = getReportName();

  // const pdfTitleParam = [
  //   ...(formValue?.sector_id
  //     ? [
  //         {
  //           label: `Allocate Sector : ${sectorName || "Combined"}`,
  //         },
  //       ]
  //     : []),
  //   ...(formValue?.percentage
  //     ? [
  //         {
  //           label: `Monitoring Percentage :  ${percentageName || "Combined"}`,
  //         },
  //       ]
  //     : []),
  // ];

  const handleDateSelect = (value) => {
    if (value === "Date Range") {
      setShowDateRange(true);
    } else {
      form.setFieldsValue({
        form_date: null,
        to_date: null,
      });
      setShowDateRange(false);
    }
  };

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
  };

  // const getUsers = async (dataObj = {}) => {
  //   const startDate = dayjs(formValue?.form_date).format("YYYY-MM-DD");
  //   const endDate = dayjs(formValue?.to_date).format("YYYY-MM-DD");
  //   const newParam = {
  //     page: dataObj?.page || "1",
  //     per_page: dataObj?.size || "25",
  //     ...form.getFieldsValue(),
  //     ...(formValue?.date_format === "Date Range" && {
  //       form_date: startDate,
  //     }),
  //     ...(formValue?.date_format === "Date Range" && {
  //       to_date: endDate,
  //       date_format: null,
  //     }),
  //   };
  //   callApi(newParam);
  // };

  // fiter finish
  const onFinishForm = (values) => {
    const startDate = dayjs(values?.form_date).format("YYYY-MM-DD");
    const endDate = dayjs(values?.to_date).format("YYYY-MM-DD");
    const finalData = {
      ...values,
    };
    if (values.date_format === "Today") {
      finalData.form_date = moment().format("YYYY-MM-DD");
      finalData.to_date = moment().format("YYYY-MM-DD");
    } else {
      finalData.form_date = startDate;
      finalData.to_date = endDate;
    }
    finalData.date_format = null;
    callApi(finalData);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getCurrentData();
  };

  // current data
  const getCurrentData = () => {
    setShowDateRange(false);
    form.setFieldsValue({
      date_format: "Today",
      ...(isSmoUser && { sector_id: userSectorId }),
    });
    const finalValues = {
      page: 1,
      per_page: 10,
      form_date: moment().format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      ...(isSmoUser && { sector_id: userSectorId }),
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    dispatch(getAttendanceReports(data)); // vendor reports
  };

  useEffect(() => {
    getCurrentData();
    dispatch(getSectorsList()); // all sectors
    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls)); // monitoring agent list
  }, []);

  // const dynamicColumns = useMemo(() => {
  //   const columns = [
  //     {
  //       title: "Name",
  //       dataIndex: "name",
  //       key: "name",
  //       width: 80,
  //       sticky: "left", // Makes the "Name" column sticky on the left side
  //     },
  //   ];
  //   const dateKeys = new Set();
  //   const { users } = AttendanceData?.data || [];

  //   const transformedUsers = users?.map((user) => {
  //     const transformedUser = {
  //       user_id: user?.user_id,
  //       name: user?.name,
  //     };

  //     // Loop through the attendances_date and add the shift values for each date
  //     for (const date in user?.attendances_date) {
  //       const shifts = user?.attendances_date[date];
  //       transformedUser[`${date}_shift_1`] = shifts?.shift_1;
  //       transformedUser[`${date}_shift_2`] = shifts?.shift_2;
  //     }

  //     return transformedUser;
  //   });

  //   // Collect unique dates from the transformed user data
  //   transformedUsers?.forEach((user) => {
  //     Object.keys(user)?.forEach((key) => {
  //       const [date, shift] = key.split("_shift_");
  //       if (shift && date) {
  //         dateKeys.add(date);
  //       }
  //     });
  //   });

  //   // Add columns for each unique date and shift
  //   dateKeys?.forEach((date) => {
  //     columns?.push({
  //       title: `${date} Shift 1`,
  //       dataIndex: `${date}_shift_1`,
  //       key: `${date}_shift_1`,
  //       width: 50,
  //       render: (text) => {
  //         if (text === "1") {
  //           return (
  //             <span className="text-white bg-green-500 border border-black px-2 py-1 rounded my-2">
  //               Present
  //             </span>
  //           );
  //         } else if (text === "0") {
  //           return (
  //             <span className="text-white bg-red-500 border border-black px-2 py-1 rounded my-2">
  //               Absent
  //             </span>
  //           );
  //         } else {
  //           return "-";
  //         }
  //       },
  //     });

  //     columns.push({
  //       title: `${date} Shift 2`,
  //       dataIndex: `${date}_shift_2`,
  //       key: `${date}_shift_2`,
  //       width: 50,
  //       render: (text) => {
  //         if (text === "1") {
  //           return (
  //             <span className="text-white bg-green-500 border border-black px-2 py-1 rounded">
  //               Present
  //             </span>
  //           );
  //         } else if (text === "0") {
  //           return (
  //             <span className="text-white bg-red-500 border border-black px-2 py-1 rounded">
  //               Absent
  //             </span>
  //           );
  //         } else {
  //           return "-";
  //         }
  //       },
  //     });
  //   });

  //   return columns;
  // }, [AttendanceData]);

  const dynamicColumns = useMemo(() => {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 80,
        sticky: "left", // Makes the "Name" column sticky on the left side
      },
    ];

    const dateKeys = new Set();
    const { users } = AttendanceData?.data || [];

    const transformedUsers = users?.map((user) => {
      const transformedUser = {
        user_id: user?.user_id,
        name: user?.name,
      };

      // Loop through the attendances_date and add the shift values for each date
      for (const date in user?.attendances_date) {
        const shifts = user?.attendances_date[date];
        transformedUser[`${date}_shift_1`] = shifts?.shift_1;
        transformedUser[`${date}_shift_2`] = shifts?.shift_2;
      }

      return transformedUser;
    });

    // Collect unique dates from the transformed user data
    transformedUsers?.forEach((user) => {
      Object.keys(user)?.forEach((key) => {
        const [date, shift] = key.split("_shift_");
        if (shift && date) {
          dateKeys.add(date);
        }
      });
    });

    // Add columns for each unique date and group Shift 1 and Shift 2 under that date
    dateKeys?.forEach((date) => {
      columns.push({
        title: () => (
          <>
            {date}
            {/* <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <div style={{ width: "50%" }}>Shift 1</div>
              <div style={{ width: "50%" }}>Shift 2</div>
            </div> */}
          </>
        ),
        children: [
          {
            title: "Shift 1",
            dataIndex: `${date}_shift_1`,
            key: `${date}_shift_1`,
            width: 50,
            render: (text) => {
              if (text === "1") {
                return (
                  <span className="text-white bg-green-500 border border-black px-2 py-1 rounded my-2">
                    Present
                  </span>
                );
              } else if (text === "0") {
                return (
                  <span className="text-white bg-red-500 border border-black px-2 py-1 rounded my-2">
                    Absent
                  </span>
                );
              } else {
                return "-";
              }
            },
          },
          {
            title: "Shift 2",
            dataIndex: `${date}_shift_2`,
            key: `${date}_shift_2`,
            width: 50,
            render: (text) => {
              if (text === "1") {
                return (
                  <span className="text-white bg-green-500 border border-black px-2 py-1 rounded">
                    Present
                  </span>
                );
              } else if (text === "0") {
                return (
                  <span className="text-white bg-red-500 border border-black px-2 py-1 rounded">
                    Absent
                  </span>
                );
              } else {
                return "-";
              }
            },
          },
        ],
      });
    });

    return columns;
  }, [AttendanceData]);

  useEffect(() => {
    if (AttendanceData) {
      const { users } = AttendanceData?.data || [];
      const transformedUsers = users?.map((user) => {
        const transformedUser = {
          user_id: user?.user_id,
          name: user?.name,
        };
        // Loop through the attendances_date and add the shift values for each date
        for (const date in user?.attendances_date) {
          const shifts = user?.attendances_date[date];
          transformedUser[`${date}_shift_1`] = shifts?.shift_1;
          transformedUser[`${date}_shift_2`] = shifts?.shift_2;
        }

        return transformedUser;
      });

      const dateKeys = new Set();
      transformedUsers?.forEach((user) => {
        Object.keys(user)?.forEach((key) => {
          // Extract date and shift information from keys like '2025-01-28_shift_1'
          const [date, shift] = key.split("_shift_");
          if (shift && date) {
            dateKeys.add(date); // Collect unique dates
          }
        });
      });

      // Generate columns for each unique date and shift
      dateKeys?.forEach((date) => {
        dynamicColumns?.push({
          title: `${date} Shift 1`,
          dataIndex: `${date}_shift_1`,
          key: `${date}_shift_1`,
          width: 150,
        });
        dynamicColumns?.push({
          title: `${date} Shift 2`,
          dataIndex: `${date}_shift_2`,
          key: `${date}_shift_2`,
          width: 150,
        });
      });

      setTableData((prevDetails) => ({
        ...prevDetails,
        list: transformedUsers || [],
        // pageLength: myData?.paging?.[0]?.length || 0,
        // currentPage: myData?.paging?.[0]?.currentpage || 1,
        // totalRecords: myData?.paging?.[0]?.totalrecords || 0,
      }));

      // setCount({
      //   total: myData?.attendances?.length,
      // });
      // const myexcelData = myData?.attendances?.map((data, index) => {
      //   return {
      //     Sr: index + 1,
      //     Name: data?.users_name,
      //     "Shift 1": data?.shift_1 === "1" ? "Present" : "Absent",
      //     "Shift 2": data?.shift_2 === "1" ? "Present" : "Absent",
      //   };
      // });
      // setExcelData(myexcelData);
    }
  }, [AttendanceData]);

  // pdf header
  // const pdfHeader = ["Sr No", "GSD Name", "Shift 1", "Shift 2"];

  // // pdf data
  // const pdfData = useMemo(() => {
  //   return excelData?.map((opt) => [opt?.Sr, opt?.Name]) || [];
  // }, [excelData]);

  const myExcelItems = useMemo(() => {
    if (!tableData?.list) return [];

    return tableData?.list?.map((opt, index) => {
      const row = {
        Sr: index + 1, // Serial number
        Name: opt?.name, // Name
      };

      // Iterate over the keys of the user object
      Object.keys(opt)?.forEach((key) => {
        if (key.includes("_shift_")) {
          const [date, shift] = key.split("_shift_");
          const formattedDate = date.split("-").reverse().join("-");
          const newKey = `${formattedDate} Shift ${shift}`;
          row[newKey] =
            opt[key] === undefined
              ? "-"
              : opt[key] === "1"
              ? "Present"
              : "Absent";
        }
      });

      return row; // Return the row data
    });
  }, [tableData]);

  return (
    <div>
      <CommonDivider label={"Attendance Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        {/* <ExportToPDF
          titleName={`Attendance Report ${fileDateName}`}
          pdfName={fileName}
          headerData={pdfHeader}
          IsLastLineBold={true}
          landscape={true}
          tableTitles={pdfTitleParam || []}
          rows={[
            ...pdfData,
            [
              "",
              "Total",
              "",
              "",
              "",
              count?.total_allocation,
              count?.todaysmonitaring,
              "",
              count?.totalPendingMonitoring,
            ],
          ]}
        /> */}
        <ExportToExcel
          excelData={myExcelItems || []}
          titleName={fileName}
          fileName={fileName}
          // dynamicArray={[
          //   {
          //     name: "Total Allocation",
          //     value: count?.total_allocation,
          //     colIndex: 6,
          //   },
          //   {
          //     name: "Monitoring",
          //     value: count?.todaysmonitaring,
          //     colIndex: 7,
          //   },
          //   {
          //     name: "Pending Monitoring",
          //     value: count?.totalPendingMonitoring,
          //     colIndex: 9,
          //   },
          // ]}
        />
      </div>
      <Collapse
        defaultActiveKey={["1"]}
        size="small"
        className="rounded-none mt-3"
        items={[
          {
            key: 1,
            label: (
              <div className="flex items-center h-full">
                <img src={search} className="h-5" alt="Search Icon" />
              </div>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinishForm}
                key="form1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                  <CustomSelect
                    name={"user_id"}
                    label={"Select GSD"}
                    placeholder={"Select GSD"}
                    options={monitoringAgentDrop || []}
                    // search dropdown
                    isOnSearchFind={true}
                    apiAction={getMonitoringAgent}
                    onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
                  />
                  {/* <CustomSelect
                    name={"sector_id"}
                    label={"Select Sector"}
                    placeholder={"Select Sector"}
                    options={SectorListDrop || []}
                  /> */}
                  <CustomSelect
                    name={"sector_id"}
                    label={"Select Sector"}
                    placeholder={"Select Sector"}
                    allowClear={isSmoUser ? false : true}
                    options={isSmoUser ? SectorArray : SectorListDrop || []}
                  />
                  {/* <CustomDatepicker
                    name={"date"}
                    label={"Date"}
                    className="w-full"
                    placeholder={"Date"}
                  /> */}
                  <CustomSelect
                    name={"date_format"}
                    label={"Select Date Type"}
                    placeholder={"Select Date Type"}
                    onSelect={handleDateSelect}
                    options={dateWeekOptions || []}
                  />
                  {showDateRange && (
                    <>
                      <CustomDatepicker
                        name={"form_date"}
                        label={"From Date"}
                        className="w-full"
                        placeholder={"From Date"}
                        rules={[
                          {
                            required: true,
                            message: "Please select a start date!",
                          },
                        ]}
                        onChange={(date) => {
                          const dayjsObjectFrom = dayjs(date?.$d);
                          const startDate = dayjsObjectFrom;

                          const dayjsObjectTo = dayjs(
                            form.getFieldValue("to_date")?.$d
                          );
                          const endDate = dayjsObjectTo;

                          // Condition 1: If startDate is after endDate, set end_time to null
                          if (startDate.isAfter(endDate)) {
                            form.setFieldValue("to_date", null);
                          }

                          // Condition 2: If startDate is more than 7 days before endDate, set end_time to null
                          const daysDifference = endDate.diff(
                            startDate,
                            "days"
                          );
                          if (daysDifference > 7) {
                            form.setFieldValue("to_date", null);
                          } else {
                            // If the difference is within the allowed range, you can keep the value or process further if needed.
                          }

                          setStartDate(startDate.format("YYYY-MM-DD"));
                        }}
                      />
                      <CustomDatepicker
                        name={"to_date"}
                        label={"To Date"}
                        className="w-full"
                        placeholder={"To Date"}
                        rules={[
                          {
                            required: true,
                            message: "Please select a end date!",
                          },
                        ]}
                        disabledDate={disabledDate}
                      />
                    </>
                  )}
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <div>
                      <Button
                        loading={loading}
                        type="button"
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        Search
                      </Button>
                    </div>
                    <div>
                      <Button
                        loading={loading}
                        type="button"
                        className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            ),
          },
        ]}
      />
      <CustomTable
        loading={loading}
        columns={dynamicColumns || []}
        bordered
        dataSource={tableData || []}
        scroll={{ x: 2000, y: 400 }}
        tableSubheading={{
          "Total Records":
            getFormatedNumber(AttendanceData?.data?.users?.length) || 0,
        }}
        pagination={true}
        // onPageChange={(page, size) => {
        //   const obj = {
        //     page: page,
        //     size: size,
        //   };
        //   getUsers(obj);
        // }}
      />
    </div>
  );
};

export default AttendanceReport;
