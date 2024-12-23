import React, { useState } from "react";
import { Form, Select, Input, Button, Divider } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const ManPowerAssignmentForm = () => {
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

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mt-3 w-full">
      <div className="text-d9 text-2xl flex items-end justify-between">
        <div className="font-bold">Assigning Monitoring Manpower</div>
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
                <Option value="option1">Vendor</Option>
                <Option value="option2">Monitoring Agent</Option>
                <Option value="option2">MIS Officer</Option>
                <Option value="option2">Driver</Option>
                <Option value="option2">Admin</Option>
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
              label={<div className="font-semibold">Reporting Officer</div>}
              name="reportingOfficer"
              rules={[
                {
                  required: true,
                  message: "Please select a reporting officer",
                },
              ]}
              className="mb-4"
            >
              <Select
                placeholder="Select Reporting Officer"
                className="rounded-none"
              >
                <Option value="admin">Admin</Option>
                <Option value="supervisor">Supervisor</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Information To</div>}
              name="informationTo"
              rules={[
                {
                  required: true,
                  message: "Please select an option for Information To",
                },
              ]}
              className="mb-4"
            >
              <Select
                placeholder="Select Information To"
                className="rounded-none"
              >
                <Option value="option1">Option 1</Option>
                <Option value="option2">Option 2</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Assignment Details</div>}
              name="assignmentDetails"
              className="mb-4"
            >
              <Button className="w-full bg-gray-200">
                {" "}
                Scan or Upload QR Code{" "}
              </Button>
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Assignment Details</div>}
              name="assignmentDetails"
              className="mb-4"
            >
              <TextArea rows={1} placeholder="Enter Assignment Details" />
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

export default ManPowerAssignmentForm;
