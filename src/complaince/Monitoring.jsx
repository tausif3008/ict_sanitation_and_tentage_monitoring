import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import URLS from "../urils/URLS";
import { getData } from "../Fetch/Axios";
import {} from "../register/AssetType/AssetTypeSlice";
import CommonDivider from "../commonComponents/CommonDivider";
import CommonTable from "../commonComponents/CommonTable";
import {
  Collapse,
  Form,
  Input,
  Button,
  Select,
  notification,
  Row,
  Col,
} from "antd";
import {
  setAssetInfo,
  setMonitoringListIsUpdated,
  setUpdateMonitoringEl,
} from "./monitoringSlice";
import { Image } from "antd";
import search from "../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../urils/getSearchQuery";
import optionsMaker from "../urils/OptionMaker";

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

    if (params.page) {
      uri = uri + params.page;
    }

    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    if (searchQuery) {
      uri = uri + searchQuery;
    }

    console.log("searchQuery", searchQuery);
    console.log("uri", uri);
    console.log("params", params);

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
    const searchParams = generateSearchQuery(values);
    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }
    setSearchQuery(searchParams);
  };

  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
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
      key: "assetsCode",
      width: 110,
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
                  key="1"
                >
                  <Row gutter={[16, 16]} align="middle">
                    <Col key={1} xs={24} sm={12} md={6} lg={5}>
                      <Form.Item
                        name={"assetmaintypes"}
                        label={"Asset Main Type"}
                      >
                        <Select
                          placeholder="Select status"
                          className="rounded-none"
                          onSelect={handleSelect} // Add onSelect handler
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
                    <Col key={1} xs={24} sm={12} md={6} lg={5}>
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
                    <Col key={1} xs={24} sm={12} md={6} lg={5}>
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
      {/* <CommonSearchForm
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        fields={[
          { name: "asset_type_name", label: "Asset Type Name" },
          { name: "asset_code", label: "Asset Code" },
          // { name: "index_no", label: "Index No." },
        ]}
      ></CommonSearchForm> */}
      <CommonDivider
        label={"Asset Type Monitoring "}
        // compo={
        //   <Button
        //     className="bg-orange-300 mb-1"
        //     onClick={() => {
        //       navigate("/add-update-monitoring");
        //     }}
        //   >
        //     Add Monitoring
        //   </Button>
        // }
      ></CommonDivider>

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
