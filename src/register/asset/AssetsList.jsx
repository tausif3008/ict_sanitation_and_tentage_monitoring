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
  message,
  Input,
} from "antd";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import dayjs from "dayjs";

import CommonTable from "../../commonComponents/CommonTable";
import search from "../../assets/Dashboard/icon-search.png";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { getPdfExcelData } from "./AssetsSlice";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import {
  deleteSupervisorSectorAllocation,
  getSectorsList,
} from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import MonitoringSelector from "../../complaince/monitoringSelector";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import { getAssetMainTypes, getAssetTypes } from "../AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../AssetType/assetTypeSelectors";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import CoordinatesMap from "../../commonComponents/map/map";
import ShowCode from "./showCode";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";
import CustomInput from "../../commonComponents/CustomInput";
import { dateWeekOptions, getValueLabel } from "../../constant/const";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { asset_delete_permisssion } from "../../constant/permission";
import ParkingSelector from "../parking/parkingSelector";
import { getParkingData } from "../parking/parkingSlice";

const AssetsList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [searchQuery, setSearchQuery] = useState("&asset_main_type_id=1");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [viewDeleteModal, setViewDeleteModal] = useState(false); // view delete model

  const ImageUrl = localStorage.getItem("ImageUrl") || "";
  const userRoleId = localStorage.getItem("role_id");

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  let categoryId = form.getFieldValue("asset_main_type_id");

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
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { parkingDrop } = ParkingSelector(); // parking

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  // fiter finish
  const onFinishForm = (values) => {
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

  // reset
  const resetForm = () => {
    form.resetFields();
    form.setFieldValue("asset_main_type_id", "1");
    setSearchQuery("&asset_main_type_id=1");
    setShowDateRange(false);
  };

  // handle date
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
      setDetails(() => {
        return {
          list: data.listings,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentpage,
          totalRecords: data.paging[0].totalrecords,
        };
      });

      // const unitCount = data?.listings?.reduce((acc, listing) => {
      //   return acc + (listing?.units?.length || 0);
      // }, 0);
      // setTotalUnit(unitCount);

      // const myexcelData = data?.listings?.map((data, index) => {
      //   return {
      //     sr: index + 1,
      //     Category: data?.asset_main_type_name,
      //     "Toilets & Tentage Type": data?.asset_type_name,
      //     "Vendor Name": data?.vendor_name,
      //     "GSD Name": data?.agent_name,
      //     Sector: data?.sector_name,
      //     Circle: data?.circle_name,
      //     "Vendor Item Code": data?.vendor_asset_code,
      //     Code: Number(data?.code),
      //     Unit: Number(data?.unit),
      //     "Register Date": data?.tagged_at
      //       ? moment(data?.tagged_at).format("DD-MMM-YYYY hh:mm A")
      //       : "",
      //   };
      // });
      // setExcelData(myexcelData);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setViewDeleteModal(false);
  };

  // handle delete
  const handleDelete = (data) => {
    form.setFieldsValue({
      assets_id: data?.assets_id,
      asset_type_name: data?.asset_type_name,
      asset_main_type_name: data?.asset_main_type_name,
    });
    setViewDeleteModal(true);
  };

  // handle delete API
  const onFinish = async (value) => {
    const url = URLS?.deleteAssetList?.path + `/${value?.assets_id}`;
    const res = await dispatch(deleteSupervisorSectorAllocation(url)); // delete api
    if (res) {
      getDetails();
      message.success(
        `${value?.asset_main_type_name} - ${value?.asset_type_name} Record deleted Successfully`
      );
    } else {
      message.error("Something went wrong! Please try again.");
    }
    setViewDeleteModal(false);
  };

  useEffect(() => {
    getDetails();
  }, [params, searchQuery]);

  useEffect(() => {
    form.setFieldValue("asset_main_type_id", "1");
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls)); // monitoring agent list
    dispatch(getVendorList()); // vendor list
    dispatch(getSectorsList()); // all sectors list
    const url = URLS?.parking?.path;
    dispatch(getParkingData(url)); // get parking data
    // dispatch(getAllCircleList()); // all circle list
    handleSelect("1"); // call asset type api
  }, []);

  // disable date
  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
  };

  const columns = [
    // {
    //   title: "Sr.No",
    //   dataIndex: "sr",
    //   key: "sr",
    //   width: 55,
    // },
    {
      title: "Category",
      dataIndex: "asset_main_type_name",
      key: "asset_main_type_name",
      width: 100,
    },
    {
      title: "Type",
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
      title: "GSD Name",
      dataIndex: "agent_name",
      key: "agent_name",
      render: (text) => {
        return text ? text : "GSD";
      },
      width: 140,
    },
    ...(categoryId === "2"
      ? [
          {
            title: "Sanstha Name",
            dataIndex: "sanstha_name_hi",
            key: "sanstha_name_hi",
            render: (text) => text || "",
            width: 140,
          },
        ]
      : [
          {
            title: "Sector Name",
            dataIndex: "sector_name",
            key: "sector_name",
            render: (text) => text || "",
            width: 140,
          },
          {
            title: "Parking Name",
            dataIndex: "parking_name",
            key: "parking_name",
            render: (text) => text || "",
            width: 140,
          },
        ]),
    // {
    //   title: "Circle",
    //   dataIndex: "circle",
    //   key: "circle",
    //   width: 100,
    // },
    {
      title: "Photo",
      width: 100,
      render: (text, record) =>
        record.photo ? (
          <Image
            width={60}
            height={60}
            src={ImageUrl + record?.photo}
            alt="Assets Photo"
          />
        ) : (
          "No Image"
        ),
      key: "photo",
    },
    // {
    //   title: "Vendor Item Code",
    //   dataIndex: "vendor_asset_code",
    //   key: "vendor_asset_code",
    // },
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
      width: 100,
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
      width: 100,
    },
    // {
    //   title: "QR Code",
    //   width: 100,
    //   render: (text, record) => (
    //     <Image
    //       src={ImageUrl + record.qr_code}
    //       width={60}
    //       height={60}
    //       alt={record.qr_code}
    //     ></Image>
    //   ),
    //   key: "qrCode",
    // },
    {
      title: "Register At",
      dataIndex: "tagged_at",
      key: "tagged_at",
      render: (text, record) => {
        return text ? moment(text).format("DD-MMM-YYYY hh:mm A") : "";
      },
      width: 140,
    },
    ...(asset_delete_permisssion?.includes(userRoleId)
      ? [
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            fixed: "right",
            width: 130,
            render: (text, record) => (
              <>
                <div className="flex justify-between">
                  <Button
                    className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
                    onClick={() => {
                      navigate(`/asset-registration-form`, {
                        state: {
                          key: "UpdateKey",
                          record: record, // Pass the record as part of the state
                        },
                      });
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
                    onClick={() => {
                      handleDelete(record);
                    }}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              </>
            ),
          },
        ]
      : []),
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    ...(formValue?.asset_type_id
      ? []
      : categoryId === "2"
      ? ["Tentage Type"]
      : ["Toilets Type"]),
    ...(formValue?.vendor_id ? [] : ["Vendor Name"]),
    "GSD Name",
    ...(formValue?.sector_id ? [] : ["Sector"]),
    ...(formValue?.asset_main_type_id !== "1" ? ["Sanstha"] : []),
    ...(formValue?.asset_main_type_id !== "2" ? ["Parking"] : []),
    "Code",
    "Unit",
    "Register Date",
  ];

  // excel file
  const exportToFile = async (isExcel) => {
    try {
      const url = URLS.assetList.path + "?page=1&per_page=5000";
      const res = await dispatch(
        getPdfExcelData(`${url}${searchQuery ? searchQuery : ""}`)
      );

      if (!res?.data?.listings) {
        throw new Error("No listings found in the response data.");
      }

      // Calculate total units
      const unitCount = res?.data?.listings?.reduce((total, listing) => {
        return total + (listing?.units?.length || 0);
      }, 0);

      // Map data for Excel
      const myexcelData =
        isExcel &&
        res?.data?.listings?.map((data, index) => {
          return {
            Sr: index + 1,
            Category: data?.asset_main_type_name,
            Type: data?.asset_type_name,
            "Vendor Name": data?.vendor_name,
            "GSD Name": data?.agent_name,
            Sector: data?.sector_name,

            ...(formValue?.asset_main_type_id !== "1" && {
              Sanstha: data?.sanstha_name_hi,
            }),
            ...(formValue?.asset_main_type_id !== "2" && {
              Parking: data?.parking_name,
            }),
            Code: Number(data?.code),
            Unit: Number(data?.unit),
            "Register Date": data?.tagged_at
              ? moment(data?.tagged_at).format("DD-MMM-YYYY hh:mm A")
              : "",
          };
        });

      const heading = categoryId === "2" ? "Tentage List" : "Toilets List";

      // Call the export function
      isExcel &&
        exportToExcel(myexcelData, heading, [
          {
            name: "Total Unit",
            value: unitCount,
            colIndex: 10,
          },
        ]);

      const pdfData =
        !isExcel &&
        res?.data?.listings?.map((data, index) => [
          index + 1,
          ...(formValue?.asset_type_id ? [] : [data?.asset_type_name]),
          ...(formValue?.vendor_id ? [] : [data?.vendor_name]),
          data?.agent_name,
          ...(formValue?.sector_id ? [] : [data?.sector_name]),
          ...(formValue?.asset_main_type_id !== "1"
            ? [data?.sanstha_name]
            : []),
          ...(formValue?.asset_main_type_id !== "2"
            ? [data?.parking_name]
            : []),
          Number(data?.code),
          Number(data?.unit),
          data?.tagged_at
            ? moment(data?.tagged_at).format("DD-MMM-YYYY hh:mm A")
            : "",
        ]);

      const pdfTitleData = {
        category: getValueLabel(
          formValue?.asset_main_type_id,
          AssetMainTypeDrop,
          null
        ),
        type: getValueLabel(formValue?.asset_type_id, AssetTypeDrop, null),
        vendor: getValueLabel(formValue?.vendor_id, VendorListDrop, null),
        sector: getValueLabel(formValue?.sector_id, SectorListDrop, null),
      };

      // Call the export function
      !isExcel &&
        ExportPdfFunction(
          ``,
          "Registered Toilets & Tentage List",
          pdfHeader,
          // pdfData,
          // true
          [
            ...pdfData,
            ["", "", "", "", "", "", "", "Total Unit", "", unitCount, ""],
          ],
          true,
          true,
          [],
          [
            {
              label: `Category : ${pdfTitleData?.category || "Combined"}`,
            },
            {
              label: `Type : ${pdfTitleData?.type || "Combined"}`,
            },
            {
              label: `Vendor Name : ${pdfTitleData?.vendor || "Combined"}`,
            },
            {
              label: `Sector : ${pdfTitleData?.sector || "Combined"}`,
            },
          ]
        );
    } catch (error) {
      message.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="">
      <CommonDivider label={"Toilets & Tentage List"}></CommonDivider>
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
                  <Row gutter={[16, 0]} align="middle">
                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_main_type_id"}
                        label={"Select Category"}
                        allowClear={false}
                        placeholder={"Select Category"}
                        onSelect={handleSelect}
                        options={AssetMainTypeDrop.slice(0, 2) || []}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Type"}
                        placeholder={"Select Type"}
                        options={AssetTypeDrop || []}
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
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
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
                    <Col key="parking_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"parking_id"}
                        label={"Select Parking"}
                        placeholder={"Select Parking"}
                        options={parkingDrop || []}
                      />
                    </Col>
                    <Col key="code" xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        name={"code"}
                        label={"Code"}
                        placeholder={"Code"}
                      />
                    </Col>
                    <Col key="date_format" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"date_format"}
                        label={"Select Date Type"}
                        placeholder={"Select Date Type"}
                        onSelect={handleDateSelect}
                        options={dateWeekOptions || []}
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
        columns={columns}
        uri={"asset-list"}
        details={details}
        loading={loading}
        scroll={{ x: 1500, y: 400 }}
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

      <Modal
        title={
          <div>
            <h5>Delete Toilets & Tentage Type</h5>
          </div>
        }
        open={viewDeleteModal}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <p>
            Are you sure you want to delete this Toilets & Tentage Type Record?
          </p>

          {/* Optional: Confirmation Checkbox or other fields */}
          <Form.Item name="asset_main_type_name">
            <Input disabled className="w-full" placeholder="Supervisor Name" />
          </Form.Item>
          <Form.Item name="asset_type_name">
            <Input disabled className="w-full" placeholder="Sector Name" />
          </Form.Item>
          <Form.Item name="assets_id">
            <Input disabled className="w-full" placeholder="Id" />
          </Form.Item>
          <p>
            <strong className="text-red-500 font-bold">
              Please note: The data in this field cannot be recovered.
            </strong>
          </p>
          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button type="primary" danger htmlType="submit">
                Delete
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetsList;
