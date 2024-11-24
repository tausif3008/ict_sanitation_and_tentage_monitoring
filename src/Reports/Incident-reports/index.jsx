import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
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
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import { IMAGELIST } from "../../assets/Images/exportImages";
import URLS from "../../urils/URLS";
import { basicUrl } from "../../Axios/commonAxios";
import { getIncidentReportData } from "./Slice/IncidentReportSlice";
import IncidentReportSelector from "./Slice/IncidentReportSelector";
// import search from "../../assets";
import search from "../../assets/Dashboard/icon-search.png";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { generateSearchQuery } from "../../urils/getSearchQuery";

const IncidentReports = () => {
  const [searchQuery, setSearchQuery] = useState();
  const [excelData, setExcelData] = useState([]);
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
    const searchParams = generateSearchQuery(values);
    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }
    setSearchQuery(searchParams);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
  };

  // handle asset main type
  const handleSelect = (value) => {
    form.setFieldsValue({
      assets_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  const getData = async () => {
    let uri = URLS?.incidencesReport?.path + "?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    } else {
      uri = URLS?.incidencesReport?.path;
    }
    if (searchQuery) {
      uri = uri + searchQuery;
    }
    dispatch(getIncidentReportData(basicUrl + uri)); // get incident reports data
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
            agent_name: data?.agent_name,
            asset_name: data?.asset_name,
            vendor_name: data?.vendor_name,
            code: `${data?.code}-${data?.unit_code || ""}`,
            question_en: data?.question_en,
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
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: "7%",
      render: (text, record) => {
        return text ? `${text} -${record?.unit_number || ""}` : "";
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

  // excel
  const exportToExcel = () => {
    if (excelData && excelData?.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Incident Report");
      XLSX.writeFile(workbook, "Incident-Report.xlsx");
    } else {
      return "";
    }
  };

  // pdf
  const exportToPDF = () => {
    const doc = new jsPDF();
    // const doc = new jsPDF("landscape", undefined, undefined, {
    //   compress: true,
    // });

    // Centered ICT heading
    const ictHeading = "ICT Sanitation and Tentage Monitoring System";
    const pageWidth = doc.internal.pageSize.getWidth();
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
    doc.setFontSize(14);
    doc.setFont("bold");
    doc.text(ictHeading, ictX, 10); // Heading position

    // // Image on the Left (Company Logo or similar image)
    const leftImageX = 10; // X position (from the left)
    const leftImageY = 10; // Y position (from the top)
    const leftImageWidth = 30; // Image width (adjust as needed)
    const leftImageHeight = 25; // Image height (adjust as needed)
    doc.addImage(
      `${IMAGELIST?.govt_logo}`,
      "JPEG",
      leftImageX,
      leftImageY,
      leftImageWidth,
      leftImageHeight,
      undefined,
      undefined,
      "FAST" // Adds compression for smaller file size
    );

    // // Image on the Right (Another logo or image)
    const rightImageX = pageWidth - 40; // X position (from the right)
    const rightImageY = 10; // Y position (from the top)
    const rightImageWidth = 30; // Image width (adjust as needed)
    const rightImageHeight = 25; // Image height (adjust as needed)
    doc.addImage(
      `${IMAGELIST?.kumbhMela}`,
      "JPEG",
      rightImageX,
      rightImageY,
      rightImageWidth,
      rightImageHeight,
      undefined,
      undefined,
      "FAST" // Adds compression for smaller file size
    );

    // Add report title and date on the same line
    const title = "Incident Report";
    const date = new Date();
    const dateString = date.toLocaleString(); // Format the date and time

    // Calculate positions for the title and date
    const titleX = 44; // Left align title
    const dateX = pageWidth - doc.getTextWidth(dateString) - 34; // 14 units from the right

    // Add title and date
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX, 25); // Title position
    doc.setFont("normal");
    doc.setFontSize(10); // Smaller font size for date
    doc.text(dateString, dateX, 25); // Date position

    // Add a horizontal line below the textBetweenImages, but only up to the edges of the images
    const lineStartX = leftImageX + leftImageWidth + 5; // Start after the left image
    const lineEndX = rightImageX - 5; // End before the right image
    doc.line(lineStartX, 30, lineEndX, 30); // x1, y1, x2, y2

    // Table header and content
    doc.autoTable({
      head: [
        [
          "Sr No",
          "Vendor Name",
          // "Email",
          // "Phone",
          // "Address",
          // "Pin code",
          // "Company",
          // "Language",
          "Total",
          "Registered",
          "Clean",
          "Unclean",
        ],
      ],
      body: excelData.map((opt) => [
        opt?.sr,
        opt?.name,
        // opt?.email,
        // opt?.phone,
        // opt?.address,
        // opt?.pin,
        // opt?.company,
        // opt?.language,
        opt?.total,
        opt?.registered,
        opt?.clean,
        opt?.unclean,
      ]),
      startY: 40, // Start after the header and new text
    });

    // Add footer
    const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

    // Save the PDF
    doc.save("Incident-Report.pdf");
  };

  return (
    <div>
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
                      <Form.Item name={"vendor_id"} label={"Select Vendor"}>
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

                    <Col key="assetmaintypes" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item
                        name={"assetmaintypes"}
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

                    <Col key="assets_id" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item name={"assets_id"} label={"Asset Type"}>
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

                    <Col key="asset_code" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item name={"asset_code"} label={"Asset Code"}>
                        <Input
                          placeholder={"Asset Code"}
                          className="rounded-none w-full"
                        />
                      </Form.Item>
                    </Col>

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
      <CommonDivider label={"Incident-Report"} />
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
