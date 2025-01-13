import React from "react";
import { Button, message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportToExcel = ({
  excelData = [],
  fileName = "excel_file",
  dynamicFields = {},
  dynamicArray = [],
  columnProperties = [],
}) => {
  const exportToExcel = async () => {
    if (excelData?.length === 0) {
      message.error("No data available");
      return;
    }

    // const columnProperties = [
    //   { columnIndex: 6, lowerColor: "green", higherColor: "red" },
    //   { columnIndex: 10, lowerColor: "red", higherColor: "green" },
    //   { columnIndex: 12, lowerColor: "red", higherColor: "green" },
    //   // You can add more column-specific properties here
    // ];

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

      // For each cell in the row, check if it's a percentage or a number and align accordingly
      row.eachCell((cell, cellIndex) => {
        let value = cell.value;
        let color = "";

        // Check if the cell contains a percentage
        if (
          typeof value === "string" &&
          value.includes("%") &&
          columnProperties.includes(cellIndex)
        ) {
          console.log("cellIndex", cellIndex);
          const percentageValue = parseFloat(value.replace("%", "").trim()); // Remove '%' and convert to number

          // Apply center alignment for percentages
          cell.alignment = { horizontal: "center" };

          // Apply color based on percentage value
          if (percentageValue === 100) {
            color = "FF00FF00"; // Green for 100%
          } else if (percentageValue === 0) {
            color = "FFFF0000"; // Red for 0%
          } else {
            // Gradient color in between (can be adjusted)
            const redIntensity = Math.round((100 - percentageValue) * 2.55); // Red intensity decreases as percentage increases
            const greenIntensity = Math.round(percentageValue * 2.55); // Green intensity increases as percentage increases
            // Convert to ARGB format: FF + Red + Green + Blue
            color = `FF${redIntensity
              .toString(16)
              .padStart(2, "0")}${greenIntensity
              .toString(16)
              .padStart(2, "0")}00`;
          }

          // Set the background color using ARGB value
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color },
          };
        } else if (typeof value === "number" || value.includes("%")) {
          // Apply left alignment for other types of data
          cell.alignment = { horizontal: "center" };
        } else {
          // Apply left alignment for other types of data
          cell.alignment = { horizontal: "left" };
        }
      });
    });

    // excelData?.forEach((data) => {
    //   const row = worksheet.addRow(data);

    //   // For each cell in the row, check if it's a percentage or a number and align accordingly
    //   row.eachCell((cell, colIndex) => {
    //     let value = cell.value;
    //     let color = "";

    //     // Find the column properties based on column index
    //     const columnProperty = columnProperties.find(
    //       (prop) => prop.columnIndex === colIndex + 1
    //     ); // 1-based index

    //     // Check if the column has specific formatting properties
    //     if (columnProperty) {
    //       // Check if the cell contains a percentage
    //       if (typeof value === "string" && value.includes("%")) {
    //         const percentageValue = parseFloat(value.replace("%", "").trim()); // Remove '%' and convert to number

    //         // Apply center alignment for percentages
    //         cell.alignment = { horizontal: "center" };

    //         // Apply color based on percentage value
    //         if (percentageValue === 100) {
    //           color = columnProperty.lowerColor; // Apply lower color (green)
    //         } else if (percentageValue === 0) {
    //           color = columnProperty.higherColor; // Apply higher color (red)
    //         } else {
    //           // In between: Gradient color from lowerColor to higherColor (you can customize this logic)
    //           const redIntensity = Math.round((100 - percentageValue) * 2.55); // Red intensity decreases as percentage increases
    //           const greenIntensity = Math.round(percentageValue * 2.55); // Green intensity increases as percentage increases

    //           // Combine the color intensities
    //           color = `rgb(${redIntensity}, ${greenIntensity}, 0)`; // You can modify this logic for gradient coloring
    //         }

    //         // Set the background color using the calculated color
    //         cell.fill = {
    //           type: "pattern",
    //           pattern: "solid",
    //           fgColor: { rgb: color }, // Use the calculated color here
    //         };
    //       } else {
    //         // Apply left alignment for non-percentage cells
    //         cell.alignment = { horizontal: "left" };
    //       }
    //     } else {
    //       // If no column-specific properties exist, apply default alignment
    //       cell.alignment = { horizontal: "left" };
    //     }
    //   });
    // });

    // excelData?.forEach((data) => {
    //   const row = worksheet.addRow(data);

    //   // For each cell in the row, check if it's a number and align accordingly
    //   row.eachCell((cell) => {
    //     if (typeof cell.value === "number") {
    //       cell.alignment = { horizontal: "center" };
    //     } else {
    //       cell.alignment = { horizontal: "left" };
    //     }
    //   });
    // });

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
