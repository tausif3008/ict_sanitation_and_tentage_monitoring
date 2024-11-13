import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, Button, Space } from "antd";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CommonDivider from "../commonComponents/CommonDivider";

const { Title } = Typography;

const CircleWiseReport = () => {
  const [circles, setCircles] = useState([]);
  const [totalCircles, setTotalCircles] = useState(0);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalClean, setTotalClean] = useState(0);
  const [totalUnclean, setTotalUnclean] = useState(0);

  console.log("circles", circles);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchCircleData = async () => {
      try {
        const response = await axios.post(
          "https://kumbhtsmonitoring.in/php-api/reporting/circle", // Updated API endpoint
          {},
          { headers }
        );

        if (response.data.success) {
          const circleData = response.data.data.circles;
          setCircles(circleData);
          setTotalCircles(circleData.length);
          const totalReg = circleData.reduce(
            (acc, circle) => acc + circle.registered,
            0
          );
          const totalClean = circleData.reduce(
            (acc, circle) => acc + circle.clean,
            0
          );
          const totalUnclean = circleData.reduce(
            (acc, circle) => acc + circle.unclean,
            0
          );
          setTotalRegistered(totalReg);
          setTotalClean(totalClean);
          setTotalUnclean(totalUnclean);
        } else {
          console.error("Failed to fetch circle data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching circle data:", error);
      }
    };

    fetchCircleData();
  }, []);

  const columns = [
    { title: "Circle Name", dataIndex: "name", key: "name" },
    { title: "Registered", dataIndex: "registered", key: "registered" },
    { title: "Clean", dataIndex: "clean", key: "clean" },
    { title: "Unclean", dataIndex: "unclean", key: "unclean" },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(circles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Circle Report");
    XLSX.writeFile(workbook, "CircleWiseReport.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Centered ICT heading
    const ictHeading = "ICT Sanitation and Tentage Monitoring System";
    const pageWidth = doc.internal.pageSize.getWidth();
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
    doc.setFontSize(14);
    doc.setFont("bold");
    doc.text(ictHeading, ictX, 10); // Heading position

    // Add report title and date on the same line
    const title = "Circle-Wise Report";
    const date = new Date();
    const dateString = date.toLocaleString(); // Format the date and time

    // Calculate positions
    const titleX = 14; // Left align title
    const dateX = pageWidth - doc.getTextWidth(dateString) - 14; // 14 units from the right

    // Add title and date
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX, 25); // Title position
    doc.setFont("normal");
    doc.setFontSize(10); // Smaller font size for date
    doc.text(dateString, dateX, 25); // Date position

    // Add a horizontal line below the header
    doc.line(10, 30, 200, 30); // x1, y1, x2, y2

    // Table header and content
    doc.autoTable({
      head: [["Circle Name", "Registered", "Clean", "Unclean"]],
      body: circles.map((circle) => [
        circle.name,
        circle.registered,
        circle.clean,
        circle.unclean,
      ]),
      startY: 35, // Start after the header
    });

    // Add footer
    const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

    doc.save("CircleWiseReport.pdf");
  };

  return (
    <div style={{ padding: "24px" }}>
      <CommonDivider label={"Circle-Wise Report"} />
      <Space style={{ marginBottom: 16, float: "right" }}>
        <Button type="primary" onClick={exportToExcel}>
          Download Excel
        </Button>
        <Button type="primary" onClick={exportToPDF}>
          Download PDF
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={circles}
        rowKey="circle_id"
        pagination={{ pageSize: 10 }}
        bordered
        footer={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <strong>Total Circles: {totalCircles}</strong> |{" "}
              <strong>Registered: {totalRegistered}</strong> |{" "}
              <strong>Clean: {totalClean}</strong> |{" "}
              <strong>Unclean: {totalUnclean}</strong>
            </span>
            <span></span> {/* Empty span to maintain structure */}
          </div>
        )}
      />
    </div>
  );
};

export default CircleWiseReport;
