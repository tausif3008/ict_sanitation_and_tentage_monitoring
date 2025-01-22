import React from "react";
import { message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (
  excelData = [],
  fileName = "excel_file",
  dynamicArray = []
) => {
  if (excelData?.length === 0) {
    message.error("No data available");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  worksheet.addRow([]);

  // Calculate the last column dynamically
  const columnCount = Object.keys(excelData?.[0] || {}).length || 1;
  const lastColumn = String.fromCharCode(64 + columnCount);

  // Add a title in the first row
  const titleRow = worksheet.addRow([fileName.toUpperCase()]);
  titleRow.getCell(1).font = { bold: true, size: 16 };
  titleRow.getCell(1).alignment = { horizontal: "center" };
  worksheet.mergeCells(`A2:${lastColumn}2`);

  const columns = Object.keys(excelData?.[0] || {}).map((key) => ({
    key,
  }));
  worksheet.columns = columns;

  // Manually add headers to the second row
  const headerRow = worksheet.getRow(3);
  Object.keys(excelData?.[0] || {}).forEach((key, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = key;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FBB900" }, // Yellow background
    };
    cell.font = { bold: true, color: { argb: "000000" } };
    cell.alignment = { horizontal: "center" };
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

  // for array
  // dynamicArray?.forEach((item) => {
  //   totalCountRow.getCell(item?.colIndex).value = `${
  //     item?.name.charAt(0).toUpperCase() + item?.name.slice(1)
  //   }: ${item?.value}`;
  //   const cell = totalCountRow.getCell(item?.colIndex);
  //   cell.font = { bold: true };
  //   cell.alignment = { horizontal: "center" };
  // });

  if (Array.isArray(dynamicArray)) {
    dynamicArray?.forEach((item) => {
      totalCountRow.getCell(item?.colIndex).value = `${
        item?.name.charAt(0).toUpperCase() + item?.name.slice(1)
      }: ${item?.value}`;
      const cell = totalCountRow.getCell(item?.colIndex);
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });
  } else {
    console.error("dynamicArray is not an array:", dynamicArray);
  }

  // Apply a filter to the second row (header row)
  worksheet.autoFilter = {
    from: worksheet.getCell("A2"),
    to: worksheet.getCell(`C2`), // Adjust to the last column used
  };

  // Save the file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};
