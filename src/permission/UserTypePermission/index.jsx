import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import UserTypeSelector from "./userTypeSelector";
import {
  getModuleList,
  getUserTypeList,
  getUserTypePermission,
} from "./userTypeSlice";
import URLS from "../../urils/URLS";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import { Collapse, Form, Button, Select, Row, Col, Checkbox } from "antd";
import search from "../../assets/Dashboard/icon-search.png";
import { getValueLabel } from "../../constant/const";
import { EditOutlined } from "@ant-design/icons";

const UserTypePermission = () => {
  const [tableData, setTableData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, UserListDrop, allModulePermission, ModuleListDrop } =
    UserTypeSelector();

  const [form] = Form.useForm();

  // fiter finish
  const onFinishForm = (values) => {
    const data = allModulePermission?.data?.modules;
    const filterData = data?.filter((item) => {
      return Number(item?.user_type_id) === Number(values?.user_type_id);
    });
    setTableData((pre) => ({
      ...pre,
      list: filterData,
    }));
  };

  const resetForm = () => {
    setTableData((pre) => ({
      ...pre,
      list: [],
    }));
    form.resetFields();
  };

  useEffect(() => {
    const uri = URLS?.allUserType?.path;
    const all_param = URLS?.allModulePermission?.path;
    const module_param = URLS?.moduleList?.path;
    dispatch(getUserTypeList(uri)); //  user type
    dispatch(getUserTypePermission(all_param)); // module permission
    dispatch(getModuleList(module_param)); // module list
    return () => {};
  }, []);

  const columns = [
    {
      title: "Sr. No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 60,
    },
    {
      title: "Module",
      dataIndex: "module_id",
      key: "module_id",
      render: (text, record) => {
        return text
          ? getValueLabel(text, ModuleListDrop, "module name") // Pass the numeric value, drop list, and label key
          : ""; // If no text, return an empty string
      },
    },
    {
      title: "Create",
      dataIndex: "create",
      key: "create",
      render: (text, record) => {
        return <Checkbox checked={Number(text) === 1} />;
      },
    },
    {
      title: "Read",
      dataIndex: "read",
      key: "read",
      render: (text, record) => {
        return <Checkbox checked={Number(text) === 1} />;
      },
    },
    {
      title: "Update",
      dataIndex: "update",
      key: "update",
      render: (text, record) => {
        return <Checkbox checked={Number(text) === 1} />;
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (text, record) => {
        return <Checkbox checked={Number(text) === 1} />;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => {
        return (
          <Button
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/user-permission-type-form", {
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

  return (
    <>
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
                          name={"user_type_id"}
                          label={"User Type"}
                          rules={[
                            {
                              required: true,
                              message: "Please select a user type",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select User Type"
                            className="rounded-none"
                          >
                            {UserListDrop?.map((option) => (
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
        </div>
        <CommonDivider label={"User Type Permission"}></CommonDivider>

        <CommonTable
          loading={loading}
          //   uri={`shift`}
          columns={columns || []}
          details={tableData || []}
          scroll={{ x: 300, y: 400 }}
        ></CommonTable>
      </div>{" "}
    </>
  );
};

export default UserTypePermission;
