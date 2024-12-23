import React, { useState } from "react";
import { Form, Select, Input, Button, Divider } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const AssigningMonitoringManPower = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    // Save assignment data to local storage
    const localAssignments =
      JSON.parse(localStorage.getItem("assignments")) || [];
    localAssignments.push(JSON.parse(JSON.stringify(values)));
    localStorage.setItem("assignments", JSON.stringify(localAssignments));
  };

  // Example list of users
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  // Example list of assets
  const assets = [
    { id: 1, name: "Asset 1" },
    { id: 2, name: "Asset 2" },
    { id: 3, name: "Asset 3" },
  ];

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mt-3 w-full">
      <div className="text-d9 text-2xl flex items-end justify-between">
        <div className="font-bold">Assignment Form</div>
        <div className="text-xs">All * marked fields are mandatory</div>
      </div>
      <Divider className="bg-d9 h-2/3 mt-1"></Divider>
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          Loading...
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: "option1", department: "sanitation" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <Form.Item
              label={<div className="font-semibold">User Name</div>}
              name="userName"
              rules={[{ required: true, message: "Please select a user" }]}
              className="mb-4"
            >
              <Select
                placeholder="Select User"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                className="rounded-none"
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.name}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Role</div>}
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
              className="mb-4"
            >
              <Select placeholder="Select Role" className="rounded-none">
                <Option value="option1">Admin</Option>
                <Option value="option1">Monitoring Agent</Option>
                <Option value="option1">Driver</Option>
                <Option value="option1">Supervisor</Option>
                <Option value="option1">Vendor</Option>
                <Option value="option2">MIS Officer</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Department</div>}
              name="department"
              rules={[
                { required: true, message: "Please select a department" },
              ]}
              className="mb-4"
            >
              <Select placeholder="Select Department" className="rounded-none">
                <Option value="sanitation">Sanitation</Option>
                <Option value="tentage">Tentage</Option>
                <Option value="mis">MIS</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Sub Department</div>}
              name="subDepartment"
              rules={[
                { required: true, message: "Please select a sub department" },
              ]}
              className="mb-4"
            >
              <Select
                placeholder="Select Sub Department"
                className="rounded-none"
              >
                <Option value="manpowerDeployment">Manpower Deployment</Option>
                <Option value="equipmentManagement">
                  Equipment Management
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Asset Name</div>}
              name="assetName"
              rules={[
                { required: true, message: "Please select an asset name" },
              ]}
              className="mb-4"
            >
              <Select placeholder="Select Asset Name" className="rounded-none">
                {assets.map((asset) => (
                  <Option key={asset.id} value={asset.name}>
                    {asset.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Assignment Details</div>}
              name="assignmentDetails"
              className="mb-4"
            >
              <TextArea rows={3} placeholder="Enter Assignment Details" />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}
    </div>
  );
};

export default AssigningMonitoringManPower;
