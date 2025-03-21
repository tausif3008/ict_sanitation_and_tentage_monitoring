import React from "react";
import { jsPDF } from "jspdf";
import moment from "moment";
import "jspdf-autotable";
import { message } from "antd";
import { IMAGELIST } from "../assets/Images/exportImages";

// modified
export const MonitoringDailyReportPdf = (
  tableObject = {},
  titleName,
  pdfName,
  landscape = false,
  IsLastLineBold = false,
  dailyReport = true
) => {
  let totalCount = 0;
  if (!tableObject || Object.keys(tableObject).length === 0) {
    message?.error("Data is not available");
    return "";
  }

  const startDate = moment(tableObject?.form_date, "YYYY-MM-DD").format(
    "DD-MMM-YYYY"
  );
  const endDate = moment(tableObject?.to_date, "YYYY-MM-DD").format(
    "DD-MMM-YYYY"
  );

  const headerData = ["Que", "Questions", "Question Type"];
  let col = [];

  const sortedArray = [
    ...(tableObject?.incidence_array?.[0]?.incidence_que_array || []),
  ];

  // Now, iterate over the sorted array
  sortedArray?.forEach((element) => {
    if (element?.question_id) {
      col.push(`Q-${element?.question_id}`);
    }
  });

  const questionArray =
    tableObject?.questions?.map((data) => {
      return [data?.que, data?.que_eng, data?.que_hin];
    }) || [];

  let tableRow = [];

  const myNewArray = tableObject?.incidence_array?.map((item) => {
    let arr = [];
    arr?.push(`Sector- ${item?.sector_id}`);

    const rohitArray =
      Array.from(item?.incidence_que_array || [])?.map(
        (element) => `${element?.incidence_count}`
      ) || []; // Default to empty array if undefined

    arr = [...arr, ...rohitArray];

    // Calculate the sum of valid incidence_count values
    const count = item?.incidence_que_array
      ?.filter((element) => element?.incidence_count !== "-") // Filter again to only sum valid numbers
      .reduce(
        (total, start) => total + (Number(start?.incidence_count) || 0),
        0
      );
    totalCount += count;

    // Add the sum to the array
    arr.push(count || 0);

    return arr;
  });

  const columnNames = ["Sector", ...col, "Total"];
  const doc = new jsPDF(landscape ? "landscape" : "");
  doc.y = 15;

  // Centered ICT heading
  const ictHeading = "Maha Kumbh 2025";
  const pageWidth = doc.internal.pageSize.getWidth();
  const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2;
  doc.setFontSize(23);
  doc.setFont("helvetica", "bold");
  doc.text(ictHeading, ictX - 12, doc.y);

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

  doc.y += 15;

  // Add subheading centered between the images
  const subHeading = "ICT Sanitation and Tentage Monitoring System";
  const subHeadingX = (pageWidth - doc.getTextWidth(subHeading)) / 2;
  doc.setFontSize(16);
  doc.setFont("bold");
  doc.text(subHeading, subHeadingX + 30, doc.y);

  doc.y += 10;
  const title = `${titleName}`;
  // const dateString = moment().format("DD-MMM-YYYY hh:mm A");
  const titleX = 54;
  // const dateX = pageWidth - doc.getTextWidth(dateString) - 34;

  // Add title and date below the subheading
  doc.setFontSize(12);
  doc.setFont("bold");
  doc.text(title, titleX - 35, doc.y);

  doc.setFont("normal");
  doc.setFontSize(10);
  // doc.text(dateString, dateX + 30, doc.y);

  // Table for dynamic fields (label-value pairs)
  const tableData = [
    [
      "Date",
      `: ${dailyReport ? startDate || "" : `${startDate} to ${endDate}` || ""}`,
    ],
    ["Type", `: ${tableObject?.type || ""}`],
    ["Vendor Name", `: ${tableObject?.vendor_name || ""}`],
    ["Sir/Ma'am,"],
  ];

  const tableStyles = {
    fontSize: 12,
    cellPadding: 2,
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

  doc.setFont("helvetica", "normal"); // make font normal
  doc.y += 15;

  const instructionData = `You are hereby being put to notice that upon inspection on ${
    dailyReport ? startDate || "" : `${startDate} to ${endDate}` || ""
  } you have been sent “${totalCount}” number of SMS alerts on your registered Mobile Number “${
    tableObject?.vendor_phone || ""
  }” individually for each PTC ID for the infractions/lacunas/defects discovered with respect to the above mentioned type of toilet and the following deviations have been found overall with respect to the under mentioned work(s):`;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold"); // make font normal
  doc.setFont("bold");
  const instructionDataLines = doc.splitTextToSize(
    instructionData,
    pageWidth - 30
  );

  const backgroundHeight = 37; // Adjust height of the background box if necessary
  doc.setFillColor(240, 240, 240);
  doc.rect(10, doc.y - 9, pageWidth - 20, backgroundHeight, "F");
  // doc.text(instructionDataLines, 15, doc.y);
  let currentY = doc.y;

  // Render each line separately with proper vertical spacing
  const lineHeight = 6; // Adjust the height between lines as needed
  instructionDataLines.forEach((line, index) => {
    doc.text(line, 15, currentY + index * lineHeight); // Adjusting the Y position for each line
  });

  doc.y += 33;

  const sectorTableStyles = {
    fontSize: 9,
  };

  doc.autoTable({
    head: [columnNames],
    body: myNewArray,
    startY: doc.y,
    styles: sectorTableStyles,
    didDrawPage: function (data) {
      // Update the doc.y to start at a new position for each page
      doc.y = data.cursor.y;
    },
    didParseCell: function (data) {
      const isLastRow = data.row.index === tableRow.length - 1;
      if (isLastRow && IsLastLineBold) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [10, 10, 10];
        data.cell.styles.fontSize = 10;
      }
      const isLastColumn = data.column.index === columnNames.length - 1;
      if (isLastColumn) {
        // Apply bold styling to the last column
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [10, 10, 10]; // Optional: change the text color
        data.cell.styles.fontSize = 10; // Optional: adjust font size
      }
    },
  });

  const instructionData2 =
    "You are directed to take the requisite remedial actions/measures in connection with the report being enclosed, as may be required, forthwith, within 24 hours, and apprise the Authority of the curative action(s) taken in the form of an Action Taken Report. Please note failure to abide by this notice shall not only tantamount breach of contract but would also entitle the Authority to proceed further as per the terms and conditions of agreement.";
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold"); // make font normal
  doc.setFont("bold");
  const instructionDataLines2 = doc.splitTextToSize(
    instructionData2,
    pageWidth - 30
  );
  doc.y += 20;

  doc.setFillColor(240, 240, 240);
  const backgroundHeight2 = 39; // Adjust height of the background box if necessary
  doc.rect(10, doc.y - 13, pageWidth - 20, backgroundHeight2, "F");
  // doc.text(instructionDataLines2, 15, doc.y);
  let currentYY = doc.y - 3;

  // Render each line separately with proper vertical spacing
  instructionDataLines2.forEach((line, index) => {
    doc.text(line, 15, currentYY + index * lineHeight); // Adjusting the Y position for each line
  });

  doc.y += 37;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal"); // make font normal
  doc.setFont("normal");
  doc.text("Regards", titleX - 35, doc.y);
  doc.y += 5;
  doc.text("Prayagraj Mela Authority", titleX - 35, doc.y);

  doc.y += 15;
  doc.setFontSize(12);
  doc.setFont("normal");
  doc.text("Question List for reference:", titleX - 35, doc.y);
  doc.y += 3;

  doc.autoTable({
    head: [headerData],
    body: questionArray,
    startY: doc.y,
    didDrawPage: function (data) {
      // Update the doc.y to start at a new position for each page
      doc.y = data.cursor.y;
    },
    didParseCell: function (data) {
      const isLastRow = data.row.index === questionArray?.length - 1;
      if (isLastRow && IsLastLineBold) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [10, 10, 10];
        data.cell.styles.fontSize = 10;
      }
    },
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  if (doc.y + 10 > pageHeight) {
    doc.addPage();
    doc.y = 10;
  }

  // Add footer
  const footerText1 =
    "Copyright © 2024-2025 Prayagraj Mela Authority. All Rights Reserved.";
  const footerText2 = "Hosted by Prayagraj Mela Authority.";
  const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
  const footerX2 = (pageWidth - doc.getTextWidth(footerText2)) / 2; // Center footer
  const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

  doc.setFontSize(10);
  doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing
  doc.text(footerText2, footerX2, footerY + 10); // Adjust for footer spacing

  // Save the PDF
  doc.save(`${pdfName}.pdf`);
};
