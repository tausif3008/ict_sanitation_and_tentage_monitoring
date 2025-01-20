import React from "react";
import { message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const VendorDetailsToExcel = async (
  excelData = [],
  fileName = "excel_file",
  Total = 0,
  registerCount
) => {
  if (excelData?.length === 0) {
    message.error("No data available");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  worksheet.addRow([]);
  const fileNameRow = worksheet.addRow([fileName.toUpperCase()]);
  fileNameRow.getCell(1).font = { bold: true, size: 16 };
  fileNameRow.getCell(1).alignment = { horizontal: "center" };
  worksheet.mergeCells(`A2:${String.fromCharCode(64 + 7)}2`);

  // Define columns
  const columns = [
    { header: "Sr", key: "Sr", width: 10 },
    { header: "Category", key: "Category", width: 30 },
    {
      header: "Toilets & Tentage Type",
      key: "Toilets & Tentage Type",
      width: 30,
    },
    {
      header: "Total Allotted Quantity",
      key: "Total Allotted Quantity",
      width: 30,
    },
    { header: "Sector", key: "Sector", width: 20 },
    { header: "Allotted Quantity", key: "Allotted Quantity", width: 20 },
    { header: "Registered Quantity", key: "Registered", width: 20 },
  ];

  // Add headers to the second row
  const headerRow = worksheet.getRow(3);
  columns.forEach((col, index) => {
    headerRow.getCell(index + 1).key = col.key;
    headerRow.getCell(index + 1).value = col.key;
    headerRow.getCell(index + 1).font = { bold: true };
    headerRow.getCell(index + 1).alignment = { horizontal: "center" };
    headerRow.getCell(index + 1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FBB900" },
    };
  });

  let currentRow = 4;

  excelData?.forEach((record) => {
    worksheet.getRow(currentRow).values = [
      record?.Sr,
      record?.Category,
      record?.["Toilets & Tentage Type"],
      record?.["Total Allotted Quantity"],
      record?.["Sector / Parking"][0][0],
      record?.["Sector / Parking"][0][1],
      record?.["Sector / Parking"][0][2],
    ];
    currentRow++;

    // Add additional age data
    record?.["Sector / Parking"].slice(1).forEach((age) => {
      worksheet.getRow(currentRow).values = [
        "",
        "",
        "",
        "",
        age?.[0],
        age?.[1],
        age?.[2],
      ];
      currentRow++;
    });

    // Add total for the person
    const total = record?.["Sector / Parking"].reduce(
      (sum, age) => sum + Number(age?.[1] || 0),
      0
    );
    const totalRegister = record?.["Sector / Parking"].reduce(
      (sum, age) => sum + Number(age?.[2] || 0),
      0
    );
    worksheet.getRow(currentRow).values = [
      "",
      "",
      "",
      "",
      "Total",
      total,
      totalRegister,
    ];
    worksheet.getRow(currentRow).font = { bold: true };
    currentRow++;

    // Add an empty row
    worksheet.addRow();
    currentRow++;
  });

  // Add a summary row after the data
  const totalCountRow = worksheet.addRow({});
  totalCountRow.getCell(6).value = `Total Allotted: ${Total}`;
  totalCountRow.getCell(6).font = { bold: true };
  totalCountRow.getCell(6).alignment = { horizontal: "center" };
  totalCountRow.getCell(7).value = `Total Registered: ${registerCount}`;
  totalCountRow.getCell(7).font = { bold: true };
  totalCountRow.getCell(7).alignment = { horizontal: "center" };

  // Apply filter to the header row
  worksheet.autoFilter = {
    from: worksheet.getCell("A3"),
    to: worksheet.getCell(`G3`),
  };

  // Save the file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};
