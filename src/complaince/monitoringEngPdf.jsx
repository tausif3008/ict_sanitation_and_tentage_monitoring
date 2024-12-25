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
    doc.y = 15;

    // Centered ICT heading
    const ictHeading = "Maha Kumbh 2025";
    const pageWidth = doc.internal.pageSize.getWidth();
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2;
    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text(ictHeading, ictX - 12, doc.y);

    doc.y += 15;

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
    const rightImageX = pageWidth - 35;
    const rightImageY = 7;
    const rightImageWidth = 25;
    const rightImageHeight = 25;
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

    doc.y = Math.max(doc.y, rightImageY + rightImageHeight); // Ensure Y is at least below the image

    // Add subheading centered between the images
    const subHeading = "ICT Sanitation and Tentage Monitoring System";
    const subHeadingX = (pageWidth - doc.getTextWidth(subHeading)) / 2;
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text(subHeading, subHeadingX + 30, doc.y); // Position it below the images (Y position is adjusted)

    // Add report title and date on the same line, below the subheading
    const title = `${titleName}`;
    const dateString = moment().format("DD-MMM-YYYY HH:MM A");

    // Calculate positions for the title and date
    const titleX = 54; // Left align title
    const dateX = pageWidth - doc.getTextWidth(dateString) - 34; // 14 units from the right

    doc.y += 8;

    // Add title and date below the subheading
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX - 35, doc.y);
    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text(dateString, dateX + 30, doc.y);

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

    const tableStyles = {
      fontSize: 12,
      cellPadding: 3,
      margin: { left: 10, right: 20 },
    };

    doc.y += 5;

    // Add the first table (dynamic fields)
    doc.autoTable({
      startY: doc.y,
      body: tableData,
      theme: "plain",
      styles: tableStyles,
      didDrawPage: function (data) {
        doc.y = data.cursor.y;
      },
    });

    const instructionData =
      "You are hereby being put to notice that upon inspection the following observations have been made with respect to the under mentioned work(s). You are directed to take the required remedial actions as may be required, forthwith, within 24 hours, and apprise the Authority of the action taken in the form of an Action Taken Report. In case you fail to abide this notice, the Authority may proceed further as per the terms and conditions of service.";

    doc.setFontSize(12);
    doc.setFont("normal"); // Set the font style to normal (not bold)
    const instructionDataLines = doc.splitTextToSize(
      instructionData,
      pageWidth - 40
    );
    doc.y += 15;

    const backgroundHeight = 33; // Adjust height of the background box if necessary
    doc.setFillColor(220, 220, 220);
    doc.rect(10, doc.y - 9, pageWidth - 20, backgroundHeight, "F");
    doc.text(instructionDataLines, 15, doc.y); // Adjust X position to leave some space between text and the left edge

    doc.y += 35;

    const tableTitle = "Monitoring Report";
    const tableTitleIndex = (pageWidth - doc.getTextWidth(tableTitle)) / 2;
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text(tableTitle, tableTitleIndex - 20, doc.y);

    doc.y += 5;

    // Table header and content
    doc.autoTable({
      head: [headerData],
      body: rows,
      startY: doc.y,
      didDrawPage: function (data) {
        doc.y = data.cursor.y;
      },
    });

    const pageHeights = doc.internal.pageSize.getHeight();
    if (doc.y + 10 > pageHeights) {
      doc.addPage();
      doc.y = 10; // Reset Y position for the new page
    }

    const introduction2 =
      " If non-compliance with Operation & Maintenance found and not resolved within specified TAT then penalty would be imposed as mentioned in RFP.";
    doc.setFontSize(12);
    doc.setFont("normal"); // Set the font style to normal (not bold)
    const instructionDataLines2 = doc.splitTextToSize(
      introduction2,
      pageWidth - 40
    );

    doc.y += 10;

    doc.setFillColor(220, 220, 220);
    doc.rect(10, doc.y + 2 - 7, pageWidth - 20, 12, "F");
    doc.text(instructionDataLines2, 15, doc.y); // Adjust X position to leave some space between text and the left edge

    // Add footer
    const footerText1 =
      "Copyright © 2024-2025 Prayagraj Mela Authority. All Rights Reserved.";
    const footerText2 = "Hosted by Prayagraj Mela Authority.";
    // const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerX2 = (pageWidth - doc.getTextWidth(footerText2)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing
    doc.text(footerText2, footerX2, footerY + 10); // Adjust for footer spacing

    // Save the PDF
    doc.save(`${pdfName}.pdf`);
  };

  return (
    <Button type="primary" onClick={exportToPDF}>
      Download PDF
    </Button>
  );
};

export default MonitoringEngPdf;
