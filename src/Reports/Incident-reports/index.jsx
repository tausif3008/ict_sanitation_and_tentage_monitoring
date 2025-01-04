import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { Collapse, Form, Button, notification, Row, Col, message } from "antd";

import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import URLS from "../../urils/URLS";
import { basicUrl } from "../../Axios/commonAxios";
import { getIncidentReportData } from "./Slice/IncidentReportSlice";
import IncidentReportSelector from "./Slice/IncidentReportSelector";
import search from "../../assets/Dashboard/icon-search.png";
import { getAssetTypeWiseVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import { dateWeekOptions, getValueLabel } from "../../constant/const";
// import ExportToExcel from "../ExportToExcel";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { exportToExcel } from "../ExportExcelFuntion";
// import { ExportPdfFunction } from "../ExportPdfFunction";
import { getPdfExcelData } from "../../register/asset/AssetsSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";

const IncidentReports = () => {
  const [searchQuery, setSearchQuery] = useState();
  // const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [incidentData, setIncidentData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [filesName, setFilesName] = useState(null); // files Name

  const dispatch = useDispatch();
  const params = useParams();
  const { loading, IncidentReport_data } = IncidentReportSelector(); // incident selector
  const { AssetTypeVendorDrop } = VendorSupervisorSelector(); // asset type wise vendor
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification({ top: 100 });
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Note",
      duration: 7,
      description: "Please enter some information to perform the search.",
    });
  };

  const userRoleId = localStorage.getItem("role_id");
  const user_Id = localStorage.getItem("userId");
  const categoryType = form.getFieldValue("asset_main_type_id");
  const asset_type_id_name = form.getFieldValue("asset_type_id");
  const vendor_id_name = form.getFieldValue("vendor_id");
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

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      ...values,
    };
    // if (values?.incidence_at === "Today") {
    //   finalData.incidence_form_date = moment().format("YYYY-MM-DD");
    //   finalData.incidence_to_date = moment().format("YYYY-MM-DD");
    // } else if (values?.incidence_at === "Week") {
    //   finalData.incidence_form_date = moment()
    //     .subtract(8, "days")
    //     .format("YYYY-MM-DD");
    //   finalData.incidence_to_date = moment().format("YYYY-MM-DD");
    // } else

    if (values?.incidence_form_date || values?.incidence_to_date) {
      const dayjsObjectFrom = dayjs(values?.incidence_form_date?.$d);
      const dayjsObjectTo = dayjs(values?.incidence_to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.incidence_form_date = values?.incidence_form_date ? start : end;
      finalData.incidence_to_date = values?.incidence_to_date ? end : start;
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
    getTodayData();
  };

  const getTodayData = () => {
    userRoleId === "9" && form.setFieldValue("sector_id", userSectorId);
  };

  // handle asset main type
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      to_user_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  // handle asset type
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      to_user_id: null,
    });
    value && userRoleId != "8" && dispatch(getAssetTypeWiseVendorList(value)); // asset type wise vendor list
  };

  // handle date select
  const handleDateSelect = (value) => {
    if (value === "Date Range") {
      setShowDateRange(true);
    } else {
      form.setFieldsValue({
        incidence_form_date: null,
        incidence_to_date: null,
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

  const getData = async () => {
    let uri = URLS?.incidencesReport?.path + "?";
    if (userRoleId === "8") {
      uri = uri + `to_user_id=${user_Id}`;
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
    if (userRoleId === "9" && !uri.includes(`sector_id=${userSectorId}`)) {
      uri = uri + `sector_id=${userSectorId}`;
    }
    dispatch(getIncidentReportData(basicUrl + uri)); // Fetch the data
  };

  // file name
  const getReportName = () => {
    const catTypeName = getValueLabel(categoryType, AssetMainTypeDrop, "");
    const assetTypeName = getValueLabel(asset_type_id_name, AssetTypeDrop, "");
    const vendorName = getValueLabel(
      vendor_id_name,
      AssetTypeVendorDrop,
      "Vendor"
    );

    if (vendor_id_name && asset_type_id_name) {
      return `${vendorName} - ( ${assetTypeName} ) -Incident Report`;
    }
    if (vendor_id_name) {
      return `${vendorName} - ${catTypeName} -Incident Report`;
    }
    if (asset_type_id_name) {
      return `${catTypeName} (${assetTypeName})- Incident Report`;
    }
    if (categoryType) {
      return `${catTypeName}- Incident Report`;
    }
    return "Incident Report";
  };
  useEffect(() => {
    setFilesName(getReportName()); // file name
  }, [categoryType, asset_type_id_name, vendor_id_name, AssetMainTypeDrop]);

  useEffect(() => {
    getData(); // get incident report data
  }, [params, searchQuery]);

  useEffect(() => {
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    dispatch(getSectorsList()); // all sectors
    getTodayData();
  }, []);

  useEffect(() => {
    if (IncidentReport_data) {
      const unitCount = IncidentReport_data?.data?.incidences?.reduce(
        (total, item) => {
          return total + Number(item?.unit_no);
        },
        0
      );
      setIncidentData((prevDetails) => ({
        ...prevDetails,
        list: IncidentReport_data?.data?.incidences || [],
        pageLength: IncidentReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: IncidentReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: IncidentReport_data?.data?.paging?.[0]?.totalrecords || 0,
        totalUnits: unitCount || 0,
      }));

      // const myexcelData = IncidentReport_data?.data?.incidences?.map(
      //   (data, index) => {
      //     return {
      //       sr: index + 1,
      //       code: data?.code,
      //       unit_no: data?.unit_no,
      //       question_en: data?.question_en,
      //       answer: "No",
      //       date: moment(data?.incidence_at).format("DD-MMM-YYYY hh:mm A"),
      //       category:
      //         data?.asset_main_type_id === "1" ? "Sanitation" : "Tentage",
      //       asset_types_name: data?.asset_types_name,
      //       vendor_name: data?.vendor_name,
      //       sector_name: data?.sector_name,
      //       circle_name: data?.circle_name,
      //       sanstha_name_hi: data?.sanstha_name_hi,
      //       sla: data?.sla,
      //     };
      //   }
      // );
      // setExcelData(myexcelData);
    }
  }, [IncidentReport_data]);

  const columns = [
    {
      title: "Agent Name",
      dataIndex: "agent_name",
      key: "agent_name",
      render: (text, record) => {
        return text ? text : "GSD";
      },
      width: "10%",
    },
    {
      title: "Asset Type Name",
      dataIndex: "asset_types_name",
      key: "asset_types_name",
    },
    ...(userRoleId === "8"
      ? []
      : [
          {
            title: "Vendor Name",
            dataIndex: "vendor_name",
            key: "vendor_name",
          },
        ]),

    {
      title: "Incidence Date",
      dataIndex: "incidence_at",
      key: "incidence_at",
      width: "8%",
      render: (text, record) => {
        return text ? moment(text).format("DD-MMM-YYYY hh:mm A") : "";
      },
    },
    {
      title: "Resolved Date",
      dataIndex: "resolved_at",
      key: "resolved_at",
      width: "8%",
      render: (text, record) => {
        const date = moment(text).format("DD-MMM-YYYY");
        return text ? (date === "Invalid date" ? "NA" : date) : "";
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: "7%",
      render: (text, record) => {
        return text ? `${text} -${record?.unit_no || ""}` : "";
      },
    },
    {
      title: "Question (Eng)",
      dataIndex: "question_en",
      key: "question_en",
      width: "37%",
    },
    {
      title: "SLA Time",
      dataIndex: "sla",
      key: "sla",
      width: "5%",
    },
  ];

  // excel && pdf file
  const exportToFile = async (isExcel) => {
    try {
      const url = URLS.incidencesReport.path + "?page=1&per_page=5000";
      let newUrl = `${url}${searchQuery ? searchQuery : ""}`;
      if (userRoleId === "9" && !newUrl.includes(`sector_id=${userSectorId}`)) {
        newUrl = newUrl + `&sector_id=${userSectorId}`;
      }
      const res = await dispatch(getPdfExcelData(newUrl));
      if (!res?.data?.incidences) {
        throw new Error("No incidences found in the response data.");
      }
      // Calculate total units
      const unitCount = res?.data?.incidences?.reduce((total, item) => {
        return total + Number(item?.unit_no);
      }, 0);
      // Map data for Excel
      const myexcelData =
        isExcel &&
        res?.data?.incidences?.map((data, index) => {
          const date = moment(data?.resolved_at).format("DD-MMM-YYYY hh:mm A");
          return {
            Sr: index + 1,
            "Asset Type Name": data?.asset_types_name,
            Code: Number(data?.code),
            Unit: Number(data?.unit_no),
            "GSD Name": data?.agent_name || "GSD",
            "Vendor Name": data?.vendor_name,
            "Incidence Date": data?.incidence_at
              ? moment(data?.incidence_at).format("DD-MMM-YYYY hh:mm A")
              : "",
            "Resolved Date": date === "Invalid date" ? "NA" : date,
            Sector: data?.sector_name,
            Circle: data?.circle_name,
            Question: data?.question_en,
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
        ]);

      // const pdfData =
      //   !isExcel &&
      //   res?.data?.listings?.map((data, index) => [
      //     index + 1,
      //     data?.asset_type_name,
      //     data?.asset_code,
      //     data?.unit_no,
      //     data?.agent_name ? data?.agent_name : "GSD",
      //     data?.vendor_name,
      //     data?.sector_name,
      //     data?.circle_name,
      //     data?.created_at
      //       ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
      //       : "",
      //   ]);

      // Call the export function
      // !isExcel &&
      //   ExportPdfFunction(
      //     "Toilet & Tentage Monitoring",
      //     filesName,
      //     "pdfHeader",
      //     pdfData,
      //     true
      //   );
    } catch (error) {
      message.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div>
      <CommonDivider label={"Incident-Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          {/* <ExportToExcel
            excelData={excelData || []}
            fileName={"Incident-Report"}
          /> */}
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
                        options={AssetMainTypeDrop || []}
                        onSelect={handleSelect}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Type"}
                        placeholder={"Select Type"}
                        options={AssetTypeDrop || []}
                        onSelect={handleTypeSelect}
                      />
                    </Col>
                    {userRoleId != "8" && (
                      <Col key="to_user_id" xs={24} sm={12} md={6} lg={5}>
                        <CustomSelect
                          name={"to_user_id"}
                          label={"Select Vendor"}
                          placeholder={"Select Vendor"}
                          options={AssetTypeVendorDrop || []}
                        />
                      </Col>
                    )}
                    <Col key="code" xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        name={"code"}
                        label={"Asset Code"}
                        placeholder={"Asset Code"}
                      />
                    </Col>
                    <Col key="incidence_at" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"incidence_at"}
                        label={"Select Date Type"}
                        placeholder={"Select Date Type"}
                        options={dateWeekOptions || []}
                        onSelect={handleDateSelect}
                      />
                    </Col>
                    {showDateRange && (
                      <>
                        <Col key="form_date" xs={24} sm={12} md={6} lg={5}>
                          <CustomDatepicker
                            name={"incidence_form_date"}
                            label={"From Date (Incidence Date)"}
                            className="w-full"
                            placeholder={"Date"}
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
                                form.getFieldValue("incidence_to_date")?.$d
                              );
                              const endDate = dayjsObjectTo;

                              // Condition 1: If startDate is after endDate, set end_time to null
                              if (startDate.isAfter(endDate)) {
                                form.setFieldValue("incidence_to_date", null);
                              }

                              // Condition 2: If startDate is more than 7 days before endDate, set end_time to null
                              const daysDifference = endDate.diff(
                                startDate,
                                "days"
                              );
                              if (daysDifference > 7) {
                                form.setFieldValue("incidence_to_date", null);
                              } else {
                                // If the difference is within the allowed range, you can keep the value or process further if needed.
                              }

                              setStartDate(startDate.format("YYYY-MM-DD"));
                            }}
                          />
                        </Col>
                        <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
                          <CustomDatepicker
                            name={"incidence_to_date"}
                            label={"To Date"}
                            rules={[
                              {
                                required: true,
                                message: "Please select a end date!",
                              },
                            ]}
                            className="w-full"
                            placeholder={"Date"}
                            disabledDate={disabledDate}
                          />
                        </Col>
                      </>
                    )}
                    <Col key="sector_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"sector_id"}
                        allowClear={userRoleId === "9" ? false : true}
                        label={"Select Sector"}
                        placeholder={"Select Sector"}
                        options={
                          userRoleId === "9"
                            ? SectorArray
                            : SectorListDrop || []
                        }
                      />{" "}
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
        loading={loading}
        uri={`incident-report`}
        columns={columns || []}
        details={incidentData || []}
        scroll={{ x: 300, y: 400 }}
        subtotalName={"Total Units"}
        subtotalCount={incidentData?.totalUnits}
      ></CommonTable>
    </div>
  );
};

export default IncidentReports;
