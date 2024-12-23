import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EditOutlined } from "@ant-design/icons";
import { Button, message, Collapse, notification, Row, Col, Form } from "antd";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { setUpdateUserEl } from "./userSlice";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { getPdfExcelData } from "../asset/AssetsSlice";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import search from "../../assets/Dashboard/icon-search.png";
import { getUserTypeList } from "../../permission/UserTypePermission/userTypeSlice";
import UserTypeSelector from "../../permission/UserTypePermission/userTypeSelector";
import { getValueLabel } from "../../constant/const";

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [userDetails, setUserDetails] = useState({
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
  const { UserListDrop } = UserTypeSelector(); // user type list

  const values = form.getFieldValue("user_type_id"); // Get all form values
  const fileName = getValueLabel(values, UserListDrop, "All User List");

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
      setUserDetails(() => {
        return {
          list: data?.users,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentPage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, [params, searchQuery]);

  useEffect(() => {
    const uri = URLS?.allUserType?.path;
    dispatch(getUserTypeList(uri)); //  user type
    dispatch(setUpdateUserEl({ updateElement: null }));
  }, []);

  const getVal = (val) => {
    if (val === "undefined" || val === null) {
      return "-";
    } else {
      return val;
    }
  };

  const columns = [
    {
      title: "Sr. No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone (Username)",
      dataIndex: "phone",
      key: "Phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Country",
      dataIndex: "country_name",
      key: "country_name",
      render: getVal,
    },
    {
      title: "State",
      dataIndex: "state_name",
      key: "state_name",
      render: getVal,
    },
    {
      title: "City",
      dataIndex: "city_name",
      key: "city_type",
      render: getVal,
    },

    {
      title: "Address",
      dataIndex: "address",
      width: 300,
      key: "address",
      render: (val) => {
        if (val === "undefined") {
          return "-";
        } else {
          return val;
        }
      },
    },
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
                navigate(`/user-registration`, {
                  state: {
                    key: "UpdateKey",
                    record: record, // Pass the record as part of the state
                  },
                });
              }}
            >
              <EditOutlined />
            </Button>
          </div>
        </>
      ),
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   fixed: "right",
    //   width: 80,
    // },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "User Type",
    "Name",
    "Phone",
    "Email",
    "Address",
    "City",
    "State",
    // "Country",
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
            "User Type": data?.user_type || "",
            Name: data?.name || "",
            Phone: Number(data?.phone) || "",
            Email: data?.email || "",
            Address: data?.address || "",
            City: data?.city_name || "",
            State: data?.state_name || "",
            Country: data?.country_name || "",
          };
        });

      const pdfData =
        !isExcel &&
        res?.data?.users?.map((data, index) => [
          index + 1,
          data?.user_type || "",
          data?.name || "",
          data?.phone || "",
          data?.email || "",
          data?.address || "",
          data?.city_name || "",
          data?.state_name || "",
          // data?.country_name,
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
      <CommonDivider
        label={"User List"}
        compo={
          <Button
            onClick={() => navigate("/user-registration")}
            className="bg-orange-300 mb-1"
          >
            Add User
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
                    <Col key="user_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"user_type_id"}
                        label={"Select User Type"}
                        placeholder={"Select User Type"}
                        options={UserListDrop || []}
                      />
                    </Col>
                    <Col key="name" xs={24} sm={12} md={6} lg={5}>
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
      <div className="h-3"></div>
      <CommonTable
        loading={loading}
        uri={"users"}
        columns={columns}
        details={userDetails}
        setUserDetails={setUserDetails}
      ></CommonTable>
    </div>
  );
};

export default UserList;
