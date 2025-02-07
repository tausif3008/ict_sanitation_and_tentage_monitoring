import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import search from "../../assets/Dashboard/icon-search.png";
import { dateWeekOptions } from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import CustomTable from "../../commonComponents/CustomTable";
import CustomInput from "../../commonComponents/CustomInput";
import { getAssetViewData } from "../../register/asset/AssetsSlice";
import ToiletAndTentageSelector from "../../register/asset/assetSelectors";
import IncidentReportSelector from "./Slice/IncidentReportSelector";
import { getAssetUnitReportData } from "./Slice/IncidentReportSlice";
import ExportToExcel from "../ExportToExcel";

const AssetUnitReport = () => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [tableData, setTableData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  let timeoutId = null;

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const { AssetUnitList, AssetViewData } = ToiletAndTentageSelector(); // monitoring agent drop
  const { AssetUnitData, loading } = IncidentReportSelector();

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
    let name = "Asset Unit";
    if (AssetUnitData?.success) {
      name += `- ${AssetUnitData?.data?.result?.vendor_name}`;
    }
    if (formValue?.assets_code) {
      name += `- (${formValue?.assets_code}`;
    }
    if (formValue?.unit_no) {
      name += `-${formValue?.unit_no})`;
    }
    name += `- Report (${fileDateName})`;
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
    callApi(finalData);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    // getCurrentData();
    setShowDateRange(false);
    setTableData({
      list: [],
      pageLength: 25,
      currentPage: 1,
    });
  };

  // current data
  // const getCurrentData = () => {
  //   setShowDateRange(false);
  //   form.setFieldsValue({
  //     date_format: "Today",
  //   });
  //   const finalValues = {
  //     // page: 1,
  //     // per_page: 10,
  //     // date_format: "Today",
  //   };
  //   callApi(finalValues);
  // };

  const callApi = async (data) => {
    dispatch(getAssetUnitReportData(data)); // asset incident reports
  };

  useEffect(() => {
    form.resetFields();
    // getCurrentData();
    // dispatch(getSectorsList()); // all sectors
    // const urls = URLS?.monitoringAgent?.path;
    // dispatch(getMonitoringAgent(urls)); // monitoring agent list
  }, []);

  useEffect(() => {
    if (AssetUnitData) {
      const unitData = AssetUnitData?.data?.result;
      const arrayData = unitData?.questionArray?.map((item) => ({
        ...item,
        ...Object.fromEntries(
          Object.entries(item?.dates || {}).flatMap(([date, shifts]) => [
            [`${date}_shift_1`, shifts?.shif_1 || "-"],
            [`${date}_shift_2`, shifts?.shif_2 || "-"],
          ])
        ),
      }));
      setTableData({
        list: arrayData,
        pageLength: 25,
        currentPage: 1,
      });
    }
  }, [AssetUnitData]);

  const dynamicColumns = useMemo(() => {
    const columns = [
      {
        title: "Question",
        dataIndex: "question",
        key: "question",
        width: 200,
      },
    ];
    const unitData = AssetUnitData?.data?.result;
    const dates = new Set();
    unitData?.questionArray?.forEach((item) => {
      Object.keys(item?.dates || {}).forEach((date) => {
        dates.add(date); // Add date to the set (ensures unique dates)
      });
    });

    dates?.forEach((date) => {
      columns.push({
        title: () => <>{date}</>,
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
                    Yes
                  </span>
                );
              } else if (text === "0") {
                return (
                  <span className="text-white bg-red-500 border border-black px-2 py-1 rounded my-2">
                    No
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
                    Yes
                  </span>
                );
              } else if (text === "0") {
                return (
                  <span className="text-white bg-red-500 border border-black px-2 py-1 rounded">
                    No
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
  }, [AssetUnitData]);

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
        Question: opt?.question, // Name
      };
      // Iterate over the keys of the user object
      Object.keys(opt)?.forEach((key) => {
        if (key.includes("_shift_")) {
          const [date, shift] = key.split("_shift_");
          const formattedDate = date.split("-").reverse().join("-");
          const newKey = `${formattedDate} Shift ${shift}`;
          row[newKey] =
            opt[key] === "1" ? "Yes" : opt[key] === "0" ? "No" : "-";
        }
      });
      return row; // Return the row data
    });
  }, [tableData]);

  return (
    <>
      <CommonDivider label={"Asset Unit Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        {/* <ExportToPDF
          titleName={`Asset Unit Report ${fileDateName}`}
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
        columns={dynamicColumns || []}
        bordered
        dataSource={tableData || []}
        scroll={{ x: 800, y: 400 }}
        tableSubheading={{
          "Total Records": tableData?.list?.length,
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
    </>
  );
};

export default AssetUnitReport;
