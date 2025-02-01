import React, { useEffect, useMemo, useState } from "react";
import { Button, Collapse, Form, Input, message, Modal } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import {
  deleteSupervisorSectorAllocation,
  getSectorsList,
} from "./Slice/vendorSectorSlice";
import { getUserTypeList } from "../../permission/UserTypePermission/userTypeSlice";
import { getValueLabel } from "../../constant/const";
import UserTypeSelector from "../../permission/UserTypePermission/userTypeSelector";
import CustomSelect from "../../commonComponents/CustomSelect";
import search from "../../assets/Dashboard/icon-search.png";
import VendorSectorSelectors from "./Slice/vendorSectorSelectors";
import CustomInput from "../../commonComponents/CustomInput";
import CustomTable from "../../commonComponents/CustomTable";
import VendorSelectors from "../../Reports/VendorwiseReports/vendorSelectors";
import { getAllocateSectorsData } from "../../Reports/VendorwiseReports/vendorslice";

// sector allocation
const VendorSectorAllocation = () => {
  const [viewDeleteModal, setViewDeleteModal] = useState(false); // view delete model
  const [userType, setUserType] = useState([]);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const [form] = Form.useForm();
  const [formFilter] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { UserListDrop } = UserTypeSelector(); // user type list
  const { AllocateSectorData, VendorReport_Loading } = VendorSelectors(); // allocate sector data
  const { SectorListDrop } = VendorSectorSelectors(); // sector
  const userTypeArray = ["13", "9", "14"]; // vendor supervisor, smo, naib tahsildar
  // const userTypeArray = ["8", "9", "14"]; // vendor, smo, naib tahsildar

  const filteredUserType = useMemo(() => {
    return (
      UserListDrop?.filter((data) => {
        return userTypeArray.includes(String(data?.value));
      }) || []
    );
  }, [UserListDrop]);

  useEffect(() => {
    if (JSON.stringify(filteredUserType) !== JSON.stringify(userType)) {
      setUserType(filteredUserType);
    }
  }, [filteredUserType, userType]);

  const handleCancel = () => {
    setViewDeleteModal(false);
  };

  // handle delete
  const handleDelete = (data) => {
    form.setFieldsValue({
      user_id: data?.user_id,
      sector_id: data?.sector_id,
      supervisor_name: data?.supervisor_name,
      sector_name: data?.sector_name,
    });
    setViewDeleteModal(true);
  };

  // handle delete API
  const onDeleteFinish = async (value) => {
    const url =
      URLS?.deleteAllocate_Sector?.path +
      `/${value?.user_id}/${value?.sector_id}`;
    const res = await dispatch(deleteSupervisorSectorAllocation(url));
    if (res) {
      getUsers();
      message.success(
        `${value?.supervisor_name} ${value?.sector_name} Allocation Record deleted Successfully`
      );
    } else {
      message.error("Something went wrong! Please try again.");
    }
    setViewDeleteModal(false);
  };

  // fiter finish
  const onFinishForm = (values) => {
    if (!values.phone && !values.sector_id && !values.user_type_id) {
      message.success("Please select all required fields");
      return;
    }
    getUsers();
  };

  // reset form
  const resetForm = () => {
    formFilter.resetFields();
    getUsers();
  };

  const getUsers = async (dataObj = {}) => {
    const newParam = {
      page: dataObj?.page || "1",
      per_page: dataObj?.size || "25",
      ...formFilter.getFieldsValue(),
    };
    dispatch(getAllocateSectorsData(newParam));
  };

  useEffect(() => {
    if (AllocateSectorData?.success) {
      setDetails(() => {
        return {
          list: AllocateSectorData?.data?.listings,
          pageLength: AllocateSectorData?.data?.paging[0].length,
          currentPage: AllocateSectorData?.data?.paging[0].currentPage,
          totalRecords: AllocateSectorData?.data?.paging[0].totalrecords,
        };
      });
    } else {
      setDetails({
        list: [],
        pageLength: 25,
        currentPage: 1,
      });
    }
  }, [AllocateSectorData]);

  useEffect(() => {
    getUsers();
    const uri = URLS?.allUserType?.path;
    dispatch(getUserTypeList(uri)); //  user type
    dispatch(getSectorsList()); // all sectors list
  }, []);

  const columns = [
    {
      title: "Sr.No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: "Supervisor Name",
      dataIndex: "supervisor_name",
      key: "supervisor_name",
    },
    {
      title: "User Type",
      dataIndex: "user_type_id",
      key: "user_type_id",
      render: (text) => {
        return text ? getValueLabel(text, UserListDrop) : "User Type";
      },
    },
    // {
    //   title: "Email",
    //   dataIndex: "user_email",
    //   key: "user_email",
    // },
    {
      title: "Mobile No.",
      dataIndex: "user_phone",
      key: "user_phone",
    },
    {
      title: "Sector Name",
      dataIndex: "sector_name",
      key: "sector_name",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => {
        return (
          // <Button
          //   className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
          //   onClick={() => {
          //     navigate("/sector-allocation-form", {
          //       state: {
          //         key: "UpdateKey",
          //         record: record, // Pass the record as part of the state
          //       },
          //     });
          //   }}
          // >
          //   <EditOutlined />
          // </Button>
          <Button
            className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
            onClick={() => {
              handleDelete(record);
            }}
          >
            <DeleteOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="">
      <>
        <CommonDivider
          label={"Allotted Sector"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() =>
                navigate("/sector-allocation-form", {
                  state: {
                    key: "AddKey",
                  },
                })
              }
            >
              Add
            </Button>
          }
        ></CommonDivider>
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
                  form={formFilter}
                  layout="vertical"
                  onFinish={onFinishForm}
                  key="form1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                    <CustomSelect
                      name={"user_type_id"}
                      label={"Select User Type"}
                      placeholder="Select User Type"
                      options={userType || []}
                    />
                    <CustomSelect
                      name={"sector_id"}
                      label={"Select Sector"}
                      placeholder={"Select Sector"}
                      options={SectorListDrop || []}
                    />
                    <CustomInput
                      name={"phone"}
                      label={"Mobile No"}
                      placeholder={"Mobile No"}
                      maxLength={10}
                    />
                    <div className="flex justify-start my-4 space-x-2 ml-3">
                      <div>
                        <Button
                          loading={VendorReport_Loading}
                          type="button"
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          Search
                        </Button>
                      </div>
                      <div>
                        <Button
                          loading={VendorReport_Loading}
                          type="button"
                          className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                          onClick={resetForm}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              ),
            },
          ]}
        />
        <CustomTable
          loading={VendorReport_Loading}
          columns={columns || []}
          bordered
          dataSource={details || []}
          scroll={{ x: 100, y: 400 }}
          tableSubheading={{
            "Total Records": details?.totalRecords,
          }}
          onPageChange={(page, size) => {
            const obj = {
              page: page,
              size: size,
            };
            getUsers(obj);
          }}
        />

        <Modal
          title="Delete Supervisor Sector Allocation"
          open={viewDeleteModal}
          onCancel={handleCancel}
          footer={null}
          width={400}
        >
          <Form form={form} layout="vertical" onFinish={onDeleteFinish}>
            <p>
              Are you sure you want to delete this Supervisor Sector Allocation
              Record?
            </p>

            {/* Optional: Confirmation Checkbox or other fields */}
            <Form.Item name="supervisor_name">
              <Input
                disabled
                className="w-full"
                placeholder="Supervisor Name"
              />
            </Form.Item>
            <Form.Item name="sector_name">
              <Input disabled className="w-full" placeholder="Sector Name" />
            </Form.Item>
            <Form.Item name="user_id">
              <Input disabled className="w-full" placeholder="User Id" />
            </Form.Item>
            <Form.Item name="sector_id">
              <Input disabled className="w-full" placeholder="Sector Id" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end space-x-2">
                <Button type="primary" danger htmlType="submit">
                  Delete
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </div>
  );
};

export default VendorSectorAllocation;
