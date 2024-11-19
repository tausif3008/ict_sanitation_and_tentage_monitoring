import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import URLS from "../../urils/URLS";

const { Option } = Select;

const ConfigSettingForm = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const onFinish = async (values) => {
    setLoading(true);

    const finalData = {
      ...values,
      setting_id: record?.setting_id,
    };
    setLoading(true);

    const res = await postData(getFormData(finalData), URLS.editSettings.path, {
      version: URLS.editSettings.version,
    });

    if (res) {
      if (res.data.success) {
        form.resetFields();
        navigate("/config-setting");
      }
    }
    setLoading(false);
  };

  const onlineStatus = [
    { label: "Online", value: "1" },
    { label: "Offline", value: "2" },
  ];

  useEffect(() => {
    if (key === "UpdateKey") {
      form.setFieldsValue({
        email: record?.email,
        phone: record?.phone,
        geofencing_meter_value: record?.geofencing_meter_value,
        complaint_contact_number: record?.complaint_contact_number,
        complaint_email_id: record?.complaint_email_id,
        help_line_number: record?.help_line_number,
        allow_offline: record?.allow_offline,
        allow_monitoring_per_day: record?.allow_monitoring_per_day,
      });
    }
  }, [key, record]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              navigate("/config-setting");
            }}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between ">
            <div className="font-bold">
              {key === "UpdateKey"
                ? `Update Configuration Setting`
                : "Configuration Setting"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <Form.Item
              label={<div className="font-semibold">Email</div>}
              name="email"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              className="mb-4"
            >
              <Input placeholder="Enter Email" className="rounded-none" />
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Phone</div>}
              name="phone"
              rules={[
                { required: true, message: "Please enter the phone" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone",
                },
              ]}
              className="mb-4"
            >
              <Input
                type="Number"
                placeholder="Enter phone"
                className="rounded-none"
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="font-semibold">Geofencing value (meter)</div>
              }
              name="geofencing_meter_value"
              rules={[
                {
                  required: true,
                  message: "Please enter Geofencing value",
                },
              ]}
              className="mb-4"
            >
              <Input
                type="Number"
                placeholder="Enter Geofencing value"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              label={
                <div className="font-semibold">Complaint Contact Number</div>
              }
              name="complaint_contact_number"
              rules={[
                {
                  required: true,
                  message: "Please enter the Complaint Contact Number",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message:
                    "Please enter a valid 10-digit Complaint Contact Number",
                },
              ]}
              className="mb-4"
            >
              <Input
                type="Number"
                placeholder="Enter Complaint Conatact number"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Complaint Mail Id</div>}
              name="complaint_email_id"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Enter Complaint Mail Id"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Helpline Number</div>}
              name="help_line_number"
              rules={[
                { required: true, message: "Please enter the Helpline number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit Helpline number",
                },
              ]}
              className="mb-4"
            >
              <Input
                type="Number"
                placeholder="Enter Helpline number"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              label={
                <div className="font-semibold">Allow Monitoring Per Day</div>
              }
              name="allow_monitoring_per_day"
              rules={[
                {
                  required: true,
                  message: "Please enter Allow Monitoring Per Day",
                },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Enter Allow Monitoring Per Day"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Status</div>}
              name="allow_offline"
              rules={[{ required: true, message: "Please enter Status" }]}
              className="mb-4 w-full"
            >
              <Select
                showSearch
                placeholder="Select Status"
                optionFilterProp="children"
              >
                {onlineStatus?.map((option) => (
                  <Option key={option?.value} value={option?.value}>
                    {option?.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {key === "UpdateKey" ? "Update" : "Register"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ConfigSettingForm;
