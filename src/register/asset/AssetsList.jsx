import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  Collapse,
  Form,
  notification,
  Row,
  Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import CommonTable from "../../commonComponents/CommonTable";
import search from "../../assets/Dashboard/icon-search.png";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { setAssetListIsUpdated, setUpdateAssetEl } from "./AssetsSlice";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import { getAllCircleList } from "../../Reports/CircleSlice/circleSlices";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import CircleSelector from "../../Reports/CircleSlice/circleSelector";
import MonitoringSelector from "../../complaince/monitoringSelector";
import CustomInput from "../../commonComponents/CustomInput";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import { getAssetMainTypes, getAssetTypes } from "../AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../AssetType/assetTypeSelectors";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import { getValueLabel } from "../../constant/const";
import moment from "moment";
import CoordinatesMap from "../../commonComponents/map/map";
import ExportToExcel from "../../Reports/ExportToExcel";
import ShowCode from "./showCode";

const AssetsList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [searchQuery, setSearchQuery] = useState();
  const [loading, setLoading] = useState(false);
  const [totalUnit, setTotalUnit] = useState(0); // unit count
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [excelData, setExcelData] = useState([]); // excel data

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

  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const { SectorListDrop } = VendorSectorSelectors(); // sector
  const { CircleListDrop } = CircleSelector(); // circle
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const isUpdatedSelector = useSelector(
    (state) => state.assetsSlice?.isUpdated
  );

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  // handle monitoring agent
  let timeoutId = null;
  const handleSelectChange = (value) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      const urls = URLS?.monitoringAgent?.path;
      dispatch(getMonitoringAgent(`${urls}&keywords=${value}`));
    }, 500);
  };

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      ...values,
    };
    const searchParams = generateSearchQuery(finalData);
    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }
    setSearchQuery(searchParams);
  };

  // reset
  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
  };

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.assetList.path + "?";
    if (params.page) {
      uri = uri + params.page;
    }

    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    if (searchQuery) {
      uri = uri + searchQuery;
    }

    const extraHeaders = { "x-api-version": URLS.assetTypes.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);
      const list = data.listings.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
          action: (
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              onClick={() => {
                navigate(`/asset-details/${el.assets_id}`);
              }}
            >
              Details
            </Button>
          ),
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

      const unitCount = data?.listings?.reduce((acc, listing) => {
        return acc + (listing?.units?.length || 0);
      }, 0);
      setTotalUnit(unitCount);

      const myexcelData = data?.listings?.map((data, index) => {
        return {
          sr: index + 1,
          Category: data?.asset_main_type_name,
          "Toilets & Tentage Type": data?.asset_main_type_name,
          "Vendor Name": data?.vendor_name,
          "Monitoring Agent Name": data?.created_by,
          Sector: data?.sector_name,
          Circle: data?.circle_name,
          "Vendor Asset Code": data?.vendor_asset_code,
          Code: data?.code,
          Unit: data?.unit,
          "Register Date": data?.tagged_at
            ? moment(data?.tagged_at).format("DD-MMM-YYYY hh:mm A")
            : "",
        };
      });
      setExcelData(myexcelData);
    }
  };

  useEffect(() => {
    getDetails();
    if (isUpdatedSelector) {
      dispatch(setAssetListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector, searchQuery]);

  useEffect(() => {
    dispatch(setUpdateAssetEl({ updateElement: null }));
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls)); // monitoring agent list
    dispatch(getVendorList()); // vendor list
    dispatch(getSectorsList()); // all sectors list
    dispatch(getAllCircleList()); // all circle list
  }, []);

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "sr",
      key: "sr",
      width: 55,
    },
    {
      title: "Category",
      dataIndex: "asset_main_type_name",
      key: "asset_main_type_name",
      width: 100,
    },
    {
      title: "Toilets & Tentage Type",
      dataIndex: "asset_type_name",
      key: "asset_type_name",
      width: 200,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      width: 200,
    },
    {
      title: "Monitoring Agent Name",
      dataIndex: "created_by",
      key: "created_by",
      render: (text) => {
        return getValueLabel(text, monitoringAgentDrop, "GSD");
      },
    },
    {
      title: "Sector",
      dataIndex: "sector_name",
      key: "sector_name",
      width: 100,
    },
    {
      title: "Circle",
      dataIndex: "circle_name",
      key: "circle_name",
      width: 100,
    },
    {
      title: "Vendor Asset Code",
      dataIndex: "vendor_asset_code",
      key: "vendor_asset_code",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text, record) => {
        return (
          <ShowCode
            showData={`${text}-${record?.unit}`}
            tableData={record?.units}
          />
        );
      },
    },
    {
      title: "Location",
      render: (text, record) => {
        return record?.longitude && record?.latitude ? (
          <CoordinatesMap
            coordinates={[record?.longitude, record?.latitude]}
            showLocation={false}
          />
        ) : (
          "NA"
        );
      },
    },
    {
      title: "QR Code",
      width: 100,
      render: (text, record) => (
        <Image
          src={URLS.baseUrl + "/" + record.qr_code}
          width={60}
          height={60}
          alt={record.qr_code}
        ></Image>
      ),
      key: "qrCode",
    },
    {
      title: "Photo",
      width: 100,
      render: (text, record) =>
        record.photo ? (
          <Image
            width={60}
            height={60}
            src={`https://kumbhtsmonitoring.in/php-api/${record.photo}`}
            alt="Assets Photo"
          />
        ) : (
          "No Image"
        ),
      key: "photo",
    },
    {
      title: "Register At",
      dataIndex: "tagged_at",
      key: "tagged_at",
      render: (text, record) => {
        return text ? moment(text).format("DD-MMM-YYYY hh:mm A") : "";
      },
    },
  ];

  return (
    <div className="">
      <CommonDivider
        label={"Toilets & Tentage List"}
        // compo={
        //   <Button
        //     className="bg-orange-300 mb-1"
        //     onClick={() => {
        //       navigate("/asset-registration");
        //     }}
        //   >
        //     Add Asset
        //   </Button>
        // }
      ></CommonDivider>
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={"Toilets & Tentage List"}
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
                        label={"Select Monitoring Agent"}
                        placeholder={"Select Monitoring Agent"}
                        options={monitoringAgentDrop || []}
                        onSearch={(value) => {
                          handleSelectChange(value);
                        }}
                      />
                    </Col>
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
                      />
                    </Col>
                    <Col key="assetmaintypes" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"assetmaintypes"}
                        label={"Select Category"}
                        placeholder={"Select Category"}
                        onSelect={handleSelect}
                        options={AssetMainTypeDrop || []}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Asset Type"}
                        placeholder={"Select Asset Type"}
                        options={AssetTypeDrop || []}
                      />
                    </Col>
                    <Col key="sector_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"sector_id"}
                        label={"Select Sector"}
                        placeholder={"Select Sector"}
                        options={SectorListDrop || []}
                      />
                    </Col>
                    <Col key="circle_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"circle_id"}
                        label={"Select Circle"}
                        placeholder={"Select Circle"}
                        options={CircleListDrop || []}
                      />
                    </Col>
                    <Col key="vendor_asset_code" xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        name={"vendor_asset_code"}
                        label={"Vendor Asset Code"}
                        placeholder={"Vendor Asset Code"}
                      />
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

      <CommonTable
        columns={columns}
        uri={"asset-list"}
        details={details}
        loading={loading}
        scroll={{ x: 1500, y: 400 }}
        totalName="Total"
        subtotalName={"Register Unit"}
        subtotalCount={totalUnit || 0}
      ></CommonTable>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        title="QR Code"
        width={200}
      >
        {qrCodeUrl ? (
          <Image src={qrCodeUrl} alt="QR Code" />
        ) : (
          <p>No QR Code available</p>
        )}
      </Modal>
    </div>
  );
};

export default AssetsList;
