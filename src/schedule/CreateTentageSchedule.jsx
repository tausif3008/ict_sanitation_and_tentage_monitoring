import React from "react";
import { Form, Select, Button, Row, Col, TimePicker, Divider } from "antd";

const { Option } = Select;

const CreateTentageSchedule = () => {
  const onFinish = (values) => {
    // Handle form submission logic here
  };

  return (
    <div className="flex justify-center items-center h-full w-full mt-3">
      <div className="w-full bg-white p-6 shadow-md rounded-md">
        <div className="text-d9 text-2xl flex items-end justify-between">
          <div className="font-bold">Tentage Schedule</div>
          <div className="text-xs">All * marked fields are mandatory</div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <Form.Item
              name="monitoringAgent"
              label="Select Monitoring Agent"
              rules={[
                {
                  required: true,
                  message: "Please select a monitoring agent",
                },
              ]}
            >
              <Select placeholder="Select Monitoring Agent">
                <Option value="agent1">Agent 1</Option>
                <Option value="agent2">Agent 2</Option>
                {/* Add more monitoring agents as needed */}
              </Select>
            </Form.Item>

            <Form.Item
              name="cleaner"
              label="Select Cleaner"
              rules={[{ required: true, message: "Please select a cleaner" }]}
            >
              <Select placeholder="Select Cleaner">
                <Option value="cleaner1">Cleaner 1</Option>
                <Option value="cleaner2">Cleaner 2</Option>
                {/* Add more cleaners as needed */}
              </Select>
            </Form.Item>

            <Form.Item
              name="timesPerDay"
              label="How many times a Day"
              rules={[
                {
                  required: true,
                  message: "Please select the number of times",
                },
              ]}
            >
              <Select placeholder="Select Frequency">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Schedule Times</h3>
            {[...Array(5)].map((_, index) => (
              <Row gutter={16} key={index}>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <Col span={3} key={`${day}-${index}`}>
                    <Form.Item
                      label={index === 0 ? day : ""}
                      name={`${day.toLowerCase()}_${index}`}
                    >
                      <TimePicker.RangePicker
                        format="HH:mm"
                        minuteStep={15}
                        placeholder={["Start", "End"]}
                      />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            ))}
          </div>

          <Form.Item className="mt-4">
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateTentageSchedule;
