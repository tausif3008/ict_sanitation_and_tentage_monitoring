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
  IsLastLineBold = false
) => {
  let totalCount = 0;
  if (!tableObject || Object.keys(tableObject).length === 0) {
    message?.error("Data is not available");
    return "";
  }

  tableObject = {
    date: "24-Dec-2024",
    type: "Type-2 FRP Soak Pit",
    vendor_name: "M/s Bhutani International Private Limited",
    vendor_phone: "7070096133",
    smscount: 88,
    questions: [
      {
        que: 1,
        que_eng: "Do toilets have ramps/hand bar railing for disabled people?",
        que_hin: "Common",
      },
      {
        que: 2,
        que_eng:
          "Are there 9 Indian + 1 Western seat per toilet block (10 seats)?",
        que_hin: "Common",
      },
      {
        que: 15,
        que_eng: "Is water not overflowing from the soakpit?",
        que_hin: "Individual",
      },
      {
        que: 4,
        que_eng: "Is there Soap/handwash in the toilet block?",
        que_hin: "Common",
      },
      {
        que: 5,
        que_eng: "Is there any cleaning staff  in the toilet premises?",
        que_hin: "Common",
      },
      {
        que: 6,
        que_eng: "Is there 1 large dustbin for every 10 toilets?",
        que_hin: "Common",
      },
      {
        que: 7,
        que_eng: "Is the toilet cleaned by jet spray?",
        que_hin: "Common",
      },
      {
        que: 8,
        que_eng: "Is Male/Female/non-smoking signage placed on toilet?",
        que_hin: "Common",
      },
      {
        que: 9,
        que_eng: "Is the toilet clean?",
        que_hin: "Individual",
      },
      {
        que: 10,
        que_eng:
          "Is drainage and sewerage system working properly inside the toilets?",
        que_hin: "Individual",
      },
      {
        que: 11,
        que_eng: "Is the toilet door have a latch inside/outside?",
        que_hin: "Individual",
      },
      {
        que: 12,
        que_eng:
          "Are there potholes, cracks and concrete joints regularly repairs?",
        que_hin: "Individual",
      },
      {
        que: 13,
        que_eng: "Is bulb/LED in toilet working?",
        que_hin: "Individual",
      },
      {
        que: 14,
        que_eng: "Has the unpleasant odor been removed?",
        que_hin: "Individual",
      },
    ],
    incidence_array: [
      {
        sector_id: "1",
        incidence_que_array: [
          {
            question_id: "1",
            incidence_count: "-",
          },
          {
            question_id: "2",
            incidence_count: "-",
          },
          {
            question_id: "15",
            incidence_count: "8",
          },
          {
            question_id: "4",
            incidence_count: "2",
          },
          {
            question_id: "5",
            incidence_count: "1",
          },
          {
            question_id: "6",
            incidence_count: "4",
          },
          {
            question_id: "7",
            incidence_count: "2",
          },
          {
            question_id: "8",
            incidence_count: "3",
          },
          {
            question_id: "9",
            incidence_count: "11",
          },
          {
            question_id: "10",
            incidence_count: "11",
          },
          {
            question_id: "11",
            incidence_count: "8",
          },
          {
            question_id: "12",
            incidence_count: "11",
          },
          {
            question_id: "13",
            incidence_count: "14",
          },
          {
            question_id: "14",
            incidence_count: "11",
          },
        ],
      },
      {
        sector_id: "2",
        incidence_que_array: [
          {
            question_id: "1",
            incidence_count: "-",
          },
          {
            question_id: "2",
            incidence_count: "-",
          },
          {
            question_id: "15",
            incidence_count: "-",
          },
          {
            question_id: "4",
            incidence_count: "-",
          },
          {
            question_id: "5",
            incidence_count: "-",
          },
          {
            question_id: "6",
            incidence_count: "-",
          },
          {
            question_id: "7",
            incidence_count: "-",
          },
          {
            question_id: "8",
            incidence_count: "-",
          },
          {
            question_id: "9",
            incidence_count: "-",
          },
          {
            question_id: "10",
            incidence_count: "-",
          },
          {
            question_id: "11",
            incidence_count: "-",
          },
          {
            question_id: "12",
            incidence_count: "-",
          },
          {
            question_id: "13",
            incidence_count: "1",
          },
          {
            question_id: "14",
            incidence_count: "-",
          },
        ],
      },
      {
        sector_id: "3",
        incidence_que_array: [
          {
            question_id: "1",
            incidence_count: "-",
          },
          {
            question_id: "2",
            incidence_count: "-",
          },
          {
            question_id: "15",
            incidence_count: "-",
          },
          {
            question_id: "4",
            incidence_count: "-",
          },
          {
            question_id: "5",
            incidence_count: "-",
          },
          {
            question_id: "6",
            incidence_count: "-",
          },
          {
            question_id: "7",
            incidence_count: "-",
          },
          {
            question_id: "8",
            incidence_count: "-",
          },
          {
            question_id: "9",
            incidence_count: "1",
          },
          {
            question_id: "10",
            incidence_count: "-",
          },
          {
            question_id: "11",
            incidence_count: "-",
          },
          {
            question_id: "12",
            incidence_count: "-",
          },
          {
            question_id: "13",
            incidence_count: "-",
          },
          {
            question_id: "14",
            incidence_count: "-",
          },
        ],
      },
    ],
  };

  const headerData = ["Que", "Questions (English)", "Question Type"];
  let col = [];

  // tableObject?.incidence_array?.[0]?.incidence_que_array?.forEach(
  //   (element) => {
  //     col.push(`Q-${element?.question_id}`);
  //   }
  // );

  const sortedArray = [
    ...(tableObject?.incidence_array?.[0]?.incidence_que_array || []),
  ].sort((a, b) => {
    const questionA = Number(a?.question_id);
    const questionB = Number(b?.question_id);
    return questionA - questionB; // Ascending order
  });

  // Now, iterate over the sorted array
  sortedArray?.forEach((element) => {
    if (element?.question_id) {
      col.push(`Q-${element?.question_id}`);
    }
  });

  // tableObject?.incidence_array?.[0]?.incidence_que_array
  //   ?.sort((a, b) => {
  //     // Sorting based on question_id
  //     const questionA = Number(a?.question_id);
  //     const questionB = Number(b?.question_id);
  //     return questionA - questionB; // Ascending order (1, 2, 3,...)
  //   })
  //   ?.forEach((element) => {
  //     col?.push(`Q-${element?.question_id}`);
  //   });

  console.log(col);

  const questionArray =
    tableObject?.questions?.map((data) => {
      return [data?.que, data?.que_eng, data?.que_hin];
    }) || [];

  console.log(questionArray);

  const sortedQuestionArray = questionArray?.sort((a, b) => {
    const questionA = Number(a[0]); // Convert the que value to a number
    const questionB = Number(b[0]); // Convert the que value to a number

    if (questionA < questionB) return -1; // If questionA is smaller, it comes first
    if (questionA > questionB) return 1; // If questionA is larger, it comes after
    return 0; // If they are equal, no change
  });

  console.log(sortedQuestionArray);

  let tableRow = [];

  const myNewArray = tableObject?.incidence_array?.map((item) => {
    let arr = [];
    arr?.push(`Id - ${item?.sector_id}`);

    // const rohitArray =
    //   item?.incidence_que_array
    //     .map((element) => `${element?.incidence_count}`) || [];

    // const rohitArray =
    //   item?.incidence_que_array
    //     ?.sort((a, b) => {
    //       // Compare based on question_id to sort numerically
    //       const questionA = Number(a?.question_id);
    //       const questionB = Number(b?.question_id);
    //       return questionA - questionB; // Sorting in ascending order
    //     })
    //     ?.map((element) => `${element?.incidence_count}`) || [];

    const rohitArray =
      Array.from(item?.incidence_que_array || [])
        .sort((a, b) => {
          const questionA = Number(a?.question_id);
          const questionB = Number(b?.question_id);
          return questionA - questionB; // Sorting in ascending order (1, 2, 3, ...)
        })
        .map((element) => `${element?.incidence_count}`) || []; // Default to empty array if undefined

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
  const dateString = moment().format("DD-MMM-YYYY hh:mm A");
  const titleX = 54;
  const dateX = pageWidth - doc.getTextWidth(dateString) - 34;

  // Add title and date below the subheading
  doc.setFontSize(12);
  doc.setFont("bold");
  doc.text(title, titleX - 35, doc.y);

  doc.setFont("normal");
  doc.setFontSize(10);
  doc.text(dateString, dateX + 30, doc.y);

  // Table for dynamic fields (label-value pairs)
  const tableData = [
    ["Date", `: ${tableObject?.date || ""}`],
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

  // const instructionData = `You are hereby being put to notice that upon inspection on ${tableObject?.date} you have been sent “${tableObject?.vendor_phone}” number of SMS alerts on your registered Mobile Number “${tableObject?.smscount}” individually for each PTC ID for the infractions/lacunas/defects discovered with respect to the abovementioned type of toilet and the following deviations have been found overall with respect to the under mentioned work(s):`;
  // doc.setFontSize(12);
  // doc.setFont("normal");
  // const instructionDataLines = doc.splitTextToSize(
  //   instructionData,
  //   pageWidth - 40
  // );

  // const backgroundHeight = 33; // Adjust height of the background box if necessary
  // doc.setFillColor(240, 240, 240);
  // doc.rect(10, doc.y - 9, pageWidth - 20, backgroundHeight, "F");
  // doc.text(instructionDataLines, 15, doc.y);

  const instructionDataParts = [
    "You are hereby being put to notice that upon inspection on ",
    {
      text: moment(tableObject?.date).format("DD-MMM-YYYY"),
      bold: true,
    },
    " you have been sent ",
    { text: totalCount || "", bold: true },
    " number of SMS alerts on your registered Mobile Number ",
    { text: tableObject?.vendor_phone || "", bold: true },
    " individually for each ",
    {
      text: tableObject?.asset_main_type_id === "2" ? "TAF ID" : "PTC ID",
      bold: true,
    },
    " for the infractions/lacunas/defects discovered with respect to the abovementioned type of toilet and the following deviations have been found overall with respect to the under mentioned work(s):",
  ];

  // Set up the font size and initial position
  doc.setFontSize(12);
  let currentY = doc.y;
  const margin = 15;
  let currentX = margin;
  const lineHeight = 5;

  const backgroundHeight = 33;
  doc.setFillColor(240, 240, 240);
  doc.rect(10, doc.y - 9, pageWidth - 20, backgroundHeight, "F");

  // Loop through the parts and add them to the document
  instructionDataParts?.forEach((part) => {
    // Apply the correct font style (normal or bold)
    if (typeof part === "string") {
      doc.setFont("helvetica", "normal");
      doc.setFont("normal");
    } else if (part.bold) {
      doc.setFont("helvetica", "bold");
      doc.setFont("bold");
    }

    const text = typeof part === "string" ? part : part?.text;
    const textArray = doc.splitTextToSize(text, pageWidth - 40); // Adjust the width to fit the page

    textArray?.forEach((line, index) => {
      const textWidth = doc.getTextWidth(line);

      // Move to the next line if the current line exceeds the page width
      if (currentX + textWidth > pageWidth - margin) {
        currentX = margin;
        currentY += lineHeight;
      }

      doc.text(line, currentX, currentY);
      currentX += textWidth;

      // Add a line break after each line (except the last line)
      if (index < textArray?.length - 1) {
        currentX = margin;
        currentY += lineHeight;
      }
    });
  });

  doc.y += 30;

  const sectorTableStyles = {
    fontSize: 9,
  };

  doc.autoTable({
    head: [columnNames],
    body: myNewArray,
    // body: [tableRow],
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
    },
  });

  const instructionData2 =
    "You are directed to take the requisite remedial actions/measures in connection with the report being enclosed, as may be required, forthwith, within 24 hours, and apprise the Authority of the curative action(s) taken in the form of an Action Taken Report. Please note failure to abide by this notice shall not only tantamount breach of contract but would also entitle the Authority to proceed further as per the terms and conditions of agreement.";
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold"); // make font normal
  doc.setFont("bold");
  const instructionDataLines2 = doc.splitTextToSize(
    instructionData2,
    pageWidth - 40
  );
  doc.y += 20;

  doc.setFillColor(240, 240, 240);
  doc.rect(10, doc.y - 9, pageWidth - 20, backgroundHeight, "F");
  doc.text(instructionDataLines2, 15, doc.y);

  doc.y += 35;
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
    body: sortedQuestionArray,
    startY: doc.y,
    didDrawPage: function (data) {
      // Update the doc.y to start at a new position for each page
      doc.y = data.cursor.y;
    },
    didParseCell: function (data) {
      const isLastRow = data.row.index === sortedQuestionArray?.length - 1;
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
