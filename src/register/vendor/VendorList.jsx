import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Button, message, Collapse, notification, Row, Col, Form } from "antd";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { setUpdateVendorEl, setVendorListIsUpdated } from "./vendorSlice";
import { Link } from "react-router-dom";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import search from "../../assets/Dashboard/icon-search.png";
import { getPdfExcelData } from "../asset/AssetsSlice";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getValueLabel } from "../../constant/const";

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
    width: 170,
  },
];

const VendorList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const isUpdatedSelector = useSelector(
    (state) => state.vendorUpdateEl?.isUpdated
  );

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
      setLoading(false);

      const list = data.users.map((el, index) => {
        return {
          ...el,

          sr: index + 1,
          action: (
            <div className="flex gap-2">
              <Button
                className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
                key={el.name + index}
                onClick={() => {
                  dispatch(setUpdateVendorEl({ updateElement: el }));
                  navigate("/vendor-registration");
                }}
              >
                <EditOutlined></EditOutlined>
              </Button>

              <Link to={"/vendor/add-vendor-details/" + el.user_id}>
                <Button
                  className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
                  key={el.name + index}
                >
                  <PlusOutlined></PlusOutlined> Details
                </Button>
              </Link>
            </div>
          ),
        };
      });

      setDetails(() => {
        return {
          list,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentPage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    }
  };

  useEffect(() => {
    getDetails();
    if (isUpdatedSelector) {
      dispatch(setVendorListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector, searchQuery]);

  useEffect(() => {
    dispatch(setUpdateVendorEl({ updateElement: null }));
  }, []);

  const values = form.getFieldValue("user_type_id"); // Get all form values
  const fileName = getValueLabel(values, [], "Vendor List");


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
          label={"Vendor List"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() => {
                navigate("/vendor-registration");
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

        {/* <CommonSearchForm
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          fields={[
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Phone" },
            // { name: "index_no", label: "Index No." },
          ]}
        ></CommonSearchForm> */}
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
                          type="number"
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
          uri={"vendor"}
          details={details}
          loading={loading}
        ></CommonTable>
      </>
    </div>
  );
};

export default VendorList;
