import React from "react";
import { message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// modified
const transformDataForExcel = (data) => {
    const transformedData = [];
    let previousSr = "";

    data.forEach((row) => {
        const lastColumnData = row["Sector / Parking"] || [];
        // Handle empty data case - even if Sector/Parking is missing
        if (lastColumnData?.length === 0) {
            transformedData.push({
              Sr: row["Sr"] !== previousSr ? row["Sr"] : "", // Show Sr only for the first row in the grouping
              Category: row["Category"],
              "Toilets & Tentage Type": row["Toilets & Tentage Type"],
              "Total Allotted Quantity": row["Total Allotted Quantity"] || 0,
              Sector: "",
              AllottedQuantity: "",
              Registered: row["Registered"],
            });
            previousSr = row["Sr"];
        } else {
            lastColumnData?.forEach((sectorData, idx) => {
                transformedData?.push({
                  Sr: idx === 0 ? row["Sr"] : "", // Ensure only the first row shows the serial number
                  Category: idx === 0 ? row["Category"] : "",
                  "Toilets & Tentage Type":
                    idx === 0 ? row["Toilets & Tentage Type"] : "",
                  "Total Allotted Quantity":
                    idx === 0 ? row["Total Allotted Quantity"] : "", // Only show on the first row in the grouping
                  Sector: sectorData[0] || "",
                  AllottedQuantity: sectorData[1] || "",
                  Registered: sectorData[2] || "",
                });
                previousSr = row["Sr"];
            });
        }
    });

    return transformedData;
};


export const VendorDetailsToExcel = async (
    excelData = [],
    fileName = "excel_file",
    dynamicFields = {},
    Total = 0
) => {
    if (excelData?.length === 0) {
        message.error("No data available");
        return;
    }

    const transformedData = transformDataForExcel(excelData);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

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
      { header: "Allotted Quantity", key: "AllottedQuantity", width: 20 },
      { header: "Registered Quantity", key: "Registered", width: 20 },
    ];

    worksheet.columns = columns;

    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FBB900" },
        };
        cell.font = { bold: true, color: { argb: "000000" } };
        cell.alignment = { horizontal: "center" };
    });

    // Populate rows with transformed data
    transformedData.forEach((data) => {
        const row = worksheet.addRow(data);

        row.eachCell((cell) => {
            if (typeof cell.value === "number") {
                cell.alignment = { horizontal: "center" };
            } else {
                cell.alignment = { horizontal: "left" };
            }
        });
    });

    const totalCountRow = worksheet.addRow({});
    totalCountRow.getCell(1).value = `Total Alloted Quantity: ${Total}`;
    totalCountRow.getCell(1).font = { bold: true };
    totalCountRow.getCell(1).alignment = { horizontal: "center" };

    let colIndex = 2;
    Object.keys(dynamicFields).forEach((key) => {
        const value = dynamicFields[key];
        totalCountRow.getCell(colIndex).value = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
        const cell = totalCountRow.getCell(colIndex);
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        colIndex++;
    });

    worksheet.autoFilter = {
        from: worksheet.getCell("A1"),
        to: worksheet.getCell(`E1`),
    };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};