import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
// import { Button } from "antd";
import {
  Collapse,
  Form,
  Input,
  Button,
  Select,
  notification,
  Row,
  Col,
  message,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import CommonTable from "../../commonComponents/CommonTable";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { getVendorList } from "./Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "./Slice/VendorSupervisorSelector";
import { getValueLabel } from "../../constant/const";
import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import search from "../../assets/Dashboard/icon-search.png";
import { getPdfExcelData } from "../../register/asset/AssetsSlice";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";

const VendorSupervisorRegistration = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification({ top: 100 });
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Note",
      duration: 7,
      description: "Please enter some information to perform the search.",
    });
  };

  const { VendorListDrop } = VendorSupervisorSelector();

  // fiter finish
  const onFinishForm = async (values) => {
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

  const getUsers = async () => {
    setLoading(true);

    let uri = URLS.users.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    }

    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    if (searchQuery) {
      uri = uri + searchQuery;
    }

    const extraHeaders = { "x-api-version": URLS.users.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      const list = data.users.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
        };
      });

      setDetails(() => {
        return {
          list: list,
          pageLength: res?.data?.paging[0].length,
          currentPage: res?.data?.paging[0].currentPage,
          totalRecords: res?.data?.paging[0].totalrecords,
        };
      });
    }
  };

  useEffect(() => {
    getUsers(); // users
  }, [params, searchQuery]);

  useEffect(() => {
    dispatch(getVendorList()); // vendor list
  }, []);

  const columns = [
    {
      title: "Sr.No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_id",
      key: "vendor_id",
      render: (text, record) => {
        return text ? getValueLabel(text, VendorListDrop, "NA") : "";
      },
    },
    {
      title: "Supervisor Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile No.",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => {
        return (
          <Button
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/vendor-supervisor-form", {
                state: {
                  key: "UpdateKey",
                  record: record, // Pass the record as part of the state
                },
              });
            }}
          >
            <EditOutlined />
          </Button>
        );
      },
    },
  ];

  const values = form.getFieldValue("user_type_id"); // Get all form values
  const fileName = getValueLabel(values, [], "Vendor Supervisor List");

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Vendor Name",
    "Supervisor Name",
    "Email",
    "Phone",
  ];

  // excel && pdf file
  const exportToFile = async (isExcel) => {
    try {
      const url = URLS.users.path + "?page=1&per_page=5000";

      const res = await dispatch(
        getPdfExcelData(`${url}${searchQuery ? searchQuery : ""}`)
      );

      if (!res?.data?.users) {
        throw new Error("No users found in the response data.");
      }

      // Map data for Excel
      const myexcelData =
        isExcel &&
        res?.data?.users?.map((data, index) => {
          return {
            Sr: index + 1,
            "Vendor Name": data?.vendor_name || "",
            "Supervisor Name": data?.name,
            Email: data?.email,
            Phone: Number(data?.phone),
          };
        });

      const pdfData =
        !isExcel &&
        res?.data?.users?.map((data, index) => [
          index + 1,
          data?.vendor_name,
          data?.name,
          data?.email,
          data?.phone,
        ]);

      // Call the export function
      isExcel && exportToExcel(myexcelData, `${fileName}`);

      // Call the export function
      !isExcel &&
        ExportPdfFunction(
          `${fileName}`,
          `${fileName}`,
          pdfHeader,
          pdfData,
          true
        );
    } catch (error) {
      message.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="">
      <>
        <CommonDivider
          label={"Vendor Supervisor List"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() =>
                navigate("/vendor-supervisor-form", {
                  state: {
                    key: "AddKey",
                  },
                })
              }
            >
              Add Supervisor
            </Button>
          }
        ></CommonDivider>
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
                    <Row gutter={[16, 16]} align="middle">
                      <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                        <CustomSelect
                          name={"vendor_id"}
                          label={"Vendor Name"}
                          placeholder={"Vendor Name"}
                          options={VendorListDrop || []}
                        />
                      </Col>
                      <Col key="created_by" xs={24} sm={12} md={6} lg={5}>
                        <CustomInput
                          name="name"
                          label="Supervisor Name"
                          placeholder="Supervisor Name"
                        />
                      </Col>
                      <Col key="phone" xs={24} sm={12} md={6} lg={5}>
                        <CustomInput
                          name="phone"
                          label="Phone Number"
                          placeholder="Phone Number"
                          maxLength={10}
                          accept={"onlyNumber"}
                          rules={[
                            {
                              required: false,
                              message: "Please enter your mobile number!",
                            },
                            {
                              pattern: /^[0-9]{10}$/,
                              message:
                                "Please enter a valid 10-digit mobile number",
                            },
                          ]}
                        />
                      </Col>
                      <Col key="email" xs={24} sm={12} md={6} lg={5}>
                        <CustomInput
                          name="email"
                          label="Email"
                          placeholder="Email"
                          rules={[
                            {
                              required: false,
                              message: "Please input your email!",
                            },
                            {
                              type: "email",
                              message: "The input is not a valid email!",
                            },
                          ]}
                        />
                      </Col>
                      <div className="flex justify-start my-4 space-x-2 ml-3">
                        <div>
                          <Button
                            loading={loading}
                            type="button"
                            className="w-fit rounded-none text-white bg-orange-400 hover:bg-orange-600"
                            onClick={resetForm}
                          >
                            Reset
                          </Button>
                        </div>
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
          uri={"vendor-supervisor-registration"}
          loading={loading}
          details={details}
          setUserDetails={setDetails}
        ></CommonTable>
      </>
    </div>
  );
};

export default VendorSupervisorRegistration;
