import React, { useState, useEffect } from "react";
import { Button, Table, Image, Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment"; // For date formatting
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getData } from "../Fetch/Axios";
import URLS from "../urils/URLS";
import { IMAGELIST } from "../assets/Images/exportImages";

const MonitoringReport = () => {
  const [details, setDetails] = useState({ list: [] });
  const [loading, setLoading] = useState(true);
  const [assetDetails, setAssetDetails] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  console.log("details", details);

  // Fetch monitoring details from the API
  const getDetails = async () => {
    setLoading(true);
    const uri = `${URLS.monitoringDetails.path}${params.id}`;
    const extraHeaders = { "x-api-version": URLS.monitoringDetails.version };
    const res = await getData(uri, extraHeaders);

    if (res?.success && res.data?.monitoring?.length > 0) {
      const monitoringData = res.data.monitoring[0];
      setDetails({ list: monitoringData.questions || [] });

      setAssetDetails({
        sector_name: monitoringData.sector_name || "N/A",
        circle_name: monitoringData.circle_name || "N/A",
        latitude: monitoringData.latitude || "N/A",
        longitude: monitoringData.longitude || "N/A",
        remark: monitoringData.remark || "No remarks",
        photo: monitoringData.photo !== "N" ? monitoringData.photo : null,
        asset_type_name: monitoringData.asset_type_name || "",
        qrCode: monitoringData.qr_code || null,
        // qrCode: monitoringData.qr_code !== "N" ? monitoringData.qr_code : null,
        unit_no: monitoringData.unit_no || "N/A", // Added Unit Number
        submitted_date: monitoringData.updated_at // Added Submitted Date
          ? moment(monitoringData.updated_at).format("YYYY-MM-DD HH:mm:ss")
          : "N/A",
      });
    } else {
      setDetails({ list: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    getDetails();
  }, [params]);

  // Table columns definition
  const dateColumns = [
    {
      title: "Sr No",
      dataIndex: "question_id",
      key: "question_id",
      width: "8%",
    },
    {
      title: "Question (EN)",
      dataIndex: "question_en",
      key: "question_en",
    },
    {
      title: "Question (HI)",
      dataIndex: "question_hi",
      key: "question_hi",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image !== "N" ? (
          <Image
            width={130}
            src={`${URLS.baseUrl}/${image}`}
            alt="Question Image"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      render: (answer) => (
        <div
          className={`p-1 px-3 rounded-md flex w-fit text-xs ${
            answer === "1"
              ? "bg-green-500"
              : answer === "0"
              ? "bg-orange-500"
              : "bg-blue-200"
          }`}
        >
          {answer === "1" ? "Yes" : answer === "0" ? "No" : "Maintenance"}
        </div>
      ),
    },
  ];
  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   // const doc = new jsPDF("landscape", undefined, undefined, {
  //   //   compress: true,
  //   // });

  //   // Centered ICT heading
  //   const ictHeading = "ICT Sanitation and Tentage Monitoring System";
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const ictX = (pageWidth - doc.getTextWidth(ictHeading)) / 2; // Center the heading
  //   doc.setFontSize(14);
  //   doc.setFont("bold");
  //   doc.text(ictHeading, ictX, 10); // Heading position

  //   // // Image on the Left (Company Logo or similar image)
  //   const leftImageX = 10; // X position (from the left)
  //   const leftImageY = 10; // Y position (from the top)
  //   const leftImageWidth = 30; // Image width (adjust as needed)
  //   const leftImageHeight = 25; // Image height (adjust as needed)
  //   doc.addImage(
  //     `${IMAGELIST?.govt_logo}`,
  //     "JPEG",
  //     leftImageX,
  //     leftImageY,
  //     leftImageWidth,
  //     leftImageHeight,
  //     undefined,
  //     undefined,
  //     "FAST" // Adds compression for smaller file size
  //   );

  //   // // Image on the Right (Another logo or image)
  //   const rightImageX = pageWidth - 40; // X position (from the right)
  //   const rightImageY = 10; // Y position (from the top)
  //   const rightImageWidth = 30; // Image width (adjust as needed)
  //   const rightImageHeight = 25; // Image height (adjust as needed)
  //   doc.addImage(
  //     `${IMAGELIST?.govt_logo}`,
  //     "JPEG",
  //     rightImageX,
  //     rightImageY,
  //     rightImageWidth,
  //     rightImageHeight,
  //     undefined,
  //     undefined,
  //     "FAST" // Adds compression for smaller file size
  //   );

  //   // Add report title and date on the same line
  //   const title = "Vendor-Wise Report";
  //   const date = new Date();
  //   const dateString = date.toLocaleString(); // Format the date and time

  //   // Calculate positions for the title and date
  //   const titleX = 44; // Left align title
  //   const dateX = pageWidth - doc.getTextWidth(dateString) - 34; // 14 units from the right

  //   // Add title and date
  //   doc.setFontSize(12);
  //   doc.setFont("bold");
  //   doc.text(title, titleX, 25); // Title position
  //   doc.setFont("normal");
  //   doc.setFontSize(10); // Smaller font size for date
  //   doc.text(dateString, dateX, 25); // Date position

  //   // Add a horizontal line below the textBetweenImages, but only up to the edges of the images
  //   const lineStartX = leftImageX + leftImageWidth + 5; // Start after the left image
  //   const lineEndX = rightImageX - 5; // End before the right image
  //   doc.line(lineStartX, 30, lineEndX, 30); // x1, y1, x2, y2

  //   // Add a horizontal line below the header
  //   doc.line(10, 30, 200, 30); // x1, y1, x2, y2

  //   // Table for dynamic fields (label-value pairs)
  //   const tableData = [
  //     ["Circle Name", `: ${assetDetails?.circle_name || ""}`],
  //     ["Sector Name", `: ${assetDetails?.sector_name || ""}`],
  //     ["Latitude", `: ${assetDetails?.latitude || ""}`],
  //     ["Longitude", `: ${assetDetails?.longitude || ""}`],
  //     [
  //       "Submitted  Date",
  //       `: ${
  //         moment(assetDetails?.updated_at).format("YYYY-MM-DD HH:mm:ss") || ""
  //       }`,
  //     ],
  //     ["Unit Number", `: ${assetDetails?.unit_no || ""}`],
  //     ["Remark", `: ${assetDetails?.remark || ""}`],
  //     // Add more fields as needed
  //   ];

  //   const margin = 10; // Define margin for the table

  //   // Add the first table (dynamic fields)
  //   doc.autoTable({
  //     startY: 35, // Start the table after the header
  //     body: tableData, // Table body
  //     theme: "plain", // Table style
  //     styles: {
  //       fontSize: 12,
  //       cellPadding: 3,
  //     },
  //     margin: { left: margin, right: margin }, // Set margins
  //   });

  //   // Get the position after the first table
  //   const firstTableHeight = doc.lastAutoTable.finalY + 10; // Get the Y position after the first table

  //   // Row data for the second table (question-answer data)
  //   const row = details?.list?.map((data, index) => {
  //     return [
  //       `${index + 1}`,
  //       `${data?.question_en}`,
  //       // `${data?.question_hi}`,
  //       `${data?.answer === "1" ? "Yes" : "No"}`,
  //     ];
  //   });

  //   // Table header and content
  //   doc.autoTable({
  //     head: [["Sr", "Question (EN)", "Answer"]],
  //     // head: [["Sr no", "Question (EN)", "Question (HI)", "Answer"]],
  //     body: row || [],
  //     startY: 40, // Start after the header and new text
  //   });

  //   // Add footer
  //   const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
  //   const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
  //   const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

  //   doc.setFontSize(10);
  //   doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

  //   // Save the PDF
  //   doc.save("MonitoringReport.pdf");
  // };

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
      `${IMAGELIST?.govt_logo}`,
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
    const title = "Monitoring Report";
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

    // Table for dynamic fields (label-value pairs)
    const tableData = [
      ["Circle Name", `: ${assetDetails?.circle_name || ""}`],
      ["Sector Name", `: ${assetDetails?.sector_name || ""}`],
      ["Latitude", `: ${assetDetails?.latitude || ""}`],
      ["Longitude", `: ${assetDetails?.longitude || ""}`],
      [
        "Submitted  Date",
        `: ${
          moment(assetDetails?.updated_at).format("YYYY-MM-DD HH:mm:ss") || ""
        }`,
      ],
      ["Unit Number", `: ${assetDetails?.unit_no || ""}`],
      ["Remark", `: ${assetDetails?.remark || ""}`],
      // Add more fields as needed
    ];

    // Add the first table (dynamic fields)
    doc.autoTable({
      startY: 40, // Start the table after the header
      body: tableData, // Table body
      theme: "plain", // Table style
      styles: {
        fontSize: 12,
        cellPadding: 3,
      },
      margin: { left: 10, right: 10 }, // Set margins
    });

    // Table header and content
    doc.autoTable({
      head: [["Sr", "Question (EN)", "Answer"]],
      // head: [["Sr", "Question (EN)", "Question (HI)", "Answer"]],
      body: details?.list?.map((opt, index) => [
        index + 1,
        opt?.question_en,
        // opt?.question_hi,
        opt?.answer === "1" ? "Yes" : "No",
      ]),
      startY: 120, // Start after the header and new text
    });

    // Add footer
    const footerText1 = "Maha Kumbh Mela 2025, Prayagraj Mela Authority.";
    const footerX = (pageWidth - doc.getTextWidth(footerText1)) / 2; // Center footer
    const footerY = doc.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    doc.setFontSize(10);
    doc.text(footerText1, footerX, footerY + 5); // Adjust for footer spacing

    // Save the PDF
    doc.save("Monitoring-Report.pdf");
  };

  return (
    <div>
      <div className="mx-auto p-3 pb-3 bg-white shadow-md rounded-lg w-full mt-3">
        <div className="flex items-center gap-2 font-semibold">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/monitoring")}
          >
            <ArrowLeftOutlined />
          </Button>
          <div className="text-d9 text-2xl w-full flex items-end">
            <span className="mr-1">Monitoring Report For:</span>
            <span className="text-blue-500">
              {assetDetails?.asset_type_name}
            </span>
          </div>
          <div>
            <Button type="primary" onClick={exportToPDF}>
              Download PDF
            </Button>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <div className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              Circle:
              <span className="font-semibold">{assetDetails?.circle_name}</span>
            </div>
            <div>
              Sector:
              <span className="font-semibold">{assetDetails?.sector_name}</span>
            </div>
            <div>
              Latitude:
              <span className="font-semibold">{assetDetails?.latitude}</span>
            </div>
            <div>
              Longitude:
              <span className="font-semibold">{assetDetails?.longitude}</span>
            </div>
            <div>
              Unit Number:
              <span className="font-semibold">{assetDetails?.unit_no}</span>
            </div>
            <div>
              Submitted Date:
              <span className="font-semibold">
                {moment(assetDetails?.submitted_date).format(
                  "DD-MMM-YYYY  hh:mm A"
                )}
              </span>
            </div>
            <div>
              Remark:
              <span className="font-semibold">{assetDetails?.remark}</span>
            </div>
          </div>

          <div className="flex justify-between mt-2 mb-3">
            <div className="flex flex-col text-center font-semibold">
              <span>QR Code</span>
              {assetDetails?.qrCode ? (
                <Image
                  width={130}
                  src={`${URLS.baseUrl}/${assetDetails?.qrCode}`}
                  alt="QR Code"
                />
              ) : (
                <span>No QR Code Available</span>
              )}
            </div>
            <div className="flex flex-col text-center font-semibold">
              <span>Asset Image</span>
              {assetDetails?.photo ? (
                <Image
                  width={125}
                  height={125}
                  src={`${URLS.baseUrl}/${assetDetails?.photo}`}
                  alt="Asset"
                />
              ) : (
                <span>No Image Available</span>
              )}
            </div>
          </div>
        </div>
        {details?.list?.length ? (
          <>
            <Table
              columns={dateColumns || []}
              dataSource={details?.list}
              pagination={false}
              scroll={{ x: 1000, y: 350 }}
              bordered
              className="rounded-none"
              loading={loading}
            />
          </>
        ) : (
          <div className="mt-3 font-semibold text-orange-500 text-center">
            No Report Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringReport;
