
import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button, Divider, message } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const ManPowerAssignmentForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]); 
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("https://kumbhtsmonitoring.in/php-api/user-types?page=2&per_page=5", {
          method: "GET",
          headers: headers,
        });
        const result = await response.json();

        if (result.success) {
          setRoles(result.data.user_type);
        } else {
          message.error("Failed to load roles.");
        }
      } catch (error) {
        message.error("Error fetching roles.");
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://kumbhtsmonitoring.in/php-api/users?page=2&per_page=5", {
          method: "GET",
          headers: headers,
        });

        const result = await response.json();

        if (result.success) {
          setAllUsers(result.data.users);
          setFilteredUsers(result.data.users);
        } else {
          message.error("Failed to load users.");
        }
      } catch (error) {
        message.error("Error fetching users.");
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (value) => {
    const selectedUsers = allUsers.filter(user => user.user_type === value);
    setFilteredUsers(selectedUsers.length > 0 ? selectedUsers : []); 
    
    form.resetFields(['userName']);
  };

  const onFinish = async (values) => {
    console.log("Form Values:", values);
    
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mt-3 w-full">
      <div className="text-d9 text-2xl flex items-end justify-between">
        <div className="font-bold">Assigning Monitoring Manpower</div>
        <div className="text-xs">All * marked fields are mandatory</div>
      </div>
      <Divider className="bg-d9 h-2/3 mt-1" />
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          Loading...
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          // initialValues={{ role: "option1", department: "sanitation" }}  
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
{/* 
            <Form.Item
              label={<div className="font-semibold">Role</div>}
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
              className="mb-4"
            >
              <Select
                placeholder="Select Role"
                className="rounded-none"
                onChange={handleRoleChange}
              >
                {roles.map(role => (
                  <Option key={role.user_type_id} value={role.user_type}>
                    {role.user_type}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}

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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <Option key={user.user_id} value={user.name}>
                      {user.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No data available</Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Department</div>}
              name="department"
              rules={[{ required: true, message: "Please select a department" }]}
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
              rules={[{ required: true, message: "Please select a sub department" }]}
              className="mb-4"
            >
              <Select placeholder="Select Sub Department" className="rounded-none">
                <Option value="manpowerDeployment">Manpower Deployment</Option>
                <Option value="equipmentManagement">
                  Equipment Management
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Reporting Officer</div>}
              name="reportingOfficer"
              rules={[{ required: true, message: "Please select a reporting officer" }]}
              className="mb-4"
            >
              <Select placeholder="Select Reporting Officer" className="rounded-none">
                <Option value="admin">Admin</Option>
                <Option value="supervisor">Supervisor</Option>
              </Select>
            </Form.Item>
           
            <Form.Item
              label={<div className="font-semibold">Sector</div>}
              name="sector"
              rules={[{ required: true, message: "Please select sector" }]}
              className="mb-4"
            >
              <Select placeholder="Select Sector" className="rounded-none">
                <Option value="sector1">Sector1</Option>
                <Option value="sector2">Sector2</Option>
                <Option value="sector3">Sector3</Option>
                <Option value="sector4">Sector4</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Time Slot</div>}
              name="timeSlot"
              rules={[{ required: true, message: "Please select time slot" }]}
              className="mb-4"
            >
              <Select placeholder="Select Time Slot" className="rounded-none">
                <Option value="morning">Morning</Option>
                <Option value="afternoon">Afternoon</Option>
                <Option value="evening">Evening</Option>
                <Option value="night">Night</Option>
              </Select>
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

