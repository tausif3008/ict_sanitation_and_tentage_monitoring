// import React from "react";
// import { message } from "antd";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// // modified
// export const exportToExcel = async (
//   excelData = [],
//   fileName = "excel_file",
//   dynamicFields = {}
// ) => {
//   if (excelData?.length === 0) {
//     message.error("No data available");
//     return;
//   }

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Sheet1");

//   // Define columns based on the first row of data
//   const columns = Object.keys(excelData?.[0] || {}).map((key) => ({
//     header: key,
//     key,
//   }));
//   worksheet.columns = columns;

//   worksheet.getRow(1).eachCell((cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FBB900" }, // Yellow color
//     };
//     cell.font = { bold: true, color: { argb: "000000" } }; // Make header text bold and black
//     cell.alignment = { horizontal: "center" }; // Center-align header text
//   });

//   // Add rows from the excelData
//   excelData?.forEach((data) => {
//     const row = worksheet.addRow(data);

//     // For each cell in the row, check if it's a number and align accordingly
//     row.eachCell((cell) => {
//       if (typeof cell.value === "number") {
//         cell.alignment = { horizontal: "center" };
//       } else {
//         cell.alignment = { horizontal: "left" };
//       }
//     });
//   });

//   // Add a row with the total count (on the same row as dynamic fields)
//   const totalCountRow = worksheet.addRow({});

//   // Place "Total Rows" in column A and make it bold
//   totalCountRow.getCell(1).value = `Total Rows: ${excelData?.length}`;
//   totalCountRow.getCell(1).font = { bold: true }; // Make "Total Rows" bold
//   totalCountRow.getCell(1).alignment = { horizontal: "center" };

//   let colIndex = 2; // Start from column B for dynamic fields

//   // Loop over dynamicFields and add each to the same row, starting from column B
//   Object.keys(dynamicFields).forEach((key) => {
//     const value = dynamicFields[key];
//     totalCountRow.getCell(colIndex).value = `${
//       key.charAt(0).toUpperCase() + key.slice(1)
//     }: ${value}`;
//     const cell = totalCountRow.getCell(colIndex);
//     cell.font = { bold: true };
//     cell.alignment = { horizontal: "center" };
//     colIndex++;
//   });

//   // Apply filter to the first row (header row) for all columns
//   worksheet.autoFilter = {
//     from: worksheet.getCell("A1"),
//     to: worksheet.getCell(`C1`), // Adjust to the last column you are using (here assuming 3 columns)
//   };

//   // Save the file
//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), `${fileName}.xlsx`);
// };

import React from "react";
import { message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (
  excelData = [],
  fileName = "excel_file",
  dynamicFields = {}
) => {
  if (excelData?.length === 0) {
    message.error("No data available");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  worksheet.addRow([]); // This adds a blank row above the title row to create a margin

  // Calculate the last column dynamically
  const columnCount = Object.keys(excelData?.[0] || {}).length || 1; // Default to 1 if no data
  const lastColumn = String.fromCharCode(64 + columnCount); // Convert column index to letter (e.g., 1 -> A, 2 -> B)

  // Add a title in the first row
  const titleRow = worksheet.addRow([fileName.toUpperCase()]);
  titleRow.getCell(1).font = { bold: true, size: 16 }; // Bold and larger font for title
  titleRow.getCell(1).alignment = { horizontal: "center" }; // Center-align text
  // worksheet.mergeCells("A1:D1"); // Merge cells for the title (adjust column range as needed)
  worksheet.mergeCells(`A2:${lastColumn}2`); // Dynamically merge cells for the title

  // worksheet.addRow([]); // This adds a blank row above the title row to create a margin

  // Define the structure of columns (required for alignment)
  const columns = Object.keys(excelData?.[0] || {}).map((key) => ({
    key, // Map data keys to columns
  }));
  worksheet.columns = columns;

  // Manually add headers to the second row
  const headerRow = worksheet.getRow(3);
  Object.keys(excelData?.[0] || {}).forEach((key, index) => {
    const cell = headerRow.getCell(index + 1); // +1 because ExcelJS column index starts at 1
    cell.value = key; // Use key as the header
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FBB900" }, // Yellow background
    };
    cell.font = { bold: true, color: { argb: "000000" } }; // Bold and black text
    cell.alignment = { horizontal: "center" }; // Center-align text
  });

  headerRow.commit(); // Commit changes to the second row

  // Add data rows starting from the third row
  excelData?.forEach((data) => {
    const row = worksheet.addRow(data);

    // Style each cell in the data row
    row.eachCell((cell) => {
      if (typeof cell.value === "number") {
        cell.alignment = { horizontal: "center" };
      } else {
        cell.alignment = { horizontal: "left" };
      }
    });
  });

  // Add a summary row after the data
  const totalCountRow = worksheet.addRow({});
  totalCountRow.getCell(1).value = `Total Rows: ${excelData?.length}`;
  totalCountRow.getCell(1).font = { bold: true };
  totalCountRow.getCell(1).alignment = { horizontal: "center" };

  let colIndex = 2; // Start from column B for dynamic fields
  Object.keys(dynamicFields).forEach((key) => {
    const value = dynamicFields[key];
    totalCountRow.getCell(colIndex).value = `${
      key.charAt(0).toUpperCase() + key.slice(1)
    }: ${value}`;
    const cell = totalCountRow.getCell(colIndex);
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
    colIndex++;
  });

  // Apply a filter to the second row (header row)
  worksheet.autoFilter = {
    from: worksheet.getCell("A2"),
    to: worksheet.getCell(`C2`), // Adjust to the last column used
  };

  // Save the file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};
