import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import {
  Collapse,
  Form,
  Button,
  notification,
  Row,
  Col,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";

import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import search from "../../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import { dateWeekOptions, getFormatedNumber } from "../../constant/const";
import InspectionReportSelector from "./Slice/InspectionReportSelector";
import { getInspectionReportData } from "./Slice/InspectionReportSlice";
import { getFormData } from "../../urils/getFormData";
import ExportToExcel from "../ExportToExcel";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";

const InspectionReports = () => {
  const [searchQuery, setSearchQuery] = useState();
  const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [columnDate, setColumnDate] = useState({
    start: null,
    end: null,
  });
  const [startDate, setStartDate] = useState(null);
  const [inspectionData, setInspectionData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
    totalInspections: 0, // Add default values for all required properties
    PositiveResponse: 0,
    NegativeResponse: 0,
    Escalations: 0,
    UnitCount: 0,
  });
  const { InspectionReport_data, loading } = InspectionReportSelector(); // inspectation report data
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown

  const dispatch = useDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification({ top: 100 });
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Note",
      duration: 7,
      description: "Please enter some information to perform the search.",
    });
  };

  const date_format_name = form.getFieldValue("date_format");
  const form_date_name = dayjs(form.getFieldValue("form_date")).format(
    "DD-MMM-YYYY"
  );
  const to_date_name = dayjs(form.getFieldValue("to_date")).format(
    "DD-MMM-YYYY"
  );

  const userRoleId = localStorage.getItem("role_id");
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
    if (values?.date_format === "Today") {
      finalData.form_date = moment().format("YYYY-MM-DD");
      finalData.to_date = moment().format("YYYY-MM-DD");
    } else if (values?.form_date || values?.to_date) {
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
    setSearchQuery(finalData);
  };

  // reset
  const resetForm = () => {
    setShowDateRange(false);
    setInspectionData([]);
    setExcelData([]);
    form.resetFields();
    setSearchQuery("&");
    getTodayData();
  };

  const getTodayData = () => {
    userRoleId === "9" && form.setFieldValue("sector_id", userSectorId);
  };

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
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

  const getData = async () => {
    const queryString = params?.page ? params?.page : params?.per_page;
    const rrr = new URLSearchParams(queryString);
    const page = rrr.get("page"); // "1"
    const perPage = rrr.get("per_page"); // "50"

    const finalData = {
      ...(searchQuery?.sector_id && { sector_id: searchQuery?.sector_id }),
      form_date: searchQuery?.form_date,
      to_date: searchQuery?.to_date,
      date_format: "Date Range",
      page: page?.toString() || "1",
      per_page: perPage?.toString() || "100",
    };

    setColumnDate(() => ({
      start: moment(finalData?.form_date).format("DD-MMM-YYYY"),
      end: moment(finalData?.to_date).format("DD-MMM-YYYY"),
    }));

    const formData = getFormData(finalData);
    finalData?.form_date && dispatch(getInspectionReportData(formData)); // Fetch the data
  };

  useEffect(() => {
    getData(); // get inspection report data
  }, [params, searchQuery]);

  useEffect(() => {
    if (InspectionReport_data) {
      const totalInspections = InspectionReport_data?.data?.listings?.reduce(
        (total, start) => {
          return total + Number(start?.inspections);
        },
        0
      );
      const PositiveResponse = InspectionReport_data?.data?.listings?.reduce(
        (total, start) => {
          return total + Number(start?.count_of_1);
        },
        0
      );
      const NegativeResponse = InspectionReport_data?.data?.listings?.reduce(
        (total, start) => {
          return total + Number(start?.count_of_0);
        },
        0
      );
      const Escalations = InspectionReport_data?.data?.listings?.reduce(
        (total, start) => {
          return total + Number(start?.escalations);
        },
        0
      );
      const UnitCount = InspectionReport_data?.data?.listings?.reduce(
        (total, start) => {
          return total + Number(start?.unit_no);
        },
        0
      );
      setInspectionData((prevDetails) => ({
        ...prevDetails,
        list: InspectionReport_data?.data?.listings || [],
        pageLength: InspectionReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: InspectionReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords:
          InspectionReport_data?.data?.paging?.[0]?.totalrecords || 0,
        totalInspections,
        PositiveResponse,
        NegativeResponse,
        Escalations,
        UnitCount,
      }));

      const myexcelData = InspectionReport_data?.data?.listings?.map(
        (data, index) => {
          return {
            Sr: index + 1,
            Code: Number(data?.asset_code),
            Unit: Number(data?.unit_no),
            "Asset Type Name": data?.asset_type_name,
            Week: `${columnDate?.start}  - ${columnDate?.end}`,
            Inspections: Number(data?.inspections),
            "Positive Response": Number(data?.count_of_1),
            "Negative Response": Number(data?.count_of_0),
            Escalations: Number(data?.escalations),
          };
        }
      );
      setExcelData(myexcelData);
    }
  }, [InspectionReport_data]);

  useEffect(() => {
    dispatch(getSectorsList()); // all sectors
    getTodayData();
  }, []);

  const columns = [
    {
      title: "Unit",
      dataIndex: "unit_no",
      key: "unit_no",
      render: (text, record) => {
        return text ? `${record?.asset_code}-${text}` : "";
      },
    },
    {
      title: "Asset Type Name",
      dataIndex: "asset_type_name",
      key: "asset_type_name",
    },
    {
      title: "Week",
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        return columnDate?.start
          ? `${columnDate?.start}  - ${columnDate?.end}`
          : "";
      },
    },
    {
      title: "Total Inspections",
      dataIndex: "inspections",
      key: "inspections",
    },
    {
      title: "Positive Response",
      dataIndex: "count_of_1",
      key: "count_of_1",
    },
    {
      title: "Negative Response",
      dataIndex: "count_of_0",
      key: "count_of_0",
    },
    {
      title: "Escalations",
      dataIndex: "escalations",
      key: "escalations",
    },
  ];

  return (
    <>
      <CommonDivider label={"Inspection Report "}></CommonDivider>
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToExcel
          excelData={excelData || []}
          fileName={
            date_format_name === "Today"
              ? `Inspection-Report (${moment().format("DD-MMM-YYYY")})`
              : `Inspection-Report (${form_date_name} to ${to_date_name})`
          }
          dynamicArray={[
            {
              name: "Total Unit",
              value: inspectionData?.UnitCount,
              colIndex: 3,
            },
            {
              name: "Total Inspections",
              value: inspectionData?.totalInspections,
              colIndex: 6,
            },
            {
              name: "Positive Response",
              value: inspectionData?.PositiveResponse,
              colIndex: 7,
            },
            {
              name: "Negative Response",
              value: inspectionData?.NegativeResponse,
              colIndex: 8,
            },
            {
              name: "Escalations",
              value: inspectionData?.Escalations,
              colIndex: 9,
            },
          ]}
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
                <Row gutter={[16, 16]} align="middle">
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
                          message: "Please select Date Type",
                        },
                      ]}
                    />{" "}
                  </Col>
                  {showDateRange && (
                    <>
                      <Col key="form_date" xs={24} sm={12} md={6} lg={5}>
                        <CustomDatepicker
                          name={"form_date"}
                          label={"From Date"}
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
                        userRoleId === "9" ? SectorArray : SectorListDrop || []
                      }
                    />{" "}
                  </Col>
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <Button
                      loading={loading}
                      type="button"
                      htmlType="submit"
                      className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Search
                    </Button>
                    <Button
                      loading={loading}
                      type="button"
                      className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                  </div>
                </Row>
              </Form>
            ),
          },
        ]}
      />
      {contextHolder}
      <CommonTable
        columns={columns}
        uri={"inspection-report"}
        details={inspectionData || []}
        loading={loading}
        scroll={{ x: 1000, y: 400 }}
        pageSizeOptions={["100"]} // Available page size options
        tableSubheading={{
          "Total Inspections":
            getFormatedNumber(inspectionData?.totalInspections) || 0,
          "Positive Response":
            getFormatedNumber(inspectionData?.PositiveResponse) || 0,
          "Negative Response":
            getFormatedNumber(inspectionData?.NegativeResponse) || 0,
          Escalations: getFormatedNumber(inspectionData?.Escalations) || 0,
        }}
      ></CommonTable>
    </>
  );
};

export default InspectionReports;
