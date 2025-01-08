import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, notification, Row, Col, message } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

import { getMonitoringAgent } from "./monitoringSlice";
import search from "../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../urils/getSearchQuery";
import optionsMaker from "../urils/OptionMaker";
import {
  cleanStatus,
  CompliantStatus,
  dateOptions,
  getValueLabel,
} from "../constant/const";
import URLS from "../urils/URLS";
import { getData } from "../Fetch/Axios";
import CommonDivider from "../commonComponents/CommonDivider";
import CommonTable from "../commonComponents/CommonTable";
import { getAssetTypeWiseVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import MonitoringSelector from "./monitoringSelector";
import CustomSelect from "../commonComponents/CustomSelect";
import CustomInput from "../commonComponents/CustomInput";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import { exportToExcel } from "../Reports/ExportExcelFuntion";
import { getPdfExcelData } from "../register/asset/AssetsSlice";
import { MonitoringPdfNew } from "./MonitoringPdf";

const Monitoring = () => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalUnit: 0,
  });
  const checkQuestions = "Is the toilet clean?";
  const [startDate, setStartDate] = useState(null);
  const [assetMainType, setAssetMainType] = useState([]); // asset main type
  const [assetTypes, setAssetTypes] = useState([]); // asset type
  const [searchQuery, setSearchQuery] = useState();
  const [showDateRange, setShowDateRange] = useState(false);
  const [filesName, setFilesName] = useState(null); // files Name
  const [pdfTitleData, setPdfTitleData] = useState({
    category: "Combined",
    type: "Combined",
    date: "Combined",
  }); // pdf title data

  const { AssetTypeVendorDrop } = VendorSupervisorSelector(); // asset type wise vendor
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop

  // const ImageUrl = localStorage.getItem("ImageUrl") || "";
  const userRoleId = localStorage.getItem("role_id");
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification({ top: 100 });
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Note",
      duration: 7,
      description: "Please enter some information to perform the search.",
    });
  };

  const categoryType = form.getFieldValue("asset_main_type_id");
  const asset_type_id_name = form.getFieldValue("asset_type_id");
  const vendor_id_name = form.getFieldValue("vendor_id");
  const GSD_name = form.getFieldValue("created_by");

  const catTypeName = getValueLabel(categoryType, assetMainType, "");
  const assetTypeName = getValueLabel(asset_type_id_name, assetTypes, "");
  const vendorName = getValueLabel(vendor_id_name, AssetTypeVendorDrop, "");

  const handleSelect = (value) => {
    setAssetTypes([]); // get assset type
    form.setFieldsValue({
      asset_type_id: null,
    });
    optionsMaker(
      "vendorAsset",
      "assettypes",
      "name",
      setAssetTypes,
      "?asset_main_type_id=" + value,
      "asset_type_id"
    );
  };

  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });
    value && userRoleId !== "8" && dispatch(getAssetTypeWiseVendorList(value)); // asset type wise vendor list
  };

  // fiter finish
  const onFinishForm = (values) => {
    let pdfDateOpt = null;
    if (values?.date_format === "Today") {
      pdfDateOpt = moment().format("DD-MMM-YYYY");
    } else if (values?.date_format === "Current Month") {
      const startDate = moment().startOf("month").format("DD-MMM-YYYY");
      const endDate = moment().endOf("month").format("DD-MMM-YYYY");
      pdfDateOpt = `${startDate} to ${endDate}`;
    } else if (values?.date_format === "Date Range") {
      const startDate = dayjs(values?.form_date).format("DD-MMM-YYYY");
      const endDate = dayjs(values?.to_date).format("DD-MMM-YYYY");
      pdfDateOpt = `${startDate} to ${endDate}`;
    }

    setPdfTitleData((pre) => ({
      ...pre,
      category: values?.asset_main_type_id ? catTypeName : "Combined",
      type: values?.asset_type_id ? assetTypeName : "Combined",
      date: pdfDateOpt || "Combined",
    }));

    const finalData = {
      ...values,
    };
    if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    }
    const searchParams = generateSearchQuery(finalData);
    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }
    setSearchQuery(searchParams);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
    setShowDateRange(false);
    setFilesName(null);
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

  const getDetails = async () => {
    setLoading(true);
    let uri = URLS.monitoring.path + "?";
    if (userRoleId === "8") {
      uri = uri + `&vendor_id=${sessionData?.id}`;
    }
    if (params.page) {
      uri = uri + params.page;
    }
    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }
    if (searchQuery) {
      uri = uri + searchQuery;
    }

    const extraHeaders = { "x-api-version": URLS.asset.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      const list = data.listings.map((el, index) => {
        return {
          ...el,
        };
      });
      const totalUnit = data?.listings?.reduce((total, start) => {
        return total + Number(start?.unit_no);
      }, 0);
      setDetails(() => {
        return {
          list,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentpage,
          totalUnit,
          totalRecords: data.paging[0].totalrecords,
        };
      });

      // const myexcelData = data?.listings?.map((data, index) => {
      //   return {
      //     sr: index + 1,
      //     "Asset Type Name": data?.asset_type_name,
      //     Code: Number(data?.asset_code),
      //     Unit: Number(data?.unit_no),
      //     "Monitoring Agent Name": data?.agent_name,
      //     "Vendor Name": data?.vendor_name,
      //     Sector: data?.sector_name,
      //     Circle: data?.circle_name,
      //     Date: data?.created_at
      //       ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
      //       : "",
      //   };
      // });
      // setExcelData(myexcelData);
    }
    setLoading(false);
  };

  // file name
  const getReportName = () => {
    let reportName = "";
    if (vendorName) {
      reportName += `${vendorName}`;
    }
    if (catTypeName) {
      if (reportName) {
        reportName += `-${catTypeName}`;
      } else {
        reportName += catTypeName;
      }
    }
    if (assetTypeName) {
      reportName += `(${assetTypeName})`;
    }
    return reportName
      ? `${reportName} - Monitoring Report`
      : "Toilet & Tentage Monitoring Report";
  };

  useEffect(() => {
    setFilesName(getReportName()); // file name
  }, [categoryType, asset_type_id_name, vendor_id_name, GSD_name]);

  useEffect(() => {
    getDetails();
  }, [params, searchQuery]);

  useEffect(() => {
    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls)); // monitoring agent list
  }, []);

  useEffect(() => {
    // get assset main type
    optionsMaker(
      "assetMainTypePerPage",
      "assetmaintypes",
      "name",
      setAssetMainType,
      "",
      "asset_main_type_id"
    );
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "asset_type_name",
      key: "assetsName",
      width: 210,
    },
    {
      title: "PTC / TAF Code ",
      dataIndex: "asset_code",
      key: "asset_code",
      width: 110,
      render: (text, record) => {
        return text ? `${text}-${record?.unit_no}` : "";
      },
    },
    // {
    //   title: "QR",
    //   dataIndex: "asset_qr_code",
    //   width: 80,
    //   render: (qr) => {
    //     return (
    //       <Image
    //         src={ImageUrl + qr}
    //         alt="QR Code"
    //         style={{ maxWidth: "50px" }}
    //       />
    //     );
    //   },
    // },
    {
      title: "Sector Name",
      dataIndex: "sector_name",
      key: "sector_name",
      width: 110,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      width: 210,
    },
    // {
    //   title: "Circle Name",
    //   dataIndex: "circle_name",
    //   key: "circle_name",
    // },
    {
      title: "Clean",
      dataIndex: "zero_count",
      key: "zero_count",
      render: (text, record) => {
        if (record?.issue?.some((que) => que?.question_en === checkQuestions)) {
          return "Unclean";
        } else {
          return "Clean";
        }
      },
      width: 110,
    },
    {
      title: "Compliant",
      dataIndex: "zero_count",
      key: "zero_count",
      render: (text) => {
        return text
          ? Number(text) === 0
            ? "Compliant"
            : Number(text) > 7
            ? "Not Compliant"
            : "Partial Compliant"
          : "";
      },
      width: 110,
    },
    // {
    //   title: "Clean",
    //   dataIndex: "one_count",
    //   key: "one_count",
    //   render: (text) => {
    //     return text ? text : "";
    //   },
    //   width: 70,
    // },
    // {
    //   title: "Maintenance",
    //   dataIndex: "maintenance",
    //   key: "maintenance",
    //   render: (text) => {
    //     return text ? text : 0;
    //   },
    //   width: 130,
    // },
    // {
    //   title: "Unclean",
    //   dataIndex: "zero_count",
    //   key: "zero_count",
    //   render: (text) => {
    //     return text ? text : "";
    //   },
    //   width: 90,
    // },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => {
        return text ? moment(text).format("DD-MMM-YYYY") : "";
      },
      width: 120,
    },
    ...(userRoleId !== "8"
      ? [
          {
            title: "GSD Name",
            dataIndex: "agent_name",
            key: "agent_name",
            render: (text) => {
              return text ? text : "GSD";
            },
          },
        ]
      : []),
    {
      title: "remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Monitoring Details View",
      key: "action",
      fixed: "right",
      width: 130,
      render: (text, record) => (
        <div className="flex gap-2">
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              navigate("/monitoring-report/" + record?.id);
            }}
          >
            Monitoring
          </div>
        </div>
      ),
    },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Type Name",
    "Code",
    // "Unit",
    "Sector",
    "Vendor Name",
    "Clean Status",
    "Compliant Status",
    // "Clean",
    // "Maintenance",
    // "Unclean",
    // "Circle",
    "Date",
    "GSD Name",
  ];

  const columnPercentages = [5, 16, 9, 9, 20, 7, 9, 10, 15];

  // excel && pdf file
  const exportToFile = async (isExcel) => {
    try {
      let url = URLS.monitoring.path + "?page=1&per_page=5000";

      if (userRoleId === "8") {
        url = url + `&vendor_id=${sessionData?.id}`;
      }
      const res = await dispatch(
        getPdfExcelData(`${url}${searchQuery ? searchQuery : ""}`)
      );

      if (!res?.data?.listings) {
        throw new Error("No listings found in the response data.");
      }

      // Calculate total units
      const unitCount = res?.data?.listings?.reduce((total, item) => {
        return total + Number(item?.unit_no) || 0;
      }, 0);
      // const CleanCount = res?.data?.listings?.reduce((total, item) => {
      //   return total + Number(item?.one_count) || 0;
      // }, 0);
      // const UncleanCount = res?.data?.listings?.reduce((total, item) => {
      //   return total + Number(item?.zero_count) || 0;
      // }, 0);
      // const MaintenanceCount = res?.data?.listings?.reduce((total, item) => {
      //   return total + Number(item?.maintenance) || 0;
      // }, 0);

      // Map data for Excel
      const myexcelData =
        isExcel &&
        res?.data?.listings?.map((data, index) => {
          return {
            Sr: index + 1,
            "Asset Type Name": data?.asset_type_name,
            Code: Number(data?.asset_code),
            Unit: Number(data?.unit_no),
            Sector: data?.sector_name,
            "Vendor Name": data?.vendor_name,
            "Clean Status": data?.issue?.some(
              (que) => que?.question_en === checkQuestions
            )
              ? "Unclean"
              : "Clean",
            "Compliant Status": data?.zero_count
              ? Number(data?.zero_count) === 0
                ? "Compliant"
                : Number(data?.zero_count) > 7
                ? "Not Compliant"
                : "Partial Compliant"
              : "",
            // Clean: Number(data?.one_count) || 0,
            // Maintenance: Number(data?.maintenance) || 0,
            // Unclean: Number(data?.zero_count) || 0,
            // Circle: data?.circle_name,
            Date: data?.created_at
              ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
              : "",
            "GSD Name": data?.agent_name || "GSD",
          };
        });

      // Call the export function
      isExcel &&
        exportToExcel(myexcelData, filesName, {}, [
          {
            name: "Total Unit",
            value: unitCount,
            colIndex: 4,
          },
          // {
          //   name: "Total Clean",
          //   value: CleanCount,
          //   colIndex: 8,
          // },
          // {
          //   name: "Total Maintenance",
          //   value: MaintenanceCount,
          //   colIndex: 9,
          // },
          // {
          //   name: "Total Unclean",
          //   value: UncleanCount,
          //   colIndex: 10,
          // },
        ]);

      const pdfData =
        !isExcel &&
        res?.data?.listings?.map((data, index) => [
          index + 1,
          data?.asset_type_name,
          `${data?.asset_code}-${data?.unit_no}`,
          // data?.unit_no,
          data?.sector_name,
          data?.vendor_name,
          data?.issue?.some((que) => que?.question_en === checkQuestions)
            ? "Unclean"
            : "Clean",
          data?.zero_count
            ? Number(data?.zero_count) === 0
              ? "Compliant"
              : Number(data?.zero_count) > 7
              ? "Not Compliant"
              : "Partial Compliant"
            : "",
          // data?.one_count ? data?.one_count : "",
          // data?.maintenance ? data?.maintenance : 0,
          // data?.zero_count ? data?.zero_count : "",
          // data?.circle_name,
          data?.created_at
            ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
            : "",
          data?.agent_name ? data?.agent_name : "GSD",
        ]);

      // Call the export function
      !isExcel &&
        MonitoringPdfNew(
          "Unit wise Monitoring Report",
          filesName,
          pdfHeader,
          [
            ...pdfData,
            [
              "",
              "Total",
              unitCount,
              "",
              "",
              // CleanCount,
              // MaintenanceCount,
              // UncleanCount,
            ],
          ],
          true,
          true,
          columnPercentages,
          pdfTitleData
        );
    } catch (error) {
      message.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="">
      <CommonDivider label={"Toilet & Tentage Monitoring"}></CommonDivider>
      <div className="flex justify-end gap-2 font-semibold">
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
      </div>
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
                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_main_type_id"}
                        label={"Select Category"}
                        placeholder={"Select Category"}
                        onSelect={handleSelect}
                        options={assetMainType?.slice(0, 2) || []}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Type"}
                        placeholder={"Select Type"}
                        options={assetTypes || []}
                        onSelect={handleTypeSelect}
                      />
                    </Col>
                    {userRoleId !== "8" && (
                      <>
                        <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                          <CustomSelect
                            name={"vendor_id"}
                            label={"Select Vendor"}
                            placeholder={"Select Vendor"}
                            options={AssetTypeVendorDrop || []}
                          />
                        </Col>
                        <Col key="created_by" xs={24} sm={12} md={6} lg={5}>
                          <CustomSelect
                            name={"created_by"}
                            label={"Select GSD"}
                            placeholder={"Select GSD"}
                            options={monitoringAgentDrop || []}
                            // search dropdown
                            isOnSearchFind={true}
                            apiAction={getMonitoringAgent}
                            onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
                          />
                        </Col>
                      </>
                    )}
                    <Col key="code" xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        name={"code"}
                        label={" Item QR Code"}
                        placeholder={" Item QR Code"}
                      />
                    </Col>
                    <Col key="date_format" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"date_format"}
                        label={"Select Date Type"}
                        placeholder={"Select Date Type"}
                        onSelect={handleDateSelect}
                        options={dateOptions || []}
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
                    <Col key="clean_status" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"clean_status"}
                        label={"Select Clean"}
                        placeholder={"Select Clean"}
                        options={cleanStatus || []}
                      />
                    </Col>{" "}
                    <Col key="compliant_status" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"compliant_status"}
                        label={"Select Compliant"}
                        placeholder={"Select Compliant"}
                        options={CompliantStatus || []}
                      />
                    </Col>
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
                  </Row>
                </Form>
              ),
            },
          ]}
        />
        {contextHolder}
      </div>

      <CommonTable
        columns={columns || []}
        uri={"monitoring"}
        details={details || []}
        loading={loading}
        // subtotalName={"Total Unit"}
        // subtotalCount={details?.totalUnit}
        tableSubheading={{
          "Total Unit": `${details?.totalUnit || 0} per page`,
        }}
        scroll={{ x: 1400, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default Monitoring;
