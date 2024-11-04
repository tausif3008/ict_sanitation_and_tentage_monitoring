import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, Button, Space } from "antd";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CommonDivider from "../commonComponents/CommonDivider";

const { Title } = Typography;

const SectorWiseReport = () => {
  const [sectors, setSectors] = useState([]);
  const [totalSectors, setTotalSectors] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const response = await axios.post(
          "https://kumbhtsmonitoring.in/php-api/reporting/sector",
          {},
          { headers }
        );

        if (response.data.success) {
          const sectorData = response.data.data.sectors;
          setSectors(sectorData);
          setTotalSectors(sectorData.length);
          const totalQty = sectorData.reduce(
            (acc, sector) => acc + sector.total,
            0
          );
          setTotalQuantity(totalQty);
        } else {
          console.error("Failed to fetch sector data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching sector data:", error);
      }
    };

    fetchSectorData();
  }, []);

  const columns = [
    { title: "Sector Name", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "total", key: "total" },
    { title: "Registered", dataIndex: "registered", key: "registered" },
    { title: "Clean", dataIndex: "clean", key: "clean" },
    { title: "Unclean", dataIndex: "unclean", key: "unclean" },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sectors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sector Report");
    XLSX.writeFile(workbook, "SectorWiseReport.xlsx");
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
    const title = "Sector-Wise Report";
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
      head: [["Sector Name", "Total", "Registered", "Clean", "Unclean"]],
      body: sectors.map((sector) => [
        sector.name,
        sector.total,
        sector.registered,
        sector.clean,
        sector.unclean,
      ]),
      startY: 35, // Start after the header
    });

    // Add footer
    const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerText2 = "Prayagraj Mela Authority";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    // doc.text(footerText1, footerX, footerY);
    doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

    doc.save("SectorWiseReport.pdf");
  };

  return (
    <div style={{ padding: "24px" }}>
      <CommonDivider label={"Sector-Wise Report"} />
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
        dataSource={sectors}
        rowKey="sector_id"
        pagination={{ pageSize: 10 }}
        bordered
        footer={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <strong>Total Sectors: {totalSectors}</strong> |{" "}
              <strong>Total Quantity: {totalQuantity}</strong>
            </span>
            <span></span> {/* Empty span to maintain structure */}
          </div>
        )}
      />
    </div>
  );
};

export default SectorWiseReport;
