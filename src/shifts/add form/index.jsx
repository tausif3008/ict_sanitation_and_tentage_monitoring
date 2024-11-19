import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import moment from "moment";
import dayjs from "dayjs";
import { Form, Input, Button, Select, Divider, TimePicker } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";

const AddShiftForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 2, label: "Deactive" },
  ];

  // API
  const onFinish = async (values) => {
    setLoading(true);
    const from_time = dayjs(values?.from_time);
    const to_time = dayjs(values?.to_time);
    const fromTimeFormatted = from_time.format("HH:mm:ss"); // 24-hour format
    const toTimeFormatted = to_time.format("HH:mm:ss"); // 24-hour format

    const finalData = {
      ...values,
      from_time: fromTimeFormatted,
      to_time: toTimeFormatted,
      ...(key === "UpdateKey" && { shift_id: Number(record?.shift_id) }),
    };

    const res = await postData(
      finalData,
      key === "UpdateKey" ? URLS.shiftEdit.path : URLS.shiftAdd.path,
      { version: URLS.shiftEdit.version }
    );
    setLoading(false);
    if (res.data.success) {
      form.resetFields();
      navigate("/shift");
    }
  };

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      form.setFieldsValue({
        shift_id: Number(record?.shift_id),
        name: record?.name,
        status: Number(record?.status) === 2 ? "Deactive" : "Active",
        from_time: moment(record?.from_time, "HH:mm:ss"), // Set as 24-hour format
        to_time: moment(record?.to_time, "HH:mm:ss"),
      });
    }
  }, [record, key]);

  return (
    <>
      <div className="mt-3">
        <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
          <div className="flex gap-2 items-center">
            <Button
              className="bg-gray-200 rounded-full w-9 h-9"
              onClick={() => navigate("/shift")}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between">
              <div className="font-bold">
                {key === "UpdateKey" ? "Update Shift" : "Add Shift"}
              </div>
              <div className="text-xs">All * marked fields are mandatory</div>
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Form.Item
                label="Shift Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Shift Name",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Shift Name"
                  className="rounded-none"
                />
              </Form.Item>
              <Form.Item
                label="Start Time"
                name="from_time"
                rules={[
                  {
                    required: true,
                    message: "Please enter the start time",
                  },
                ]}
              >
                <TimePicker
                  className="rounded-none"
                  format="h:mm A" // Display format for 12-hour with AM/PM
                />
              </Form.Item>
              <Form.Item
                label="End Time"
                name="to_time"
                rules={[
                  {
                    required: true,
                    message: "Please enter the end time",
                  },
                ]}
              >
                <TimePicker
                  className="rounded-none"
                  format="h:mm A" // Display format for 12-hour with AM/PM
                />
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select an option" }]}
              >
                <Select placeholder="Select status" className="rounded-none">
                  {statusOptions?.map((option) => (
                    <Select.Option key={option?.value} value={option?.value}>
                      {option?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Form.Item>
              <div className="flex w-full justify-end">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="w-fit rounded-none bg-5c"
                >
                  {key === "UpdateKey" ? "Update Shift" : "Add Shift"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddShiftForm;
