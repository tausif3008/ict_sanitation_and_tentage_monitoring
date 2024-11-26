import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import {
  Collapse,
  Form,
  Input,
  Button,
  Select,
  notification,
  Row,
  Col,
  DatePicker,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";

import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import search from "../../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import { dateWeekOptions } from "../../constant/const";
import InspectionReportSelector from "./Slice/InspectionReportSelector";
import { getInspectionReportData } from "./Slice/InspectionReportSlice";
import { getFormData } from "../../urils/getFormData";

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
  });
  const { InspectionReport_data, loading } = InspectionReportSelector(); // inspectation report data

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

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      ...values,
    };
    if (values?.date_range === "Today") {
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
        from_date: null,
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
      ...searchQuery,
      page: page?.toString(),
      per_page: perPage?.toString(),
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
      setInspectionData((prevDetails) => ({
        ...prevDetails,
        list: InspectionReport_data?.data?.listings || [],
        pageLength: InspectionReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: InspectionReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords:
          InspectionReport_data?.data?.paging?.[0]?.totalrecords || 0,
      }));

      const myexcelData = InspectionReport_data?.data?.listings?.map(
        (data, index) => {
          return {
            sr: index + 1,
            unit_no: data?.unit_no,
            Week: `${columnDate?.start}  - ${columnDate?.end}`,
            "Total Inspections": data?.inspections,
            "Positive Response": data?.count_of_1,
            "Negative Response": data?.count_of_0,
            Escalations: data?.escalations,
          };
        }
      );
      setExcelData(myexcelData);
    }
  }, [InspectionReport_data]);

  const columns = [
    {
      title: "Unit",
      dataIndex: "unit_no",
      key: "unit_no",
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

  // excel
  const exportToExcel = () => {
    if (excelData && excelData?.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inspection Report");
      XLSX.writeFile(workbook, "Inspection-Report.xlsx");
    } else {
      return "";
    }
  };

  return (
    <div className="">
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
                    <Col key="date_range" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item name={"date_range"} label={"Select Date Type"}>
                        <Select
                          placeholder="Select Date Type"
                          className="rounded-none"
                          onSelect={handleDateSelect}
                        >
                          {dateWeekOptions?.map((option) => (
                            <Select.Option
                              key={option?.value}
                              value={option?.value}
                            >
                              {option?.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    {showDateRange && (
                      <>
                        <Col key="from_date" xs={24} sm={12} md={6} lg={5}>
                          <Form.Item
                            name={"form_date"}
                            label={"From Date"}
                            rules={[
                              {
                                required: true,
                                message: "Please select a start date!",
                              },
                            ]}
                          >
                            <DatePicker
                              className="rounded-none w-full"
                              format="DD/MM/YYYY"
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
                          </Form.Item>
                        </Col>

                        <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
                          <Form.Item
                            name={"to_date"}
                            label={"To Date"}
                            rules={[
                              {
                                required: true,
                                message: "Please select a end date!",
                              },
                            ]}
                          >
                            <DatePicker
                              className="rounded-none w-full"
                              disabledDate={disabledDate}
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}

                    <Col
                      xs={24}
                      sm={12}
                      md={6}
                      lg={4}
                      className="flex justify-end gap-2"
                    >
                      <Button
                        type="primary"
                        className="rounded-none bg-5c"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="rounded-none bg-green-300 text-black"
                      >
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ),
            },
          ]}
        />
        {contextHolder}
      </div>
      <CommonDivider label={"Inspection Report "}></CommonDivider>
      <Space style={{ marginBottom: 16, float: "right" }}>
        <Button
          type="primary"
          onClick={() => {
            if (excelData && excelData?.length > 0) {
              message.success("Downloading excel, it might take some time...");
              exportToExcel();
            } else {
              message.error("Data is not available.");
            }
          }}
        >
          Download Excel
        </Button>
        {/* <Button
          type="primary"
          onClick={() => {
            if (excelData && excelData?.length > 0) {
              message.success("Downloading pdf, it might take some time...");
              exportToPDF();
            } else {
              message.error("Data is not available.");
            }
          }}
        >
          Download PDF
        </Button> */}
      </Space>
      <CommonTable
        columns={columns}
        uri={"inspection-report"}
        details={inspectionData || []}
        loading={loading}
        scroll={{ x: 1000, y: 400 }}
        pageSizeOptions={["100"]} // Available page size options
      ></CommonTable>
    </div>
  );
};

export default InspectionReports;
