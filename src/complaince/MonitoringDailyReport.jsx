import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";
import html2pdf from "html2pdf.js";

import { getMonitoringDailyReport } from "./monitoringSlice";
import search from "../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../urils/getSearchQuery";
import { dateWeekOptions } from "../constant/const";
import URLS from "../urils/URLS";
import CommonDivider from "../commonComponents/CommonDivider";
// import CommonTable from "../commonComponents/CommonTable";
import { getVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import CustomSelect from "../commonComponents/CustomSelect";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
// import { exportToExcel } from "../Reports/ExportExcelFuntion";
// import { getPdfExcelData } from "../register/asset/AssetsSlice";
// import { ExportPdfFunction } from "../Reports/ExportPdfFunction";
import MonitoringSelector from "./monitoringSelector";
import { revertMonitoringSlice } from "../Redux/action";

const MonitoringDailyReport = () => {
  //   const [loading, setLoading] = useState(false);
  //   const [details, setDetails] = useState({
  //     list: [],
  //     pageLength: 25,
  //     currentPage: 1,
  //     totalUnit: 0,
  //   });
  const [startDate, setStartDate] = useState(null);
  //   const [assetMainType, setAssetMainType] = useState([]); // asset main type
  //   const [assetTypes, setAssetTypes] = useState([]); // asset type
  //   const [searchQuery, setSearchQuery] = useState();
  const [showDateRange, setShowDateRange] = useState(false);
  //   const [filesName, setFilesName] = useState(null); // files Name

  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const { DailyReport, loading } = MonitoringSelector(); // daily report

  const userRoleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  //   const vendor_id_name = form.getFieldValue("vendor_id");

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      vendor_id: values?.vendor_id,
    };
    if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    } else if (values?.date_format === "Today") {
      finalData.date = moment().format("YYYY-MM-DD");
    }

    let url = URLS?.monitoringDailyReport?.path;

    const searchParams = generateSearchQuery(finalData);

    dispatch(
      getMonitoringDailyReport(
        "/reporting/daily-monitoring-email-vendor?vendor_id=136&date=2024-12-25"
      )
    );
    // dispatch(getMonitoringDailyReport(url ,finalData));
    // if (searchParams === "&") {
    //   openNotificationWithIcon("info");
    // }
    // setSearchQuery(searchParams);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    // setSearchQuery("&");
    setShowDateRange(false);
    // setFilesName(null);
    setValue();
  };

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

  // file name
  //   const getReportName = () => {
  //     const vendorName = getValueLabel(vendor_id_name, VendorListDrop, "");

  //     let reportName = "";
  //     if (vendorName) {
  //       reportName += `${vendorName}`;
  //     }
  //     return reportName
  //       ? `${reportName} -Toilet & Tentage Monitoring Report`
  //       : "Toilet & Tentage Monitoring Report";
  //   };

  //   useEffect(() => {
  //     setFilesName(getReportName()); // file name
  //   }, [vendor_id_name]);

  const setValue = () => {
    if (userRoleId === "8") {
      form.setFieldValue("vendor_id", userId);
    }
  };

  useEffect(() => {
    if (DailyReport) {
      const element = document.createElement("div");
      element.innerHTML = DailyReport?.data?.html;

      // Use html2pdf to generate the PDF with custom styles
      html2pdf().from(element).save("Monitoring-Daily-Report.pdf");
      form.resetFields();
      dispatch(revertMonitoringSlice());
      setValue();
    }
  }, [DailyReport]);

  useEffect(() => {
    dispatch(getVendorList()); // vendor list
    setValue();
  }, []);

  //   const columns = [
  //     {
  //       title: "Name",
  //       dataIndex: "asset_type_name",
  //       key: "assetsName",
  //       width: 210,
  //     },
  //     {
  //       title: "PTC / TAF Code ",
  //       dataIndex: "asset_code",
  //       key: "asset_code",
  //       width: 110,
  //       render: (text, record) => {
  //         return text ? `${text}-${record?.unit_no}` : "";
  //       },
  //     },
  //     // {
  //     //   title: "QR",
  //     //   dataIndex: "asset_qr_code",
  //     //   width: 80,
  //     //   render: (qr) => {
  //     //     return (
  //     //       <Image
  //     //         src={ImageUrl + qr}
  //     //         alt="QR Code"
  //     //         style={{ maxWidth: "50px" }}
  //     //       />
  //     //     );
  //     //   },
  //     // },
  //     ...(userRoleId !== "8"
  //       ? [
  //           {
  //             title: "GSD Name",
  //             dataIndex: "agent_name",
  //             key: "agent_name",
  //             render: (text) => {
  //               return text ? text : "GSD";
  //             },
  //           },
  //         ]
  //       : []),
  //     {
  //       title: "Vendor Name",
  //       dataIndex: "vendor_name",
  //       key: "vendor_name",
  //     },
  //     {
  //       title: "Sector Name",
  //       dataIndex: "sector_name",
  //       key: "sector_name",
  //       width: 110,
  //     },
  //     // {
  //     //   title: "Circle Name",
  //     //   dataIndex: "circle_name",
  //     //   key: "circle_name",
  //     // },
  //     {
  //       title: "Date",
  //       dataIndex: "created_at",
  //       key: "created_at",
  //       render: (text) => {
  //         return text ? moment(text).format("DD-MMM-YYYY") : "";
  //       },
  //       width: 120,
  //     },
  //     {
  //       title: "remark",
  //       dataIndex: "remark",
  //       key: "remark",
  //     },
  //     {
  //       title: "Monitoring Details View",
  //       key: "action",
  //       fixed: "right",
  //       width: 130,
  //       render: (text, record) => (
  //         <div className="flex gap-2">
  //           <div
  //             className="text-blue-500 cursor-pointer"
  //             onClick={() => {
  //               navigate("/monitoring-report/" + record.id);
  //             }}
  //           >
  //             Monitoring
  //           </div>
  //         </div>
  //       ),
  //     },
  //   ];

  // pdf header
  //   const pdfHeader = [
  //     "Sr No",
  //     "Type Name",
  //     "Code",
  //     "Unit",
  //     "GSD Name",
  //     "Vendor Name",
  //     "Sector",
  //     "Circle",
  //     "Date",
  //   ];

  // pdf data
  // const pdfData = details?.list?.map((data, index) => [
  //   index + 1,
  //   data?.asset_type_name,
  //   data?.asset_code,
  //   data?.unit_no,
  //   data?.agent_name ? data?.agent_name : "GSD",
  //   data?.vendor_name,
  //   data?.sector_name,
  //   data?.circle_name,
  //   data?.created_at
  //     ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
  //     : "",
  // ]);

  //   // excel && pdf file
  //   const exportToFile = async (isExcel) => {
  //     try {
  //       let url = URLS.monitoring.path + "?page=1&per_page=5000";

  //       if (userRoleId === "8") {
  //         url = url + `&vendor_id=${sessionData?.id}`;
  //       }
  //       const res = await dispatch(
  //         getPdfExcelData(`${url}${searchQuery ? searchQuery : ""}`)
  //       );

  //       if (!res?.data?.listings) {
  //         throw new Error("No listings found in the response data.");
  //       }

  //       // Calculate total units
  //       const unitCount = res?.data?.listings?.reduce((total, item) => {
  //         return total + Number(item?.unit_no);
  //       }, 0);

  //       // Map data for Excel
  //       const myexcelData =
  //         isExcel &&
  //         res?.data?.listings?.map((data, index) => {
  //           return {
  //             sr: index + 1,
  //             "Asset Type Name": data?.asset_type_name,
  //             Code: Number(data?.asset_code),
  //             Unit: Number(data?.unit_no),
  //             "GSD Name": data?.agent_name || "GSD",
  //             "Vendor Name": data?.vendor_name,
  //             Sector: data?.sector_name,
  //             Circle: data?.circle_name,
  //             Date: data?.created_at
  //               ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
  //               : "",
  //           };
  //         });

  //       // Call the export function
  //       isExcel &&
  //         exportToExcel(myexcelData, filesName, {}, [
  //           {
  //             name: "Total Unit",
  //             value: unitCount,
  //             colIndex: 4,
  //           },
  //         ]);

  //       const pdfData =
  //         !isExcel &&
  //         res?.data?.listings?.map((data, index) => [
  //           index + 1,
  //           data?.asset_type_name,
  //           data?.asset_code,
  //           data?.unit_no,
  //           data?.agent_name ? data?.agent_name : "GSD",
  //           data?.vendor_name,
  //           data?.sector_name,
  //           data?.circle_name,
  //           data?.created_at
  //             ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
  //             : "",
  //         ]);

  //       // Call the export function
  //       !isExcel &&
  //         ExportPdfFunction(
  //           filesName,
  //           filesName,
  //           pdfHeader,
  //           [...pdfData, ["", "Total Unit", "", unitCount, ""]],
  //           true,
  //           true
  //         );
  //     } catch (error) {
  //       message.error(`Error occurred: ${error.message || "Unknown error"}`);
  //     }
  //   };

  return (
    <div className="">
      <CommonDivider label={"Monitoring Daily Report"}></CommonDivider>
      {/* <div className="flex justify-end gap-2 font-semibold">
        <div>
          <Button
            type="primary"
            onClick={() => {
              exportToFile(false);
            }}
          >
            Download Pdf
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              exportToFile(true);
            }}
          >
            Download Excel
          </Button>
        </div>
      </div> */}
      <div>
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
                  <Row gutter={[16, 16]} align="middle">
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        disabled={userRoleId === "8" ? true : false}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
                        rules={[
                          {
                            required: true,
                            message: "Please select Vendor!",
                          },
                        ]}
                      />
                    </Col>
                    <Col key="date_format" xs={24} sm={12} md={6} lg={5}>
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
                    </Col>
                    {showDateRange && (
                      <>
                        <Col key="form_date" xs={24} sm={12} md={6} lg={5}>
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
                        </Col>
                        <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
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
                        </Col>
                      </>
                    )}
                    <div className="flex justify-start my-4 space-x-2 ml-3">
                      <div>
                        <Button
                          loading={loading}
                          type="button"
                          className="w-fit rounded-none text-white bg-orange-400 hover:bg-orange-600"
                          onClick={resetForm}
                        >
                          Reset
                        </Button>
                      </div>
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
                    </div>
                  </Row>
                </Form>
              ),
            },
          ]}
        />
      </div>

      {/* <CommonTable
        columns={columns}
        uri={"monitoring"}
        details={details}
        loading={loading}
        subtotalName={"Total Unit"}
        subtotalCount={details?.totalUnit}
        scroll={{ x: 1000, y: 400 }}
      ></CommonTable> */}
    </div>
  );
};

export default MonitoringDailyReport;
