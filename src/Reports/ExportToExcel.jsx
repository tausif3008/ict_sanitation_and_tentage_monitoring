import React from "react";
import { Button, message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportToExcel = ({ excelData = [], fileName = "excel_file" }) => {
  const exportToExcel = async () => {
    if (excelData?.length === 0) {
      message.error("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const columns = Object.keys(excelData[0] || {})?.map((key) => ({
      header: key,
      key,
    }));
    worksheet.columns = columns;

    excelData?.forEach((data) => worksheet.addRow(data));

    const totalCountRow = worksheet.addRow({});
    totalCountRow.getCell(2).value = `Total Rows: ${excelData?.length}`; // Place in the second column (column B)

    const totalCountCell = totalCountRow.getCell(2);
    totalCountCell.font = { bold: true };
    totalCountCell.alignment = { horizontal: "center" };

    worksheet.autoFilter = {
      from: worksheet.getCell("B1"), // Set filter on the second column (Column B)
      to: worksheet.getCell("B1"), // Apply filter only to Column B
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
