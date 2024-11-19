import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Space, message } from "antd";

import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { basicUrl } from "../../Axios/commonAxios";
import { getVendorReports } from "./vendorslice";
import VendorSelectors from "./vendorSelectors";
import CommonTable from "../../commonComponents/CommonTable";
import { IMAGELIST } from "../../assets/Images/exportImages";

const VendorReports = () => {
  const dispatch = useDispatch();
  const { loading, vendorReports } = VendorSelectors();
  const params = useParams();
  const [excelData, setExcelData] = useState([]);

  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  useEffect(() => {
    if (vendorReports) {
      setVendorDetails((prevDetails) => ({
        ...prevDetails,
        list: vendorReports?.data?.vendors || [],
        pageLength: vendorReports?.data?.paging?.[0]?.length || 0,
        currentPage: vendorReports?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: vendorReports?.data?.paging?.[0]?.totalrecords || 0,
      }));

      const myexcelData = vendorReports?.data?.vendors?.map((data, index) => {
        return {
          sr: index + 1,
          name: data?.name,
          // email: data?.email,
          // phone: data?.phone,
          // address: data?.address,
          // pin: data?.pin,
          // company: data?.company,
          // language: data?.language,
          total: data?.total,
          registered: data?.registered,
          clean: data?.clean,
          unclean: data?.unclean,
        };
      });
      setExcelData(myexcelData);
    }
  }, [vendorReports]);

  useEffect(() => {
    let uri = URLS.vendorReporting.path + "?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    } else {
      uri = URLS.vendorReporting.path;
    }
    dispatch(getVendorReports(basicUrl + uri));
    return () => {};
  }, [params]);

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Registered",
      dataIndex: "registered",
      key: "registered",
    },
    {
      title: "Clean",
      dataIndex: "clean",
      key: "clean",
    },
    {
      title: "Unclean",
      dataIndex: "unclean",
      key: "unclean",
    },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    //   key: "address",
    //   render: (text, record) => {
    //     return `${text}, Pincode -${record?.pin}`;
    //   },
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    // {
    //   title: "Company",
    //   dataIndex: "company",
    //   key: "company",
    // },
  ];

  // excel
  const exportToExcel = () => {
    if (excelData && excelData?.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Report");
      XLSX.writeFile(workbook, "VendorWiseReport.xlsx");
    } else {
      return "";
    }
  };

  // pdf
  const exportToPDF = () => {
    const doc = new jsPDF();
    // const doc = new jsPDF("landscape", undefined, undefined, {
    //   compress: true,
    // });

    // Centered ICT heading
    const ictHeading = "ICT Sanitation and Tentage Monitoring System";
    const pageWidth = doc.internal.pageSize.getWidth();
    const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
    doc.setFontSize(14);
    doc.setFont("bold");
    doc.text(ictHeading, ictX, 10); // Heading position

    // // Image on the Left (Company Logo or similar image)
    const leftImageX = 10; // X position (from the left)
    const leftImageY = 10; // Y position (from the top)
    const leftImageWidth = 30; // Image width (adjust as needed)
    const leftImageHeight = 25; // Image height (adjust as needed)
    doc.addImage(
      `${IMAGELIST?.govt_logo}`,
      "JPEG",
      leftImageX,
      leftImageY,
      leftImageWidth,
      leftImageHeight,
      undefined,
      undefined,
      "FAST" // Adds compression for smaller file size
    );

    // // Image on the Right (Another logo or image)
    const rightImageX = pageWidth - 40; // X position (from the right)
    const rightImageY = 10; // Y position (from the top)
    const rightImageWidth = 30; // Image width (adjust as needed)
    const rightImageHeight = 25; // Image height (adjust as needed)
    doc.addImage(
      `${IMAGELIST?.kumbh}`,
      "JPEG",
      rightImageX,
      rightImageY,
      rightImageWidth,
      rightImageHeight,
      undefined,
      undefined,
      "FAST" // Adds compression for smaller file size
    );

    // Add report title and date on the same line
    const title = "Vendor-Wise Report";
    const date = new Date();
    const dateString = date.toLocaleString(); // Format the date and time

    // Calculate positions for the title and date
    const titleX = 44; // Left align title
    const dateX = pageWidth - doc.getTextWidth(dateString) - 34; // 14 units from the right

    // Add title and date
    doc.setFontSize(12);
    doc.setFont("bold");
    doc.text(title, titleX, 25); // Title position
    doc.setFont("normal");
    doc.setFontSize(10); // Smaller font size for date
    doc.text(dateString, dateX, 25); // Date position

    // Add a horizontal line below the textBetweenImages, but only up to the edges of the images
    const lineStartX = leftImageX + leftImageWidth + 5; // Start after the left image
    const lineEndX = rightImageX - 5; // End before the right image
    doc.line(lineStartX, 30, lineEndX, 30); // x1, y1, x2, y2

    // Table header and content
    doc.autoTable({
      head: [
        [
          "Sr No",
          "Vendor Name",
          // "Email",
          // "Phone",
          // "Address",
          // "Pin code",
          // "Company",
          // "Language",
          "Total",
          "Registered",
          "Clean",
          "Unclean",
        ],
      ],
      body: excelData.map((opt) => [
        opt?.sr,
        opt?.name,
        // opt?.email,
        // opt?.phone,
        // opt?.address,
        // opt?.pin,
        // opt?.company,
        // opt?.language,
        opt?.total,
        opt?.registered,
        opt?.clean,
        opt?.unclean,
      ]),
      startY: 40, // Start after the header and new text
    });

    // Add footer
    const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

    // Save the PDF
    doc.save("Vendor-Wise-Report.pdf");
  };

  return (
    <div>
      <CommonDivider label={"Vendor-Wise Report"} />
      <Space style={{ marginBottom: 16, float: "right" }}>
        <Button
          type="primary"
          onClick={() => {
            if (excelData && excelData?.length > 0) {
              message.success("Downloading excel, it might take some time...");
              exportToExcel();
            } else {
              message.error("Data is not available.");
            }
          }}
        >
          Download Excel
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (excelData && excelData?.length > 0) {
              message.success("Downloading pdf, it might take some time...");
              exportToPDF();
            } else {
              message.error("Data is not available.");
            }
          }}
        >
          Download PDF
        </Button>
      </Space>
      <CommonTable
        loading={loading}
        uri={`vendor-wise-report`}
        columns={columns || []}
        details={vendorDetails || []}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default VendorReports;
