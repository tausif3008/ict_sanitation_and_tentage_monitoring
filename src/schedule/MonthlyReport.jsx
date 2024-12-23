import React from "react";
import { Table, Select, Button, Form, Tooltip, Divider } from "antd";
import { DownloadOutlined, CalendarOutlined } from "@ant-design/icons";

const { Option } = Select;

const columns = [
  {
    title: "Sr No",
    dataIndex: "srNo",
    key: "srNo",
    width: 80,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "User Type",
    dataIndex: "userType",
    key: "userType",
  },
  ...Array.from({ length: 31 }, (_, index) => ({
    title: index + 1,
    dataIndex: `day${index + 1}`,
    key: `day${index + 1}`,
    width: 40,
    align: "center",
    render: (text) => (
      <div className="flex justify-center items-center">
        {/* Example: Red circle for unavailable, green for available */}
        <Tooltip title={text}>
          <div
            className={`w-3 h-3 rounded-full ${
              text === "Available" ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </Tooltip>
      </div>
    ),
  })),
];

const data = [
  {
    key: "1",
    srNo: "1",
    name: "Ananya Reddy",
    userType: "Driver",
    day1: "Available",
    day2: "Unavailable",
    day3: "Available",
    day4: "",
    day5: "",
    // Add similar fields for other days
  },
];

const MonthlyReport = () => {
  const handleDownloadPDF = () => {
    // Add PDF download logic here
  };

  const handleDownloadExcel = () => {
    // Add Excel download logic here
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full mt-3 px-4">
      <div className="w-full bg-white p-6 shadow-md rounded-md">
        <div className="text-d9 text-2xl flex items-end justify-between">
          <div className="font-bold">Monthly Reports</div>
          <div className="text-xs">All * marked fields are mandatory</div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form layout="inline" className="mb-6">
          <Form.Item label="Select Year">
            <Select defaultValue="2024" style={{ width: 120 }}>
              {[2024, 2023, 2022].map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Month">
            <Select defaultValue="July" style={{ width: 120 }}>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <Option key={month} value={month}>
                  {month}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        <div className="flex justify-between mb-4">
          <Button type="default" icon={<CalendarOutlined />} className="mr-2">
            Calendar View
          </Button>
          <div>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              className="mr-2"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }} // Enable horizontal scroll if necessary
        />
      </div>
    </div>
  );
};

export default MonthlyReport;
