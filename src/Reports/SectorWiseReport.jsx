import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, Button, Space } from "antd";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CommonDivider from "../commonComponents/CommonDivider";
import { IMAGELIST } from "../assets/Images/exportImages";
import moment from "moment/moment";

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
    const ictHeading = "Maha Kumbh 2025  ";
    const pageWidth = doc.internal.pageSize.getWidth();
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
    doc.setFontSize(24);
    doc.setFont("bold");
    doc.text(ictHeading, ictX - 15, 10); // Heading position

    // Image on the Left (Company Logo or similar image)
    const leftImageX = 10; // X position (from the left)
    const leftImageY = 10; // Y position (from the top)
    const leftImageWidth = 30; // Image width (adjust as needed)
    const leftImageHeight = 25; // Image height (adjust as needed)
    doc.addImage(
      `${IMAGELIST?.govt_logo}`,
      "JPEG",
      leftImageX,
      leftImageY,
      leftImageWidth,
      leftImageHeight,
      undefined,
      undefined,
      "FAST" // Adds compression for smaller file size
    );

    // Image on the Right (Another logo or image)
    const rightImageX = pageWidth - 40; // X position (from the right)
    const rightImageY = 10; // Y position (from the top)
    const rightImageWidth = 30; // Image width (adjust as needed)
    const rightImageHeight = 25; // Image height (adjust as needed)
    doc.addImage(
      `${IMAGELIST?.kumbhMela}`,
      "JPEG",
      rightImageX,
      rightImageY,
      rightImageWidth,
      rightImageHeight,
      undefined,
      undefined,
      "FAST" // Adds compression for smaller file size
    );

    // Add subheading centered between the images
    const subHeading = "ICT Sanitation and Tentage Monitoring System";
    const subHeadingX = (pageWidth - doc.getTextWidth(subHeading)) / 2; // Center the subheading
    doc.setFontSize(14);
    doc.setFont("bold");
    doc.text(subHeading, subHeadingX + 30, 25); // Position it below the images (Y position is adjusted)

    // Add report title and date on the same line, below the subheading
    const title = "Sector-Wise Report";
    // const date = new Date();
    const dateString = moment().format("DD-MMM-YYYY HH:MM A");
    // const dateString = date.toLocaleString(); // Format the date and time

    // Calculate positions for the title and date
    const titleX = 54; // Left align title
    const dateX = pageWidth - doc.getTextWidth(dateString) - 34; // 14 units from the right

    // Add title and date below the subheading
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX - 10, 40); // Title position (Y position adjusted to be below the subheading)
    doc.setFont("normal");
    doc.setFontSize(10); // Smaller font size for date
    doc.text(dateString, dateX + 10, 40); // Date position (Y position adjusted to be below the title)

    // Add a horizontal line below the title and date, but only up to the edges of the images
    // const lineStartX = leftImageX + leftImageWidth + 5; // Start after the left image
    // const lineEndX = rightImageX - 5; // End before the right image
    // doc.line(lineStartX, 45, lineEndX, 45); // x1, y1, x2, y2 (Y position adjusted)

    // Table header and content
    doc.autoTable({
      head: [["Sector Name", "Total", "Registered", "Clean", "Unclean"]],
      body: sectors?.map((sector) => [
        sector?.name,
        sector?.total,
        sector?.registered,
        sector?.clean,
        sector?.unclean,
      ]),
      startY: 45, // Start after the horizontal line and other content (Y position adjusted)
    });

    // Add footer
    const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

    // Save the PDF
    doc.save("Sector-Wise-Report.pdf");
  };

  // const exportToPDF = () => {
  //   const doc = new jsPDF();

  //   // Centered ICT heading
  //   const ictHeading = "ICT Sanitation and Tentage Monitoring System";
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
  //   doc.setFontSize(14);
  //   doc.setFont("bold");
  //   doc.text(ictHeading, ictX, 10); // Heading position

  //   // Add report title and date on the same line
  //   const title = "Sector-Wise Report";
  //   const date = new Date();
  //   const dateString = date.toLocaleString(); // Format the date and time

  //   // Calculate positions
  //   const titleX = 14; // Left align title
  //   const dateX = pageWidth - doc.getTextWidth(dateString) - 14; // 14 units from the right

  //   // Add title and date
  //   doc.setFontSize(12);
  //   doc.setFont("bold");
  //   doc.text(title, titleX, 25); // Title position
  //   doc.setFont("normal");
  //   doc.setFontSize(10); // Smaller font size for date
  //   doc.text(dateString, dateX, 25); // Date position

  //   // Add a horizontal line below the header
  //   doc.line(10, 30, 200, 30); // x1, y1, x2, y2

  //   // Table header and content
  //   doc.autoTable({
  //     head: [["Sector Name", "Total", "Registered", "Clean", "Unclean"]],
  //     body: sectors.map((sector) => [
  //       sector.name,
  //       sector.total,
  //       sector.registered,
  //       sector.clean,
  //       sector.unclean,
  //     ]),
  //     startY: 35, // Start after the header
  //   });

  //   // Add footer
  //   const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
  //   const footerText2 = "Prayagraj Mela Authority";
  //   const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
  //   const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

  //   doc.setFontSize(10);
  //   // doc.text(footerText1, footerX, footerY);
  //   doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

  //   doc.save("SectorWiseReport.pdf");
  // };

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
