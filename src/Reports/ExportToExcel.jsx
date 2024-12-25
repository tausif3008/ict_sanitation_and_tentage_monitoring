import React from "react";
import { Button, message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportToExcel = ({
  excelData = [],
  fileName = "excel_file",
  dynamicFields = {},
  dynamicArray = [],
}) => {
  const exportToExcel = async () => {
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

    // Define the structure of columns (required for alignment)
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

    // Add rows from the excelData
    excelData?.forEach((data) => {
      const row = worksheet.addRow(data);

      // For each cell in the row, check if it's a number and align accordingly
      row.eachCell((cell) => {
        if (typeof cell.value === "number") {
          cell.alignment = { horizontal: "center" };
        } else {
          cell.alignment = { horizontal: "left" };
        }
      });
    });

    // Add a row with the total count (on the same row as dynamic fields)
    const totalCountRow = worksheet.addRow({});

    // Place "Total Rows" in column A and make it bold
    totalCountRow.getCell(1).value = `Total Rows: ${excelData?.length}`;
    totalCountRow.getCell(1).font = { bold: true }; // Make "Total Rows" bold
    totalCountRow.getCell(1).alignment = { horizontal: "center" };

    let colIndex = 2; // Start from column B for dynamic fields

    // for object
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

    // for array
    dynamicArray?.forEach((item) => {
      totalCountRow.getCell(item?.colIndex).value = `${
        item?.name.charAt(0).toUpperCase() + item?.name.slice(1)
      }: ${item?.value}`;
      const cell = totalCountRow.getCell(item?.colIndex);
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    // Apply filter to the first row (header row) for all columns
    worksheet.autoFilter = {
      from: worksheet.getCell("A1"),
      to: worksheet.getCell(`C1`), // Adjust to the last column you are using (here assuming 3 columns)
    };

    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  };

  return (
    <Button type="primary" onClick={exportToExcel}>
      Download Excel
    </Button>
  );
};

export default ExportToExcel;
