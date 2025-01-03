import React from "react";
import { jsPDF } from "jspdf";
import moment from "moment";
import "jspdf-autotable";
import { message } from "antd";
import { IMAGELIST } from "../assets/Images/exportImages";

// modified
export const MonitoringPdfNew = (
  titleName, // title
  pdfName, // pdf name
  headerData, // header
  rows, // rows
  landscape = false,
  IsLastLineBold = false,
  columnPercentages = [], // column percentage
  pdfTitleData = {} // monitoring title
) => {
  if (rows && rows?.length === 1) {
    message?.error("Data is not available");
    return "";
  }
  const doc = new jsPDF(landscape ? "landscape" : "");
  doc.y = 15;
  // Centered ICT heading
  const ictHeading = "Maha Kumbh 2025";
  const pageWidth = doc.internal.pageSize.getWidth();
  const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
  doc.setFontSize(20); // Increase font size for better prominence
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 140, 0); // Set text color to orange (RGB: 255, 165, 0)
  doc.text(ictHeading, ictX - 12, doc.y); // Heading position

  // Image on the Left (Company Logo or similar image)
  const leftImageX = 10;
  const leftImageY = 7;
  const leftImageWidth = 25;
  const leftImageHeight = 25;
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

  doc.y += 10;

  const subHeading = "ICT Sanitation and Tentage Monitoring System";
  const subHeadingX = (pageWidth - doc.getTextWidth(subHeading)) / 2; // Center the subheading
  doc.setFontSize(15);
  doc.setFont("bold");
  doc.text(subHeading, subHeadingX + 15, doc.y);
  doc.setTextColor(0, 0, 0);

  // Add report title and date on the same line, below the subheading
  const title = `${titleName}`;
  const category = `Category : ${pdfTitleData?.category}`;
  const type = `Type : ${pdfTitleData?.type}`;
  const DateRange = `Frequency : ${pdfTitleData?.date}`;
  const dateString = moment().format("DD-MMM-YYYY hh:mm A");

  const titleX = 54;
  const dateX = pageWidth - doc.getTextWidth(dateString) - 34;

  doc.y += 10;
  doc.setFontSize(12);
  doc.setFont("bold");
  doc.text(title, subHeadingX + 30, doc.y);
  doc.setFontSize(11);
  doc.text(dateString, dateX + 30, doc.y + 10);
  doc.y += 8;
  doc.text(category, titleX - 35, doc.y);
  doc.y += 8;
  doc.text(type, titleX - 35, doc.y);
  doc.y += 8;
  doc.text(DateRange, titleX - 35, doc.y);
  doc.setFont("normal");
  doc.setFontSize(10);

  doc.y += 5;
  const availableWidth = pageWidth - 20; // Reserve 20 units for padding (adjust as needed)
  const columnWidths = columnPercentages?.map(
    (percentage) => (availableWidth * percentage) / 100
  );

  // Table header and content
  doc.autoTable({
    head: [headerData],
    body: rows,
    startY: doc.y,
    columnStyles: headerData?.reduce((styles, header, index) => {
      styles[index] = {
        cellWidth: columnWidths[index], // Assign width based on calculated value
        halign: "center", // Horizontally align the content to the center
      };
      return styles;
    }, {}),
    didParseCell: function (data) {
      const isLastRow = data.row.index === rows.length - 1; // Check if it's the last row
      if (isLastRow && IsLastLineBold) {
        data.cell.styles.fontStyle = "bold"; // Set font style to bold for the last row
        data.cell.styles.textColor = [10, 10, 10]; // Set text color to black
        data.cell.styles.fontSize = 10; // Increase font size for emphasis
      }
      // Align the text in the center for all cells in all rows
      data.cell.styles.halign = "center";
    },
  });

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
