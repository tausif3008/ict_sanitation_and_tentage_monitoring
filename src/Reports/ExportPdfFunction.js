import React from "react";
import { jsPDF } from "jspdf";
import moment from "moment";
import "jspdf-autotable";
import { Button, message } from "antd";
import { IMAGELIST } from "../assets/Images/exportImages";

// modified
export const ExportPdfFunction = (
  titleName,
  pdfName,
  headerData,
  rows,
  landscape = false
) => {
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

  // Table header and content
  doc.autoTable({
    head: [headerData],
    body: rows,
    startY: 45, // Start after the horizontal line and other content (Y position adjusted)
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