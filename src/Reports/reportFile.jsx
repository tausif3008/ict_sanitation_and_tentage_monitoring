import React from "react";
import { jsPDF } from "jspdf";
import moment from "moment";
import "jspdf-autotable";
import { Button, message } from "antd";
import { IMAGELIST } from "../assets/Images/exportImages";

const ExportToPDF = ({
  titleName,
  pdfName,
  headerData,
  rows,
  landscape = false,
  IsLastLineBold = false,
  IsNoBold = false, // Is Number Bold
  applyTableStyles = false,
  tableFont = 8,
  columnProperties = [],
  redToGreenProperties = [],
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
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
    doc.setFontSize(20); // Increase font size for better prominence
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 140, 0); // Set text color to orange (RGB: 255, 165, 0)
    doc.text(ictHeading, ictX - 12, doc.y); // Heading position

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
    doc.y += 10;

    // Add subheading centered between the images
    const subHeading = "ICT Sanitation and Tentage Monitoring System";
    const subHeadingX = (pageWidth - doc.getTextWidth(subHeading)) / 2;
    doc.setFontSize(15);
    doc.setFont("bold");
    doc.text(subHeading, subHeadingX + 25, doc.y);
    doc.setTextColor(0, 0, 0);

    // Add report title and date on the same line, below the subheading
    const title = `${titleName}`;
    const dateString = moment().format("DD-MMM-YYYY hh:mm A");

    const titleX = 54; // Left align title
    const dateX = pageWidth - doc.getTextWidth(dateString) - 34; // 14 units from the right

    doc.y += 13;

    // Add title and date below the subheading
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX - 35, doc.y);

    // Add date on the next line, maintaining the same X position for horizontal alignment
    doc.setFont("normal");
    doc.setFontSize(10);
    doc.y += 10;
    doc.text(dateString, dateX + 30, doc.y);
    doc.y += 5;

    const tableStyles = {
      fontSize: tableFont,
      cellPadding: 2,
      margin: { left: 10, right: 20 },
    };

    // Table header and content
    doc.autoTable({
      head: [headerData],
      body: rows,
      styles: applyTableStyles ? tableStyles : null,
      startY: doc.y,
      didDrawPage: function (data) {
        doc.y = data.cursor.y;
      },
      // didParseCell: function (data) {
      //   const isLastRow = data.row.index === rows.length - 1; // Check if it's the last row
      //   const isNumber = !isNaN(data.cell.text) && data.cell.text !== ""; // Check if it's a number (excluding empty)
      //   const isFirstColumn = data.column.index === 0;
      //   data.cell.styles.halign = "center";

      //   if (
      //     (isLastRow && IsLastLineBold) ||
      //     (IsNoBold &&
      //       isNumber &&
      //       !isFirstColumn &&
      //       Number(data.cell.text) !== 0)
      //   ) {
      //     data.cell.styles.fontStyle = "bold"; // Set font style to bold for the last row
      //     data.cell.styles.textColor = [10, 10, 10]; // Set text color to black
      //     data.cell.styles.fontSize = applyTableStyles ? tableFont : 10; // Increase font size for emphasis
      //   }
      // },
      didParseCell: function (data) {
        const isLastRow = data.row.index === rows.length - 1; // Check if it's the last row
        const isNumber = !isNaN(data.cell.text) && data.cell.text !== ""; // Check if it's a number (excluding empty)
        const isFirstColumn = data.column.index === 0;
        data.cell.styles.halign = "center";
        const containsPercentage = data.cell.text?.[0].includes("%");
        const numberPart = data.cell.text?.[0].match(/\d+/); // Matches one or more digits
        const numberParts = numberPart?.[0];

        if (
          (isLastRow && IsLastLineBold) ||
          (IsNoBold &&
            isNumber &&
            !isFirstColumn &&
            Number(data.cell.text) !== 0)
        ) {
          data.cell.styles.fontStyle = "bold"; // Set font style to bold for the last row
          data.cell.styles.textColor = [10, 10, 10]; // Set text color to black
          data.cell.styles.fontSize = applyTableStyles ? tableFont : 10; // Increase font size for emphasis
        }
        if (
          containsPercentage &&
          columnProperties?.includes(data.column.index) &&
          numberParts
        ) {
          const percentage = Math.min(Math.max(numberParts, 0), 100);
          const red = Math.floor((100 - percentage) * 2.55); // More red for lower percentage
          const green = Math.floor(percentage * 2.55); // More green for higher percentage
          const blue = 0; // You can adjust blue if desired

          // Validate and set background color
          if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
            data.cell.styles.fillColor = `rgb(${red}, ${green}, ${blue})`;
            data.cell.styles.textColor = [255, 255, 255]; // Set text color to white
          } else {
            data.cell.styles.fillColor = `rgb(255, 255, 255)`;
          }
        }
        if (
          containsPercentage &&
          redToGreenProperties?.includes(data.column.index) &&
          numberParts
        ) {
          // Ensure percentage is between 0 and 100
          const percentage = Math.min(Math.max(numberParts, 0), 100);

          // Adjust the RGB values to go from red to green
          const green = Math.floor((100 - percentage) * 2.55); // 100% red at 0%, 0% red at 100%
          const red = Math.floor(percentage * 2.55); // 0% green at 0%, 100% green at 100%
          const blue = 0; // Blue remains 0

          // Validate and set background color
          if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
            data.cell.styles.fillColor = `rgb(${red}, ${green}, ${blue})`; // Set background color
            data.cell.styles.textColor = [10, 10, 10]; // Set text color to white for contrast
          } else {
            data.cell.styles.fillColor = `rgb(255, 255, 255)`; // Set to white if values are invalid
          }
        }
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

  return (
    <Button type="primary" onClick={exportToPDF}>
      Download PDF
    </Button>
  );
};

export default ExportToPDF;
