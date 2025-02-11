import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Button,
  message,
  Collapse,
  notification,
  Row,
  Col,
  Form,
  Tooltip,
} from "antd";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
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
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [showSectorDrop, setShowSectorDrop] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [userDetails, setUserDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const hidePasswordField = ["1", "2"];
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const [api, contextHolder] = notification.useNotification({ top: 100 });
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Note",
      duration: 7,
      description: "Please enter some information to perform the search.",
    });
  };
  const { UserListDrop } = UserTypeSelector(); // user type list
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const values = form.getFieldValue("user_type_id"); // Get all form values
  const fileNames = getValueLabel(values, UserListDrop, "All User List");

  const fileName = useMemo(() => {
    if (formValue?.allocate_sector_id) {
      const sectName = getValueLabel(
        formValue?.allocate_sector_id,
        SectorListDrop,
        "-"
      );
      return `${fileNames} - ${sectName}`;
    } else {
      return `${fileNames}`;
    }
  }, [formValue?.allocate_sector_id, fileNames]);

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
    setShowSectorDrop(false);
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
    dispatch(getSectorsList()); // all sectors
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
      title: "Password",
      dataIndex: "password",
      key: "password",
      width: 110,
      render: (text, record) => {
        if (hidePasswordField.includes(record?.user_type_id)) {
          return "**********";
        } else {
          return text;
        }
      },
    },
    {
      title: "Allocate Sector",
      dataIndex: "allocate_sector_id",
      key: "allocate_sector_id",
      render: (text) => {
        return text ? getValueLabel(text, SectorListDrop, null) || "-" : "-";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (text) => {
        return text === "1" ? (
          <div className="flex justify-center items-center">
            <Tooltip title="Active">
              <CheckCircleOutlined className="text-green-500 text-2xl" />
            </Tooltip>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Tooltip title="Inactive">
              <CloseCircleOutlined className="text-red-500 text-2xl" />
            </Tooltip>
          </div>
        );
      },
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
      width: 80,
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
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "User Type",
    "Name",
    "Phone",
    "Email",
    "Allocate Sector",
    "Address",
    "City",
    "State",
    // "Country",
  ];

  const columnPercentages = [
    4, // Sr No (10%)
    13, // User Type (15%)
    14, // Name (20%)
    10, // Phone (15%)
    18, // Email (20%)
    7, // Address (10%)
    18, // Address (10%)
    8, // City (9%)
    8, // State (5%)
    // 0   // Country (0%) – if unused, no space is allocated for this column
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
            "Allocate Sector":
              Number(data?.allocate_sector_id) === 0
                ? "-"
                : `Sector ${data?.allocate_sector_id}` || "",
            City: data?.city_name || "",
            State: data?.state_name || "",
            Country: data?.country_name || "",
          };
        });

      // Call the export function
      isExcel && exportToExcel(myexcelData, `${fileName}`);

      const pdfData =
        !isExcel &&
        res?.data?.users?.map((data, index) => [
          index + 1,
          data?.user_type || "",
          data?.name || "",
          data?.phone || "",
          data?.email || "",
          Number(data?.allocate_sector_id) === 0
            ? "-"
            : `Sector ${data?.allocate_sector_id}` || "",
          data?.address || "",
          data?.city_name || "",
          data?.state_name || "",
          // data?.country_name,
        ]);

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
      <CommonDivider
        label={"User List"}
        compo={
          <Button
            onClick={() =>
              navigate("/user-registration", {
                state: {
                  key: "AddKey",
                },
              })
            }
            className="bg-orange-300 mb-1"
          >
            Add User
          </Button>
        }
      ></CommonDivider>
      <div className="flex justify-end gap-2 font-semibold">
        <Button
          type="primary"
          onClick={() => {
            exportToFile(false);
          }}
        >
          Download Pdf
        </Button>
        <Button
          type="primary"
          onClick={() => {
            exportToFile(true);
          }}
        >
          Download Excel
        </Button>
      </div>
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
                      onChange={(value) => {
                        if (Number(value) == 6) {
                          setShowSectorDrop(true);
                          form.setFieldValue("allocate_sector_id", null);
                        } else {
                          setShowSectorDrop(false);
                          form.setFieldValue("allocate_sector_id", null);
                        }
                      }}
                    />
                  </Col>
                  {showSectorDrop && (
                    <Col key="allocate_sector_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"allocate_sector_id"}
                        label={"Select Sector"}
                        placeholder={"Select Sector"}
                        allowClear={true}
                        options={SectorListDrop || []}
                      />
                    </Col>
                  )}
                  <Col key="name" xs={24} sm={12} md={6} lg={5}>
                    <CustomInput name="name" label="Name" placeholder="Name" />
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
                    <Button
                      loading={loading}
                      type="button"
                      htmlType="submit"
                      className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Search
                    </Button>
                    <Button
                      loading={loading}
                      type="button"
                      className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                  </div>
                </Row>
              </Form>
            ),
          },
        ]}
      />
      {contextHolder}
      <CommonTable
        loading={loading}
        uri={"users"}
        columns={columns}
        details={userDetails}
        scroll={{ x: 1800, y: 400 }}
        setUserDetails={setUserDetails}
      ></CommonTable>
    </div>
  );
};

export default UserList;
