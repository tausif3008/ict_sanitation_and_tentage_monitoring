import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
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
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import URLS from "../../urils/URLS";
import { basicUrl } from "../../Axios/commonAxios";
import { getIncidentReportData } from "./Slice/IncidentReportSlice";
import IncidentReportSelector from "./Slice/IncidentReportSelector";
import search from "../../assets/Dashboard/icon-search.png";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import { dateWeekOptions } from "../../constant/const";
import ExportToExcel from "../ExportToExcel";

const IncidentReports = () => {
  const [searchQuery, setSearchQuery] = useState();
  const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [incidentData, setIncidentData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const params = useParams();
  const { loading, IncidentReport_data } = IncidentReportSelector(); // incident selector
  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type

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
  };

  // handle asset main type
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
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
    let uri = URLS?.incidencesReport?.path;
    let isFirstParam = true;

    if (params?.page) {
      uri += isFirstParam ? "?" + params?.page : "&" + params?.page;
      isFirstParam = false;
    } else if (params?.per_page) {
      uri += isFirstParam ? "?" + params?.per_page : "&" + params?.per_page;
      isFirstParam = false;
    }

    if (searchQuery) {
      uri += isFirstParam ? "?" + searchQuery : "&" + searchQuery;
    }

    dispatch(getIncidentReportData(basicUrl + uri)); // Fetch the data
  };

  useEffect(() => {
    getData(); // get incident report data
  }, [params, searchQuery]);

  useEffect(() => {
    dispatch(getVendorList()); // vendor list
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
  }, []);

  useEffect(() => {
    if (IncidentReport_data) {
      setIncidentData((prevDetails) => ({
        ...prevDetails,
        list: IncidentReport_data?.data?.incidences || [],
        pageLength: IncidentReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: IncidentReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: IncidentReport_data?.data?.paging?.[0]?.totalrecords || 0,
      }));

      const myexcelData = IncidentReport_data?.data?.incidences?.map(
        (data, index) => {
          return {
            sr: index + 1,
            code: data?.code,
            unit_no: data?.unit_no,
            question_en: data?.question_en,
            answer: "No",
            date: moment(data?.incidence_at).format("DD-MMM-YYYY HH:MM A"),
            category:
              data?.asset_main_type_id === "1" ? "Sanitation" : "Tentage",
            asset_types_name: data?.asset_types_name,
            vendor_name: data?.vendor_name,
            sector_name: data?.sector_name,
            circle_name: data?.circle_name,
            sanstha_name_hi: data?.sanstha_name_hi,
            // agent_name: data?.agent_name,
            // asset_name: data?.asset_name,
            // code: `${data?.code}-${data?.unit_code || ""}`,
            sla: data?.sla,
          };
        }
      );
      setExcelData(myexcelData);
    }
  }, [IncidentReport_data]);

  const columns = [
    {
      title: "Agent Name",
      dataIndex: "agent_name",
      key: "agent_name",
    },
    {
      title: "Asset Name",
      dataIndex: "asset_name",
      key: "asset_name",
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
    },
    {
      title: "Incidence Date",
      dataIndex: "incidence_at",
      key: "incidence_at",
      width: "8%",
      render: (text, record) => {
        return text ? moment(text).format("DD-MMM-YYYY") : "";
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
      width: "7%",
    },
  ];

  return (
    <div>
      <CommonDivider label={"Incident-Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={"Incident-Report"}
          />
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
                    <Col key="to_user_id" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item name={"to_user_id"} label={"Select Vendor"}>
                        <Select
                          placeholder="Select Vendor"
                          className="rounded-none"
                          allowClear
                          showSearch
                          filterOption={(input, option) => {
                            return option?.children
                              ?.toLowerCase()
                              ?.includes(input?.toLowerCase());
                          }}
                        >
                          {VendorListDrop?.map((option) => (
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

                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item
                        name={"asset_main_type_id"}
                        label={"Asset Main Type"}
                      >
                        <Select
                          placeholder="Select Asset Main Type"
                          className="rounded-none"
                          allowClear
                          showSearch
                          filterOption={(input, option) => {
                            return option?.children
                              ?.toLowerCase()
                              ?.includes(input?.toLowerCase());
                          }}
                          onSelect={handleSelect}
                        >
                          {AssetMainTypeDrop?.map((option) => (
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

                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item name={"asset_type_id"} label={"Asset Type"}>
                        <Select
                          placeholder="Select Asset Type"
                          className="rounded-none"
                          allowClear
                          showSearch
                          filterOption={(input, option) => {
                            return option?.children
                              ?.toLowerCase()
                              ?.includes(input?.toLowerCase());
                          }}
                        >
                          {AssetTypeDrop?.map((option) => (
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

                    <Col key="code" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item name={"code"} label={"Asset Code"}>
                        <Input
                          placeholder={"Asset Code"}
                          className="rounded-none w-full"
                        />
                      </Form.Item>
                    </Col>

                    <Col key="incidence_at" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item
                        name={"incidence_at"}
                        label={"Select Date Type"}
                      >
                        <Select
                          placeholder="Select Date Type"
                          className="rounded-none"
                          allowClear
                          showSearch
                          filterOption={(input, option) => {
                            return option?.children
                              ?.toLowerCase()
                              ?.includes(input?.toLowerCase());
                          }}
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
                        <Col
                          key="incidence_form_date"
                          xs={24}
                          sm={12}
                          md={6}
                          lg={5}
                        >
                          <Form.Item
                            name={"incidence_form_date"}
                            label={"From Date (Incidence Date)"}
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
                          </Form.Item>
                        </Col>
                        <Col
                          key="incidence_to_date"
                          xs={24}
                          sm={12}
                          md={6}
                          lg={5}
                        >
                          <Form.Item
                            name={"incidence_to_date"}
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
      <CommonTable
        loading={loading}
        uri={`incident-report`}
        columns={columns || []}
        details={incidentData || []}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default IncidentReports;
