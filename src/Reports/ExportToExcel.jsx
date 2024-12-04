import React from "react";
import { Button, message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportToExcel = ({ excelData = [], fileName = "excel_file" }) => {
  const exportToExcel = async () => {
    if (excelData.length === 0) {
      message.error("Data not available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add column headers based on the keys of the first object
    const columns = Object.keys(excelData[0] || {}).map((key) => ({
      header: key,
      key,
    }));
    worksheet.columns = columns;

    // Add rows from data
    excelData.forEach((data) => worksheet.addRow(data));

    // Add a total count field in the second column of the row
    const totalCountRow = worksheet.addRow({});
    totalCountRow.getCell(2).value = `Total Rows: ${excelData.length}`; // Place in the second column (column B)

    // Style the total count cell
    const totalCountCell = totalCountRow.getCell(2);
    totalCountCell.font = { bold: true };
    totalCountCell.alignment = { horizontal: "center" };

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
