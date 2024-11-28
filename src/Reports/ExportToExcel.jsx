import React from "react";
import { Button, message } from "antd";
import * as XLSX from "xlsx";

const ExportToExcel = ({ excelData = [], fileName = "excel file" }) => {
  const exportToExcel = async () => {
    if (excelData && excelData?.length > 0) {
      //   const excelList = excelData?.map((data) => {
      //     // const { image, answer, ...rest } = data;
      //     // const modifiedAnswer = answer === "1" ? "Yes" : "No";
      //     return {data };
      //   });
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `${fileName}`);
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } else {
      message.error("Data not available");
      return "";
    }
  };
  return (
    <Button type="primary" onClick={exportToExcel}>
      Download Excel
    </Button>
  );
};

export default ExportToExcel;
