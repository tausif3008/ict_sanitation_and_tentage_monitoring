import React from "react";
import { jsPDF } from "jspdf";
import moment from "moment";
import "jspdf-autotable";
import { Button, message } from "antd";
import { IMAGELIST } from "../assets/Images/exportImages";

const MonitoringEngPdf = ({
  titleName,
  pdfName,
  headerData,
  rows,
  tableObject = {},
  landscape = false,
}) => {
  const exportToPDF = () => {
    if (rows && rows?.length === 0) {
      message?.error("Data is not available");
      return "";
    }
    const doc = new jsPDF(landscape ? "landscape" : "");

    // Centered ICT heading
    const ictHeading = "Maha Kumbh 2025";
    const pageWidth = doc.internal.pageSize.getWidth();
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
    doc.setFontSize(23); // Increase font size for better prominence
    doc.setFont("helvetica", "bold");
    doc.text(ictHeading, ictX - 12, 15); // Heading position

    // Image on the Left (Company Logo or similar image)
    const leftImageX = 10; // X position (from the left)
    const leftImageY = 7; // Y position (from the top)
    const leftImageWidth = 25; // Image width (adjust as needed)
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
    const rightImageX = pageWidth - 35; // X position (from the right)
    const rightImageY = 7; // Y position (from the top)
    const rightImageWidth = 25; // Image width (adjust as needed)
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
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text(subHeading, subHeadingX + 30, 30); // Position it below the images (Y position is adjusted)

    // Add report title and date on the same line, below the subheading
    const title = `${titleName}`;
    const dateString = moment().format("DD-MMM-YYYY HH:MM A");

    // Calculate positions for the title and date
    const titleX = 54; // Left align title
    const dateX = pageWidth - doc.getTextWidth(dateString) - 34; // 14 units from the right

    // Add title and date below the subheading
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX - 35, 40); // Title position (Y position adjusted to be below the subheading)
    doc.setFont("normal");
    doc.setFontSize(10); // Smaller font size for date
    doc.text(dateString, dateX + 30, 40); // Date position (Y position adjusted to be below the title)

    // Table for dynamic fields (label-value pairs)
    const tableData = [
      ["Category", `: ${tableObject?.asset_main_type_name || ""}`],
      ["Type", `: ${tableObject?.asset_type_name || ""}`],
      ["Vendor Name", `: ${tableObject?.vendor_name || ""}`],
      ["Sector", `: ${tableObject?.sector_name || ""}`],

      // Conditional block for asset_main_type_id === "2"
      ...(tableObject?.asset_main_type_id === "2"
        ? [
            ["Sanstha Name", `: ${tableObject?.sanstha_name_hi || ""}`],
            ["Mela Patri Name", `: ${tableObject?.mela_patri_name || ""}`],
            ["Mela Road Name", `: ${tableObject?.mela_road_name || ""}`],
          ]
        : [["Circle", `: ${tableObject?.circle_name || ""}`]]),

      // Always include these fields
      [
        tableObject?.asset_main_type_id === "2" ? "TAF ID" : "PTC ID",
        `: ${`${tableObject?.code}-${tableObject?.unit_no}`}`,
      ],
      [
        "Submitted Date",
        `: ${
          moment(tableObject?.submitted_date).format("DD-MMM-YYYY hh:mm A") ||
          ""
        }`,
      ],
      ["Remark", `: ${tableObject?.remark || ""}`],
      // Add more fields as needed
    ];

    // Add the first table (dynamic fields)
    doc.autoTable({
      startY: 45, // Start the table after the header
      body: tableData, // Table body
      theme: "plain", // Table style
      styles: {
        fontSize: 12,
        cellPadding: 3,
      },
      margin: { left: 10, right: 20 }, // Set margins
    });

    // const instruction1 = "Instructions :";
    // doc.setFontSize(14);
    // doc.setFont("bold");
    // doc.setFillColor(220, 220, 220); // Set gray background color
    // doc.rect(10, doc.lastAutoTable.finalY + 10, pageWidth - 20, 20, "F"); // Draw gray background
    // doc.text(instruction1, 10, doc.lastAutoTable.finalY + 10);

    const instructionData =
      "You are hereby being put to notice that upon inspection the following observations have been made with respect to the under mentioned work(s). You are directed to take the required remedial actions as may be required, forthwith, within 24 hours, and apprise the Authority of the action taken in the form of an Action Taken Report. In case you fail to abide this notice, the Authority may proceed further as per the terms and conditions of service.";
    doc.setFontSize(12);
    doc.setFont("normal");
    const instructionDataLines = doc.splitTextToSize(
      instructionData,
      pageWidth - 20
    );
    const instructionDataY = 150;
    const backgroundHeight = 35; // Height of the background box (adjust if necessary)
    doc.setFillColor(220, 220, 220); // Set gray color for background
    doc.rect(10, instructionDataY - 7, pageWidth - 20, backgroundHeight, "F");
    doc.text(instructionDataLines, 10, instructionDataY);

    const tableTitle = "Monitoring Report";
    const tableTitleIndex = (pageWidth - doc.getTextWidth(tableTitle)) / 2; // Center the subheading
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text(tableTitle, tableTitleIndex - 20, 195);

    // Table header and content
    doc.autoTable({
      head: [headerData],
      body: rows,
      startY: tableObject?.asset_main_type_id === "2" ? 180 : 200, // Start after the horizontal line and other content (Y position adjusted)
    });

    // const instruction2Data =
    //   "You are hereby being put to notice that upon inspection the following observations have been made with respect to the under mentioned work(s). You are directed to take the required remedial actions as may be required, forthwith, within 24 hours, and apprise the Authority of the action taken in the form of an Action Taken Report. In case you fail to abide this notice, the Authority may proceed further as per the terms and conditions of service.";
    // doc.setFontSize(12);
    // doc.setFont("normal");
    // const instructionData2Lines = doc.splitTextToSize(
    //   instruction2Data,
    //   pageWidth - 20
    // );
    // const instruction2DataY = 250;
    // const backgroundHeight2 = 25; // Height of the background box (adjust if necessary)
    // doc.setFillColor(220, 220, 220); // Set gray color for background
    // doc.rect(10, instructionDataY - 7, pageWidth - 20, backgroundHeight2, "F");
    // doc.text(instructionData2Lines, 10, instruction2DataY);

    // Add footer
    const footerText1 =
      "Copyright © 2024-2025 Prayagraj Mela Authority. All Rights Reserved.";
    const footerText2 = "Hosted by Prayagraj Mela Authority.";
    // const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerX2 = (pageWidth - doc.getTextWidth(footerText2)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    doc.text(footerText1, footerX + 30, footerY + 5); // Adjust for footer spacing
    doc.text(footerText2, footerX2 + 20, footerY + 10); // Adjust for footer spacing

    // Save the PDF
    doc.save(`${pdfName}.pdf`);
  };

  return (
    <Button type="primary" onClick={exportToPDF}>
      {/* <Button type="primary" onClick={exportToPDF}> */}
      Download PDF
    </Button>
  );
};

export default MonitoringEngPdf;
