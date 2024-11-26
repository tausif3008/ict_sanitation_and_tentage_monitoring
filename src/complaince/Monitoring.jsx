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
} from "antd";
import dayjs from "dayjs";
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
import {} from "../register/AssetType/AssetTypeSlice";
import CommonDivider from "../commonComponents/CommonDivider";
import CommonTable from "../commonComponents/CommonTable";
import { getVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import moment from "moment/moment";
import { getSectorsList } from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getAllCircleList } from "../Reports/CircleSlice/circleSlices";
import CircleSelector from "../Reports/CircleSlice/circleSelector";
import MonitoringSelector from "./monitoringSelector";

const Monitoring = () => {
  const dispatch = useDispatch();
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
  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const { SectorListDrop } = VendorSectorSelectors(); // sector
  const { CircleListDrop } = CircleSelector(); // circle
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop

  const userRoleId = localStorage.getItem("role_id");
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;

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

  const params = useParams();
  const navigate = useNavigate();

  // qr

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
    dispatch(getMonitoringAgent()); // monitoring agent list
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
      title: "Assets Type Name",
      dataIndex: "asset_type_name",
      key: "assetsName",
      width: 210,
    },

    {
      title: "Assets Code",
      dataIndex: "asset_code",
      key: "asset_code",
      width: 110,
      render: (text, record) => {
        return text ? `${text}-${record?.unit_no}` : "";
      },
    },
    // {
    //   title: "Index Number",
    //   dataIndex: "index_no",
    //   key: "assetsCode",
    //   width: 110,
    // },
    {
      title: "QR",
      dataIndex: "asset_qr_code",
      width: 80,
      render: (qr) => {
        return (
          <Image
            src={URLS.baseUrl + "/" + qr}
            alt="QR Code"
            style={{ maxWidth: "50px" }}
          />
        );
      },
    },
    {
      title: "Agent Name",
      dataIndex: "created_by",
      key: "created_by",
      render: (text) => {
        return getValueLabel(text, monitoringAgentDrop, "Agent Name");
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
      title: "Action",
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
                    <Col key="created_by" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item
                        name={"created_by"}
                        label={"Select Monitoring Agent"}
                      >
                        <Select
                          placeholder="Select Monitoring Agent"
                          className="rounded-none"
                        >
                          {monitoringAgentDrop?.map((option) => (
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

                    {userRoleId != "8" && (
                      <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                        <Form.Item name={"vendor_id"} label={"Select Vendor"}>
                          <Select
                            placeholder="Select Vendor"
                            className="rounded-none"
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
                    )}

                    <Col key="assetmaintypes" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item
                        name={"assetmaintypes"}
                        label={"Asset Main Type"}
                      >
                        <Select
                          placeholder="Select Asset Main Type"
                          className="rounded-none"
                          onSelect={handleSelect}
                        >
                          {assetMainType?.map((option) => (
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
                        >
                          {assetTypes?.map((option) => (
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

                    <Col key="date_format" xs={24} sm={12} md={6} lg={5}>
                      <Form.Item
                        name={"date_format"}
                        label={"Select Date Type"}
                      >
                        <Select
                          placeholder="Select Date Type"
                          className="rounded-none"
                          onSelect={handleDateSelect}
                        >
                          {dateOptions?.map((option) => (
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
                          <Form.Item name={"from_date"} label={"From Date"}>
                            <DatePicker
                              className="rounded-none w-full"
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Col>

                        <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
                          <Form.Item name={"to_date"} label={"To Date"}>
                            <DatePicker
                              className="rounded-none w-full"
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
      <CommonDivider label={"Asset Type Monitoring "}></CommonDivider>

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
