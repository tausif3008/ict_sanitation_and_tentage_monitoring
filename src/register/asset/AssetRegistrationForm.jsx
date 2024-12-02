import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Divider, message, Modal } from "antd";
import optionsMaker from "../../urils/OptionMaker";

const { Option } = Select;
const { TextArea } = Input;

const AssetRegistrationForm = () => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [subTypes, setSubTypes] = useState([]);
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [vendors, setVendors] = useState([]); // State for vendors

  useEffect(() => {
    optionsMaker("vendors", "users", "name", setVendors, "", "user_id");
  }, []);

  const onAssetTypeChange = (value) => {
    let subTypeOptions = [];
    switch (value) {
      case "sanitizedType":
        subTypeOptions = [
          "Manpower Deployment",
          "Cleaning and Sanitation",
          "Facility Maintenance",
          "Accessibility",
          "Waste Management",
        ];
        break;
      case "tentageType":
        subTypeOptions = ["Tentage Issues", "Furniture Items"];
        break;
      default:
        subTypeOptions = [];
    }
    setSubTypes(subTypeOptions);
    form.setFieldsValue({ assetSubType: undefined });
  };

  const onFinish = async (values) => {
    const vendor = vendors.find((v) => v.name === values.vendor);
    if (vendor) {
      values.vendor_id = vendor.id;
    }

    delete values.assetSubType;

    try {
      const response = await fetch(
        "https://13.201.196.2/php-api/index.php/asset/entry/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setQrCodeData(result);
        setQrCodeModalVisible(true);
        message.success("Asset registered successfully!");
        form.resetFields();
        setPreviewImage(null);
      } else {
        throw new Error("Failed to register asset");
      }
    } catch (error) {
      message.error(
        error.message || "An error occurred while registering the asset."
      );
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mt-3 w-full">
      <div className="text-d9 text-2xl flex items-end justify-between">
        <div className="font-bold">Asset Registration</div>
        <div className="text-xs">All * marked fields are mandatory</div>
      </div>
      <Divider className="bg-d9 h-2/3 mt-1"></Divider>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 mb-3">
          <Form.Item
            label={<div className="font-semibold">Assets Name</div>}
            name="name"
            rules={[{ required: true, message: "Please enter Asset Name" }]}
            className="mb-4"
          >
            <Input placeholder="Enter Asset Name" className="rounded-none" />
          </Form.Item>
          <Form.Item
            label={<div className="font-semibold">Vendor</div>}
            name="vendor"
            rules={[{ required: true, message: "Please select a Vendor" }]}
            className="mb-4"
          >
            <Select placeholder="Select Vendor" className="rounded-none">
              {vendors.map((ven) => (
                <Option key={ven.value} value={ven.value}>
                  {ven.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<div className="font-semibold">Asset Type</div>}
            name="asset_type_id"
            rules={[{ required: true, message: "Please select an Asset Type" }]}
            className="mb-4"
          >
            <Select
              placeholder="Select Asset Type"
              className="rounded-none"
              onChange={onAssetTypeChange}
            >
              <Option value="sanitizedType">Toilets & Sanitation</Option>
              <Option value="tentageType">Tentage & Furniture</Option>
              {/* Add more options as needed */}
            </Select>
          </Form.Item>

          <Form.Item
            label={<div className="font-semibold">Asset Sub Type</div>}
            name="assetSubType"
            rules={[
              { required: true, message: "Please select an Asset Sub Type" },
            ]}
            className="mb-4"
          >
            <Select
              placeholder="Select Asset Sub Type"
              className="rounded-none"
            >
              {subTypes.map((subType, index) => (
                <Option key={index} value={subType}>
                  {subType}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<div className="font-semibold">Description</div>}
            name="description"
            rules={[{ required: true, message: "Please enter a Description" }]}
            className="mb-4"
          >
            <Input rows={1} placeholder="Enter Asset Description" />
          </Form.Item>
          <div className=" w-full flex justify-end items-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                Register
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>

      <Modal
        title="Asset Registered Successfully"
        width={400}
        visible={qrCodeModalVisible}
        onCancel={() => setQrCodeModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrCodeModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {qrCodeData && (
          <div className="text-center">
            <p>
              <strong>Asset Name:</strong> {qrCodeData.asset_name}
            </p>
            <p>
              <strong>Asset Code:</strong> {qrCodeData.asset_code}
            </p>
            <div className="flex w-full justify-center items-center">
              {qrCodeData.qr_image && (
                <img
                  src={`http://filemanagement.metaxpay.in:8001${qrCodeData.qr_image}`}
                  alt="QR Code"
                  style={{ width: "200px", height: "200px" }}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssetRegistrationForm;
