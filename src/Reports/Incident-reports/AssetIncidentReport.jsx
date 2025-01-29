import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import search from "../../assets/Dashboard/icon-search.png";
import {
  dateOptions,
  dateWeekOptions,
  getValueLabel,
  percentageOptions,
} from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import CustomTable from "../../commonComponents/CustomTable";
import ExportToExcel from "../ExportToExcel";
import ExportToPDF from "../reportFile";
import URLS from "../../urils/URLS";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import MonitoringSelector from "../../complaince/monitoringSelector";
import { getAttendanceReports } from "../Attendance/Slice/attendanceslice";
import AttendanceSelector from "../Attendance/Slice/attendanceSelector";
import CustomInput from "../../commonComponents/CustomInput";
import { getAssetViewData } from "../../register/asset/AssetsSlice";
import ToiletAndTentageSelector from "../../register/asset/assetSelectors";
import IncidentReportSelector from "./Slice/IncidentReportSelector";
import { getAssetIncidentReportData } from "./Slice/IncidentReportSlice";
// import { getAttendanceReports } from "./Slice/attendanceslice";
// import AttendanceSelector from "./Slice/attendanceSelector";

const AssetIncidentReport = () => {
  const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [tableData, setTableData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    todaysmonitaring: 0,
    totalPendingMonitoring: 0,
    total_allocation: 0,
  });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { AssetUnitList, AssetViewData } = ToiletAndTentageSelector(); // monitoring agent drop
  //   const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop
  const { AttendanceData, loading } = AttendanceSelector();
  const { AssetIncidentData } = IncidentReportSelector();

  //   console.log("AssetViewData", AssetViewData);
  console.log("AssetIncidentData", AssetIncidentData);

  const sectorName = getValueLabel(formValue?.sector_id, SectorListDrop, null);
  const percentageName = getValueLabel(
    `${formValue?.percentage}`,
    percentageOptions,
    null
  );
  const fileDateName = `(${dayjs(formValue?.date).format("DD-MMM-YYYY")})`;

  // file name
  const getReportName = () => {
    let name = "GSD Wise";
    if (sectorName) {
      name += `- ${sectorName}`;
    }
    if (percentageName) {
      name += `- ${percentageName}`;
    }
    name += `- Monitoring Report ${fileDateName}`;
    return name;
  };
  const fileName = getReportName();

  const pdfTitleParam = [
    ...(formValue?.sector_id
      ? [
          {
            label: `Allocate Sector : ${sectorName || "Combined"}`,
          },
        ]
      : []),
    ...(formValue?.percentage
      ? [
          {
            label: `Monitoring Percentage :  ${percentageName || "Combined"}`,
          },
        ]
      : []),
  ];

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

  const getUsers = async (dataObj = {}) => {
    const startDate = dayjs(formValue?.form_date).format("YYYY-MM-DD");
    const endDate = dayjs(formValue?.to_date).format("YYYY-MM-DD");
    const newParam = {
      page: dataObj?.page || "1",
      per_page: dataObj?.size || "25",
      ...form.getFieldsValue(),
      ...(formValue?.date_format === "Date Range" && {
        form_date: startDate,
      }),
      ...(formValue?.date_format === "Date Range" && {
        to_date: endDate,
        date_format: null,
      }),
    };
    callApi(newParam);
  };

  // filter finish
  const onFinishForm = (values) => {
    const startDate = dayjs(values?.form_date).format("YYYY-MM-DD");
    const endDate = dayjs(values?.to_date).format("YYYY-MM-DD");
    const finalData = {
      ...values,
      assets_id: AssetViewData?.data?.asset?.[0]?.assets_id,
    };
    if (values.date_format === "Today") {
      finalData.form_date = moment().format("YYYY-MM-DD");
      finalData.to_date = moment().format("YYYY-MM-DD");
    } else {
      finalData.form_date = startDate;
      finalData.to_date = endDate;
    }
    finalData.date_format = null;
    finalData.assets_code = null;
    // console.log("finalData", finalData);
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
    });
    const finalValues = {
      page: 1,
      per_page: 10,
      date_format: "Today",
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    dispatch(getAssetIncidentReportData(data)); // asset incident reports
  };

  useEffect(() => {
    // getCurrentData();
    // dispatch(getSectorsList()); // all sectors
    // const urls = URLS?.monitoringAgent?.path;
    // dispatch(getMonitoringAgent(urls)); // monitoring agent list
  }, []);

  useEffect(() => {
    if (AssetIncidentData) {
      const { questions = [], monitoring = [] } = AssetIncidentData?.data || {};
      console.log("questions", questions);
      console.log("monitoring", monitoring);
      const r = questions?.map((data) => {
        return monitoring?.map((item) => {});
      });
      //   const r = questions?.map((data) => {
      //     return {
      //         ...data
      //     //   title: "Shift 1",
      //     //   dataIndex: "shift_1",
      //     //   key: "shift_1",
      //     //   width: 100,
      //     //   render: (text) => {
      //     //     return text === "1" ? "Present" : "Absent";
      //     //   },
      //     //   sorter: (a, b) => {
      //     //     return a?.shift_1?.localeCompare(b?.shift_1);
      //     //   },
      //     };
      //   });
      //   setTableData((prevDetails) => ({
      //     ...prevDetails,
      //     list: myData?.attendances || [],
      //     pageLength: myData?.paging?.[0]?.length || 0,
      //     currentPage: myData?.paging?.[0]?.currentpage || 1,
      //     totalRecords: myData?.paging?.[0]?.totalrecords || 0,
      //   }));

      //   setCount({
      //     total: myData?.attendances?.length,
      //   });

      //   const myexcelData = myData?.attendances?.map((data, index) => {
      //     return {
      //       Sr: index + 1,
      //       Name: data?.users_name,
      //       "Shift 1": data?.shift_1 === "1" ? "Present" : "Absent",
      //       "Shift 2": data?.shift_2 === "1" ? "Present" : "Absent",
      //     };
      //   });
      //   setExcelData(myexcelData);
    }
  }, [AssetIncidentData]);

  const columns = useMemo(
    () => [
      {
        title: "GSD Name",
        dataIndex: "users_name",
        key: "users_name",
        width: 100,
        sorter: (a, b) => {
          const nameA = a?.users_name ? a?.users_name?.toString() : "";
          const nameB = b?.users_name ? b?.users_name?.toString() : "";
          return nameA?.localeCompare(nameB);
        },
      },
      {
        title: "Shift 1",
        dataIndex: "shift_1",
        key: "shift_1",
        width: 100,
        render: (text) => {
          return text === "1" ? "Present" : "Absent";
        },
        sorter: (a, b) => {
          return a?.shift_1?.localeCompare(b?.shift_1);
        },
      },
      {
        title: "Shift 2",
        dataIndex: "shift_2",
        key: "shift_2",
        width: 100,
        render: (text) => {
          return text === "1" ? "Present" : "Absent";
        },
        sorter: (a, b) => {
          return a?.shift_2?.localeCompare(b?.shift_2);
        },
      },
    ],
    [SectorListDrop]
  );
  // pdf header
  const pdfHeader = ["Sr No", "GSD Name", "Shift 1", "Shift 2"];

  // pdf data
  const pdfData = useMemo(() => {
    return excelData?.map((opt) => [opt?.Sr, opt?.Name]) || [];
  }, [excelData]);
  let timeoutId = null;

  return (
    <div>
      <CommonDivider label={"Asset Incident Report"} />
      {/* <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={`Asset Incident Report ${fileDateName}`}
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
        />
        <ExportToExcel
          excelData={excelData || []}
          titleName={fileName}
          fileName={fileName}
          dynamicArray={[
            {
              name: "Total Allocation",
              value: count?.total_allocation,
              colIndex: 6,
            },
            {
              name: "Monitoring",
              value: count?.todaysmonitaring,
              colIndex: 7,
            },
            {
              name: "Pending Monitoring",
              value: count?.totalPendingMonitoring,
              colIndex: 9,
            },
          ]}
        />
      </div> */}
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
                  {/* <CustomSelect
                    name={"user_id"}
                    label={"Select GSD"}
                    placeholder={"Select GSD"}
                    options={monitoringAgentDrop || []}
                    // search dropdown
                    isOnSearchFind={true}
                    apiAction={getMonitoringAgent}
                    onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
                  /> */}
                  <CustomInput
                    name={"assets_code"}
                    label={"Asset Code"}
                    placeholder={"Asset Code"}
                    type="Number"
                    rules={[
                      {
                        required: true,
                        message: "Please Add Asset Code!",
                      },
                    ]}
                    onChange={(e) => {
                      if (timeoutId) {
                        clearTimeout(timeoutId);
                      }
                      timeoutId = setTimeout(() => {
                        const obj = {
                          assets_code: e.target.value,
                        };
                        dispatch(getAssetViewData(obj));
                      }, 1000);
                    }}
                  />
                  <CustomSelect
                    name={"unit_no"}
                    label={"Select Unit"}
                    placeholder={"Select Unit"}
                    options={AssetUnitList || []}
                    rules={[
                      {
                        required: true,
                        message: "Please select a Unit!",
                      },
                    ]}
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
                    rules={[
                      {
                        required: true,
                        message: "Please select Date Type!",
                      },
                    ]}
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
        columns={columns || []}
        bordered
        dataSource={tableData || []}
        scroll={{ x: 800, y: 400 }}
        tableSubheading={{
          "Total Records": tableData?.totalRecords,
        }}
        onPageChange={(page, size) => {
          const obj = {
            page: page,
            size: size,
          };
          getUsers(obj);
        }}
      />
    </div>
  );
};

export default AssetIncidentReport;
