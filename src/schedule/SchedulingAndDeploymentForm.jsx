import React, { useState } from "react";
import { Form, Select, Input, Button, Divider, Typography, List } from "antd";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const SchedulingAndDeploymentForm = () => {
  const [form] = Form.useForm();
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showAssetsOnMap, setShowAssetsOnMap] = useState(false);

  const onFinish = (values) => {
    // Save scheduling and deployment data to local storage
    const localSchedules =
      JSON.parse(localStorage.getItem("schedulingDeployment")) || [];
    localSchedules.push(JSON.parse(JSON.stringify(values)));
    localStorage.setItem(
      "schedulingDeployment",
      JSON.stringify(localSchedules)
    );
  };

  // Example list of assets
  const assets = [
    { id: 1, name: "Asset 1" },
    { id: 2, name: "Asset 2" },
    { id: 3, name: "Asset 3" },
  ];

  // Example list of zones
  const zones = [
    { id: 1, name: "Zone 1" },
    { id: 2, name: "Zone 2" },
    { id: 3, name: "Zone 3" },
  ];

  // Example list of cleaners
  const cleaners = [
    { id: 1, name: "Driver 1" },
    { id: 2, name: "Driver 2" },
    { id: 3, name: "Driver 3" },
  ];

  // Example list of support drivers
  const drivers = [
    { id: 1, name: "Assistant Driver 1" },
    { id: 2, name: "Assistant Driver 2" },
    { id: 3, name: "Assistant Driver 3" },
  ];

  const handleAssetChange = (value) => {
    setSelectedAssets(value);
    setShowAssetsOnMap(true); // Simulate showing assets on the map
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mt-3 w-full">
      <div className="text-d9 text-2xl flex items-end justify-between">
        <div className="font-bold">Scheduling and Deployment</div>
        <div className="text-xs">All * marked fields are mandatory</div>
      </div>
      <Divider className="bg-d9 h-2/3 mt-1"></Divider>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: "admin", zone: "1" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
          {/* <Form.Item
            label={<div className="font-semibold">Role</div>}
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
            className="mb-4"
          >
            <Select placeholder="Select Role" className="rounded-none">
              <Option value="admin">Admin</Option>
              <Option value="supervisor">Supervisor</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<div className="font-semibold">Name</div>}
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
            className="mb-4"
          >
            <Input placeholder="Please enter name" className="rounded-none" />
          </Form.Item> */}

          <Form.Item
            label={<div className="font-semibold">Select Driver</div>}
            name="cleaner"
            rules={[{ required: true, message: "Please select a cleaner" }]}
            className="mb-4"
          >
            <Select placeholder="Select Cleaner" className="rounded-none">
              {cleaners.map((cleaner) => (
                <Option key={cleaner.id} value={cleaner.id}>
                  {cleaner.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<div className="font-semibold">Select Assistant Driver</div>}
            name="supportDriver"
            rules={[
              { required: true, message: "Please select a support driver" },
            ]}
            className="mb-4"
          >
            <Select
              placeholder="Select Support Driver"
              className="rounded-none"
            >
              {drivers.map((driver) => (
                <Option key={driver.id} value={driver.id}>
                  {driver.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<div className="font-semibold">Select Asset</div>}
            name="asset"
            rules={[{ required: true, message: "Please select an asset" }]}
            className="mb-4"
          >
            <Select
              placeholder="Select Asset"
              mode="multiple"
              onChange={handleAssetChange}
              className="rounded-none"
            >
              {assets.map((asset) => (
                <Option key={asset.id} value={asset.id}>
                  {asset.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<div className="font-semibold">Select Zone</div>}
            name="zone"
            rules={[{ required: true, message: "Please select a zone" }]}
            className="mb-4"
          >
            <Select placeholder="Select Zone" className="rounded-none">
              {zones.map((zone) => (
                <Option key={zone.id} value={zone.id}>
                  {zone.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedAssets.length > 0 && (
            <div className="col-span-3 mb-6">
              <Title level={4}>Selected Assets</Title>
              <List
                bordered
                dataSource={selectedAssets}
                renderItem={(item) => (
                  <List.Item>
                    {assets.find((asset) => asset.id === item)?.name}
                  </List.Item>
                )}
              />
            </div>
          )}

          {showAssetsOnMap && (
            <div className="col-span-3 mb-6">
              <Title level={4}>Assets on GIS Map</Title>
              <div className="bg-gray-100 p-4 border rounded-md">
                <p>Map displaying selected assets...</p>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default SchedulingAndDeploymentForm;
