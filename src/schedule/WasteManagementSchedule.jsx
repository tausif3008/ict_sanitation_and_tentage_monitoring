import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  TimePicker,
  InputNumber,
  Divider,
} from "antd";
import moment from "moment";
import CommonDivider from "../commonComponents/CommonDivider";

const { Option } = Select;

const WasteManagementSchedule = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Handle form submission logic here
  };

  return (
    <div className="flex justify-center items-center h-full w-full mt-3">
      <div className="w-full bg-white p-6 -mb-3 shadow-md rounded-md">
        <div className="text-d9 text-2xl flex items-end justify-between">
          <div className="font-bold">Scheduling and Deployment</div>
          <div className="text-xs">All * marked fields are mandatory</div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>{" "}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2">
            <Form.Item
              name="driver"
              label="Select Driver"
              rules={[{ required: true, message: "Please select a driver" }]}
            >
              <Select placeholder="Select Driver">
                <Option value="driver1">Driver 1</Option>
                <Option value="driver2">Driver 2</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>

            <Form.Item
              name="cleaner"
              label="Select Cleaner"
              rules={[{ required: true, message: "Please select a cleaner" }]}
            >
              <Select placeholder="Select Assistant Driver">
                <Option value="cleaner1">Assistant 1</Option>
                <Option value="cleaner2">Assistant 2</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>

            <Form.Item
              name="vehicleNo"
              label="Vehicle No"
              rules={[
                { required: true, message: "Please enter vehicle number" },
              ]}
            >
              <Input placeholder="Enter Vehicle No." />
            </Form.Item>

            <Form.Item
              name="route"
              label="Select Route"
              rules={[{ required: true, message: "Please select a route" }]}
            >
              <Select placeholder="Select Route">
                <Option value="route1">Route 1</Option>
                <Option value="route2">Route 2</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>

            <Form.Item
              name="vehicleType"
              label="Vehicle Type"
              rules={[{ required: true, message: "Please enter vehicle type" }]}
            >
              <Input placeholder="Enter Vehicle Type" />
            </Form.Item>

            <Form.Item
              name="vendorName"
              label="Vendor Name"
              rules={[{ required: true, message: "Please enter vendor name" }]}
            >
              <Input placeholder="Enter Vendor Name" />
            </Form.Item>

            <Form.Item
              name="timesPerDay"
              label="How many times a Day"
              rules={[{ required: true, message: "Please enter a number" }]}
            >
              <InputNumber
                min={1}
                max={4}
                className="w-full"
                placeholder="Enter number of times per day"
              />
            </Form.Item>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">How Many Times</th>
                  <th className="py-2 px-4 border-b">Monday</th>
                  <th className="py-2 px-4 border-b">Tuesday</th>
                  <th className="py-2 px-4 border-b">Wednesday</th>
                  <th className="py-2 px-4 border-b">Thursday</th>
                  <th className="py-2 px-4 border-b">Friday</th>
                  <th className="py-2 px-4 border-b">Saturday</th>
                  <th className="py-2 px-4 border-b">Sunday</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((time) => (
                  <tr key={time}>
                    <td className="py-2 px-4 border-b text-center">{time}</td>
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <td key={day} className="py-2 px-4 border-b text-center">
                        <Form.Item name={`${day}_${time}`} noStyle>
                          <TimePicker
                            format="HH:mm"
                            placeholder="--:--"
                            defaultOpenValue={moment("00:00", "HH:mm")}
                            className="w-full"
                          />
                        </Form.Item>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default WasteManagementSchedule;
