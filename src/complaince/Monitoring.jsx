import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Collapse, Form, Button, notification, Row, Col } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";
import {
  getMonitoringAgent,
  setAssetInfo,
  setMonitoringListIsUpdated,
  setUpdateMonitoringEl,
} from "./monitoringSlice";

import { Image } from "antd";
import search from "../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../urils/getSearchQuery";
import optionsMaker from "../urils/OptionMaker";
import { dateOptions, getValueLabel } from "../constant/const";
import URLS from "../urils/URLS";
import { getData } from "../Fetch/Axios";
import CommonDivider from "../commonComponents/CommonDivider";
import CommonTable from "../commonComponents/CommonTable";
import { getVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getSectorsList } from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getAllCircleList } from "../Reports/CircleSlice/circleSlices";
import CircleSelector from "../Reports/CircleSlice/circleSelector";
import MonitoringSelector from "./monitoringSelector";
import CustomSelect from "../commonComponents/CustomSelect";
import CustomInput from "../commonComponents/CustomInput";
import ExportToExcel from "../Reports/ExportToExcel";
import ExportToPDF from "../Reports/reportFile";
import CustomDatepicker from "../commonComponents/CustomDatepicker";

const Monitoring = () => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [assetMainType, setAssetMainType] = useState([]); // asset main type
  const [assetTypes, setAssetTypes] = useState([]); // asset type
  const [searchQuery, setSearchQuery] = useState();
  const [showDateRange, setShowDateRange] = useState(false);
  const [excelData, setExcelData] = useState([]); // excel data

  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const { SectorListDrop } = VendorSectorSelectors(); // sector
  const { CircleListDrop } = CircleSelector(); // circle
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop

  const ImageUrl = localStorage.getItem("ImageUrl") || "";
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

  const isUpdatedSelector = useSelector(
    (state) => state.monitoringSlice?.isUpdated
  );

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
      setLoading(false);

      const list = data.listings.map((el, index) => {
        return {
          ...el,
        };
      });

      setDetails(() => {
        return {
          list,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentpage,
          totalRecords: data.paging[0].totalrecords,
        };
      });

      const myexcelData = data?.listings?.map((data, index) => {
        return {
          sr: index + 1,
          "Asset Type Name": data?.asset_type_name,
          Code: Number(data?.asset_code),
          Unit: Number(data?.unit_no),
          "Monitoring Agent Name": data?.agent_name,
          "Vendor Name": data?.vendor_name,
          Sector: data?.sector_name,
          Circle: data?.circle_name,
          Date: data?.created_at
            ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
            : "",
        };
      });
      setExcelData(myexcelData);
    }
  };

  useEffect(() => {
    getDetails();
    if (isUpdatedSelector) {
      dispatch(setMonitoringListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector, searchQuery]);

  // qr code
  useEffect(() => {
    dispatch(setUpdateMonitoringEl({ updateElement: null }));
  }, [dispatch]);

  useEffect(() => {
    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls)); // monitoring agent list
    dispatch(getVendorList()); // vendor list
    dispatch(getSectorsList()); // all sectors list
    dispatch(getAllCircleList()); // all circle list

    return () => {};
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

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      ...values,
    };
    if (values?.from_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.from_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.from_date = values?.from_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    }
    const searchParams = generateSearchQuery(finalData);
    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }
    setSearchQuery(searchParams);
  };

  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
    setShowDateRange(false);
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
      title: "GSD Name",
      dataIndex: "agent_name",
      key: "agent_name",
      render: (text) => {
        return text ? text : "GSD";
      },
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_id",
      key: "vendor_id",
      render: (text) => {
        return getValueLabel(text, VendorListDrop, "Vendor Name");
      },
    },
    {
      title: "Sector Name",
      dataIndex: "sector_id",
      key: "sector_id",
      render: (text) => {
        return getValueLabel(text, SectorListDrop, "sector");
      },
    },
    {
      title: "Circle Name",
      dataIndex: "circle_id",
      key: "circle_id",
      render: (text) => {
        return getValueLabel(text, CircleListDrop, "circle");
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => {
        return text ? moment(text).format("DD-MMM-YYYY") : "";
      },
    },
    {
      title: "remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "View Monitoring Details",
      key: "action",
      fixed: "right",
      width: 130,

      render: (text, record) => (
        <div className="flex gap-2">
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              navigate("/monitoring-report/" + record.id);
              dispatch(setAssetInfo(record));
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
    "Unit",
    "GSD Name",
    "Vendor Name",
    "Sector",
    "Circle",
    "Date",
  ];

  // pdf data
  const pdfData = details?.list?.map((data, index) => [
    index + 1,
    data?.asset_type_name,
    data?.asset_code,
    data?.unit_no,
    data?.agent_name ? data?.agent_name : "GSD",
    data?.vendor_name,
    data?.sector_name,
    data?.circle_name,
    data?.created_at
      ? moment(data?.created_at).format("DD-MMM-YYYY hh:mm A")
      : "",
  ]);

  return (
    <div className="">
      <CommonDivider label={"Toilet & Tentage Monitoring"}></CommonDivider>
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          <ExportToPDF
            titleName={"Toilet & Tentage Monitoring"}
            pdfName={"Monitoring Report"}
            headerData={pdfHeader}
            rows={pdfData}
            landscape={true}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={"Monitoring Report"}
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
                    {userRoleId != "8" && (
                      <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                        <CustomSelect
                          name={"vendor_id"}
                          label={"Select Vendor"}
                          placeholder={"Select Vendor"}
                          options={VendorListDrop || []}
                        />
                      </Col>
                    )}
                    <Col key="assetmaintypes" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"assetmaintypes"}
                        label={"Select Category"}
                        placeholder={"Select Category"}
                        onSelect={handleSelect}
                        options={assetMainType || []}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Type"}
                        placeholder={"Select Type"}
                        options={assetTypes || []}
                      />
                    </Col>
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
                        <Col key="from_date" xs={24} sm={12} md={6} lg={5}>
                          <CustomDatepicker
                            name={"from_date"}
                            label={"From Date"}
                            className="w-full"
                            placeholder={"From Date"}
                            rules={[
                              {
                                required: true,
                                message: "Please select a start date!",
                              },
                            ]}
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
                          />
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
        columns={columns}
        uri={"monitoring"}
        details={details}
        loading={loading}
        scroll={{ x: 1000, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default Monitoring;
