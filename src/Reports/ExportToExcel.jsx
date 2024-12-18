import React from "react";
import { Button, message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// dynamicFields={{
//   Total: total,
//   "Register Unit": totalRegistered,
//   Clean: totalClean,
//   Unclean: totalUnclean,
// }}

const ExportToExcel = ({
  excelData = [],
  fileName = "excel_file",
  dynamicFields = {},
}) => {
  const exportToExcel = async () => {
    if (excelData?.length === 0) {
      message.error("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Define columns based on the first row of data
    const columns = Object.keys(excelData[0] || {}).map((key) => ({
      header: key,
      key,
    }));
    worksheet.columns = columns;

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FBB900" }, // Yellow color
      };
      cell.font = { bold: true, color: { argb: "000000" } }; // Make header text bold and black
      cell.alignment = { horizontal: "center" }; // Center-align header text
    });

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

    // Loop over dynamicFields and add each to the same row, starting from column B
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
