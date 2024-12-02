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

    doc.y = 15; // Start from a specific Y position

    // Centered ICT heading
    const ictHeading = "Maha Kumbh 2025";
    const pageWidth = doc.internal.pageSize.getWidth();
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
    doc.setFontSize(23); // Increase font size for better prominence
    doc.setFont("helvetica", "bold");
    doc.text(ictHeading, ictX - 12, doc.y); // Heading position

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

    doc.y = Math.max(doc.y, rightImageY + rightImageHeight); // Ensure Y is at least below the image

    // Add subheading centered between the images
    const subHeading = "ICT Sanitation and Tentage Monitoring System";
    const subHeadingX = (pageWidth - doc.getTextWidth(subHeading)) / 2; // Center the subheading
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
    doc.text(title, titleX - 35, doc.y); // Title position (Y position adjusted to be below the subheading)
    doc.setFont("normal");
    doc.setFontSize(10); // Smaller font size for date
    doc.text(dateString, dateX + 30, doc.y); // Date position (Y position adjusted to be below the title)

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

    const getTableHeight = (rows) => {
      const rowHeight = 10; // Approximate row height (you can adjust based on your styles)
      const headerHeight = 15; // Optional header row height
      const rowCount = rows.length;

      // Calculate total table height
      return headerHeight + rowHeight * rowCount;
    };

    doc.y += 5;

    // Add the first table (dynamic fields)
    doc.autoTable({
      startY: doc.y, // 45 Start the table after the header
      body: tableData, // Table body
      theme: "plain", // Table style
      styles: tableStyles,
      didDrawPage: function (data) {
        const dynamicHeight = getTableHeight(tableData);
      },
    });

    doc.y += getTableHeight(tableData);

    const instructionData =
      "You are hereby being put to notice that upon inspection the following observations have been made with respect to the under mentioned work(s). You are directed to take the required remedial actions as may be required, forthwith, within 24 hours, and apprise the Authority of the action taken in the form of an Action Taken Report. In case you fail to abide this notice, the Authority may proceed further as per the terms and conditions of service.";

    doc.setFontSize(12);
    doc.setFont("normal"); // Set the font style to normal (not bold)
    const instructionDataLines = doc.splitTextToSize(
      instructionData,
      pageWidth - 40
    ); // Adjust width to leave space for margins (20px left and right)
    doc.y += 10;

    const backgroundHeight = 35; // Adjust height of the background box if necessary
    doc.setFillColor(220, 220, 220);
    doc.rect(10, doc.y - 7, pageWidth - 20, backgroundHeight, "F");
    doc.text(instructionDataLines, 15, doc.y); // Adjust X position to leave some space between text and the left edge

    doc.y += 45;

    const tableTitle = "Monitoring Report";
    const tableTitleIndex = (pageWidth - doc.getTextWidth(tableTitle)) / 2; // Center the subheading
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text(tableTitle, tableTitleIndex - 20, doc.y);

    doc.y += 10;

    let currentY = doc.y;

    let totalHeight = 0;
    let newPageHeight = 30;
    let remainRow = [];
    const rowHeight = 10; // Example row height in units (this can be adjusted)
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page
    const availableHeight = pageHeight - currentY; // Height available for rows
    const rowsPerPage = Math.floor(availableHeight / rowHeight);

    // Table header and content
    doc.autoTable({
      head: [headerData],
      body: rows,
      startY: doc.y, // Start after the horizontal line and other content (Y position adjusted)
      didDrawPage: function (data) {
        // Get the Y position after drawing the table rows
        let currentPageY = data.cursor.y;

        // Calculate the height of the rows that were drawn on the current page
        let heightCoveredOnCurrentPage = currentPageY - currentY; // This is the height used on the current page

        totalHeight += heightCoveredOnCurrentPage; // Add to the total height covered by the table rows

        // If we have a new page (i.e., the table overflowed), the currentY is reset
        if (currentPageY > doc.internal.pageSize.height - 20) {
          // doc.addPage(); // Add a new page if the table exceeds the current page's height
          currentY = 10; // Start from the top of the new page
          const remainingRows = rows.slice(data.pageNumber * rowsPerPage); // Adjust to your slicing logic
          remainRow = rows.slice(data.pageNumber * rowsPerPage); // Adjust to your slicing logic
        } else {
          currentY = currentPageY; // Update currentY to the Y position at the end of the table rows
        }
      },
    });

    // console.log("doc.y", doc.y);
    // console.log("remainRow?.length", remainRow?.length);

    if (remainRow?.length > 0) {
      newPageHeight += remainRow?.length * 10;
    } else {
      newPageHeight += doc.y;
    }
    // console.log("newPageHeight KKK", newPageHeight);
    // console.log("Page height:", pageHeight); // This will print the page height in points

    const introduction2 =
      " If non-compliance with Operation & Maintenance found and not resolved within specified TAT then penalty would be imposed as mentioned in RFP.";
    doc.setFontSize(12);
    doc.setFont("normal"); // Set the font style to normal (not bold)
    const instructionDataLines2 = doc.splitTextToSize(
      introduction2,
      pageWidth - 40
    );
    let instructionDataY2 = newPageHeight; // Adjust Y position as needed
    // const instructionDataY2 = 90; // Adjust Y position as needed
    const backgroundHeight2 = 20; // Adjust height of the background box if necessary

    const lineHeight = 12 * 1.2; // Assuming a line height of 1.2 times the font size (adjust as needed)
    const contentHeight =
      newPageHeight +
      backgroundHeight2 +
      instructionDataLines2.length * lineHeight;
    const spaceRemaining = pageHeight - contentHeight;

    if (spaceRemaining < 50) {
      instructionDataY2 = 15;
      // If the remaining space is less than 30 points (adjust as needed)
      doc.addPage(); // Add a new page if not enough space for the footer
    }

    doc.setFillColor(220, 220, 220);
    doc.rect(10, instructionDataY2 - 7, pageWidth - 20, backgroundHeight2, "F");
    doc.text(instructionDataLines2, 15, instructionDataY2); // Adjust X position to leave some space between text and the left edge

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
