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
    const dateString = moment().format("DD-MMM-YYYY hh:mm A");

    // Calculate positions for the title and date
    const titleX = 54;
    const dateX = pageWidth - doc.getTextWidth(dateString) - 34;

    doc.y += 8;

    // Add title and date below the subheading
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX - 35, doc.y);
    doc.setFont("helvetica", "normal"); // make font normal
    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text(dateString, dateX + 30, doc.y);

    // Table for dynamic fields (label-value pairs)
    const tableData = [
      ["Category", `: ${tableObject?.asset_main_type_name || ""}`],
      ["Type", `: ${tableObject?.asset_type_name || ""}`],
      ["Vendor Name", `: ${tableObject?.vendor_name || ""}`],
      ...(tableObject?.sector_name
        ? [["Sector", `: ${tableObject?.sector_name || ""}`]]
        : []),
      ...(tableObject?.parking_name
        ? [["Parking Name", `: ${tableObject?.parking_name || ""}`]]
        : []),

      // Conditional block for asset_main_type_id === "2"
      ...(tableObject?.asset_main_type_id === "2"
        ? [
            ["Sanstha Name", `: ${tableObject?.sanstha_name_hi || ""}`],
            ["Mela Patri Name", `: ${tableObject?.mela_patri_name || ""}`],
            ["Mela Road Name", `: ${tableObject?.mela_road_name || ""}`],
          ]
        : []),
      // : [["Circle", `: ${tableObject?.circle_name || ""}`]]),

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

    const instructionData = `You are hereby being put to notice that upon inspection on ${moment(
      tableObject?.submitted_date
    ).format("DD-MMM-YYYY")} you have been sent “${
      tableObject?.smscount || ""
    }” number of SMS alerts on your registered Mobile Number “${
      tableObject?.vendor_phone || ""
    }” individually for each ${
      tableObject?.asset_main_type_id === "2" ? "TAF ID" : "PTC ID"
    } for the infractions/lacunas/defects discovered with respect to the abovementioned type of toilet and the following deviations have been found overall with respect to the under mentioned work(s):`;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold"); // make font bold
    doc.setFont("bold");
    const instructionDataLines = doc.splitTextToSize(
      instructionData,
      pageWidth - 30
    );
    doc.y += 15;

    const backgroundHeight = 33;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, doc.y - 9, pageWidth - 20, backgroundHeight, "F");
    // doc.text(instructionDataLines, 15, doc.y);
    let currentY = doc.y - 3;

    // Render each line separately with proper vertical spacing
    const lineHeight = 6;
    instructionDataLines?.forEach((line, index) => {
      doc.text(line, 15, currentY + index * lineHeight); // Adjusting the Y position for each line
    });

    // Split instructionData into parts
    // const instructionDataParts = [
    //   "You are hereby being put to notice that upon inspection on ",
    //   {
    //     text: moment(tableObject?.submitted_date).format("DD-MMM-YYYY"),
    //     bold: true,
    //   },
    //   " you have been sent ",
    //   { text: tableObject?.smscount || "", bold: true },
    //   " number of SMS alerts on your registered Mobile Number ",
    //   { text: tableObject?.vendor_phone || "", bold: true },
    //   " individually for ",
    //   {
    //     // text: tableObject?.asset_main_type_id === "2" ? "TAF ID" : "PTC ID",
    //     text:
    //       tableObject?.asset_main_type_id === "2"
    //         ? `${`${tableObject?.code}-${tableObject?.unit_no}`} TAF ID`
    //         : `${`${tableObject?.code}-${tableObject?.unit_no}`} PTC ID`,
    //     bold: true,
    //   },
    //   " for the infractions/lacunas/defects discovered with respect to the above mentioned",
    //   "type of toilet and the following deviations have been found overall with respect to the under mentioned work(s):",
    // ];

    // // Set up the font size and initial position
    // doc.setFontSize(12);
    // let currentY = doc.y;
    // const margin = 15;
    // let currentX = margin;
    // const lineHeight = 5;

    // const backgroundHeight = 33;
    // doc.setFillColor(240, 240, 240);
    // doc.rect(10, doc.y - 9, pageWidth - 20, backgroundHeight, "F");

    // // Loop through the parts and add them to the document
    // instructionDataParts?.forEach((part) => {
    //   // Apply the correct font style (normal or bold)
    //   if (typeof part === "string") {
    //     doc.setFont("helvetica", "normal");
    //     doc.setFont("normal");
    //   } else if (part.bold) {
    //     doc.setFont("helvetica", "bold");
    //     doc.setFont("bold");
    //   }

    //   const text = typeof part === "string" ? part : part?.text;
    //   const textArray = doc.splitTextToSize(text, pageWidth - 40); // Adjust the width to fit the page

    //   textArray?.forEach((line, index) => {
    //     const textWidth = doc.getTextWidth(line);

    //     // Move to the next line if the current line exceeds the page width
    //     if (currentX + textWidth > pageWidth - margin) {
    //       currentX = margin;
    //       currentY += lineHeight;
    //     }

    //     doc.text(line, currentX, currentY);
    //     currentX += textWidth;

    //     // Add a line break after each line (except the last line)
    //     if (index < textArray?.length - 1) {
    //       currentX = margin;
    //       currentY += lineHeight;
    //     }
    //   });
    // });

    doc.y += 35;

    const tableTitle = "Unit Wise Monitoring Report";
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
    if (doc.y + 20 > pageHeights) {
      doc.addPage();
      doc.y = 10; // Reset Y position for the new page
    }

    const introduction2 =
      "You are directed to take the requisite remedial actions/measures in connection with the report being enclosed, as may be required, forthwith, within 24 hours, and apprise the Authority of the curative action(s) taken in the form of an Action Taken Report. Please note failure to abide by this notice shall not only tantamount breach of contract but would also entitle the Authority to proceed further as per the terms and conditions of agreement.";
    doc.setFontSize(12);
    const instructionDataLines2 = doc.splitTextToSize(
      introduction2,
      pageWidth - 30
    );

    doc.y += 13;
    let currentYY = doc.y;

    const pageHeight = doc.internal.pageSize.height;

    if (doc.y > pageHeight - 40) {
      doc.addPage();
      doc.y = 15;
      currentYY = doc.y;
    }

    doc.setFont("helvetica", "bold");
    doc.setFont("bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(10, doc.y + 2 - 7, pageWidth - 20, 35, "F");
    // doc.text(instructionDataLines2, 15, doc.y); // Adjust X position to leave some space between text and the left edge

    // Render each line separately with proper vertical spacing
    instructionDataLines2.forEach((line, index) => {
      doc.text(line, 15, currentYY + index * lineHeight); // Adjusting the Y position for each line
    });

    doc.setFont("helvetica", "normal");
    doc.setFont("normal");

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
