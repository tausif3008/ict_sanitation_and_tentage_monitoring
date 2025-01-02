import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Button, message, Collapse, notification, Row, Col, Form } from "antd";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import search from "../../assets/Dashboard/icon-search.png";
import { getPdfExcelData } from "../asset/AssetsSlice";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import CustomInput from "../../commonComponents/CustomInput";
import { getValueLabel } from "../../constant/const";

const VendorList = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

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
  const values = form.getFieldValue("user_type_id"); // Get all form values
  const fileName = getValueLabel(values, [], "Vendor List");
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

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.vendors.path + "&";
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
      setDetails(() => {
        return {
          list: data.users,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentPage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getDetails();
  }, [params, searchQuery]);

  const columns = [
    {
      title: "Sr. No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },

    {
      title: "Mobile No.",
      dataIndex: "phone",
      key: "phone",
      width: 110,
    },
    // {
    //   title: "Company",
    //   dataIndex: "company",
    //   key: "company",
    //   width: 200,
    // },
    // {
    //   title: "Pin",
    //   dataIndex: "pin",
    //   key: "pin",
    // },
    // {
    //   title: "Country",
    //   dataIndex: "country_name",
    //   key: "country_name",
    //   width: 100,
    // },
    {
      title: "State",
      dataIndex: "state_name",
      key: "state_name",
      width: 120,
    },
    {
      title: "City",
      dataIndex: "city_name",
      key: "city_name",
      width: 120,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "Vendor Code",
      dataIndex: "code",
      key: "code",
      width: 160,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 160,
      render: (text, record) => (
        <>
          <div className="flex gap-2 justify-between">
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              onClick={() => {
                navigate(`/vendor-registration`, {
                  state: {
                    key: "UpdateKey",
                    record: record, // Pass the record as part of the state
                  },
                });
              }}
            >
              <EditOutlined />
            </Button>
            <Link to={"/vendor/add-vendor-details/" + record?.user_id}>
              <Button
                className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
                key={record?.id}
              >
                <PlusOutlined></PlusOutlined> Details
              </Button>
            </Link>
          </div>
        </>
      ),
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   fixed: "right",
    //   width: 170,
    // },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Name",
    "Email",
    "Mobile No",
    "Vendor Code",
    "Address",
    "City",
    "State",
  ];

  const columnPercentages = [
    4,
    15,
    15,
    10,
    13,
    25,
    9,
    9, // 0   // Country (0%) – if unused, no space is allocated for this column
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
            Name: data?.name,
            Email: data?.email,
            Phone: Number(data?.phone),
            "Vendor Code": Number(data?.code),
            Address: data?.address,
            City: data?.city_name,
            State: data?.state_name,
          };
        });

      const pdfData =
        !isExcel &&
        res?.data?.users?.map((data, index) => [
          index + 1,
          data?.name,
          data?.email,
          data?.phone,
          data?.code,
          data?.address,
          data?.city_name,
          data?.state_name,
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
          true,
          false,
          columnPercentages
        );
    } catch (error) {
      message.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="">
      <>
        <CommonDivider
          label={"Vendor List"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() => {
                navigate("/vendor-registration", {
                  state: {
                    key: "AddKey",
                  },
                });
              }}
            >
              Add Vendor
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
                      <Col key="created_by" xs={24} sm={12} md={6} lg={5}>
                        <CustomInput
                          name="name"
                          label="Name"
                          placeholder="Name"
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
          uri={"vendor"}
          details={details}
          loading={loading}
        ></CommonTable>
      </>
    </div>
  );
};

export default VendorList;
