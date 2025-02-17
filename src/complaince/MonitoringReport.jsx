import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Image, Divider } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment"; // For date formatting

import { getData } from "../Fetch/Axios";
import URLS from "../urils/URLS";
import CoordinatesMap from "../commonComponents/map/map";
import { DownloadPDF } from "./monitoringReportpdf";
import MonitoringEngPdf from "./monitoringEngPdf";
import ExportToExcel from "../Reports/ExportToExcel";

const MonitoringReport = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assetDetails, setAssetDetails] = useState({});
  const [excelData, setExcelData] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const contentRef = useRef();
  const location = useLocation();
  const record = location.state?.record;

  const ImageUrl = localStorage.getItem("ImageUrl") || "";

  // Fetch monitoring details from the API
  const getDetails = async () => {
    setLoading(true);
    const uri = `${URLS.monitoringDetails.path}${params.id}`;
    const extraHeaders = { "x-api-version": URLS.monitoringDetails.version };
    const res = await getData(uri, extraHeaders);

    if (res?.success && res.data?.monitoring?.length > 0) {
      const monitoringData = res.data.monitoring[0];
      const myexcelData = monitoringData.questions
        // ?.filter((item) => item?.answer === "0")
        // ?.filter((item) => item?.answer != "N" && item?.answer != "1")
        ?.filter((item) => item?.answer !== "N")
        ?.map((data, index) => {
          return {
            sr: index + 1,
            question_en: data?.question_en,
            question_hi: data?.question_hi,
            description: data?.description,
            answer:
              data?.answer === "1"
                ? "Yes"
                : data?.answer === "0"
                ? "No"
                : "Maintenance",
            image: data?.image,
          };
        });
      setDetails(myexcelData);

      // Excel data
      const myexcelDatas = monitoringData?.questions
        // ?.filter((item) => item?.answer === "0")
        ?.filter((item) => item?.answer !== "N")
        ?.map((data, index) => {
          return {
            Sr: index + 1,
            "Question (English)": data?.question_en,
            "Question (Hindi)": data?.question_hi,
            Description: data?.description,
            Answer:
              data?.answer === "1"
                ? "Yes"
                : data?.answer === "0"
                ? "No"
                : "Maintenance",
          };
        });
      setExcelData(myexcelDatas);

      setAssetDetails({
        asset_main_type_id: monitoringData?.asset_main_type_id,
        asset_main_type_name: monitoringData?.asset_main_type_name || "N/A",
        vendor_name: monitoringData?.vendor_name || "N/A",
        sector_name: monitoringData?.sector_name || null,
        circle_name: monitoringData?.circle_name || "N/A",
        latitude: monitoringData?.latitude || "N/A",
        longitude: monitoringData?.longitude || "N/A",
        remark: monitoringData?.remark || "No remarks",
        photo: monitoringData?.photo !== "N" ? monitoringData?.photo : null,
        asset_type_name: monitoringData?.asset_type_name || "",
        qrCode: monitoringData?.qr_code || null,
        code: monitoringData?.code || null,
        plot_no: monitoringData?.plot_no || null,
        mela_road_name: monitoringData?.mela_road_name || null,
        mela_patri_name: monitoringData?.mela_patri_name || null,
        parking_name: monitoringData?.parking_name || null,
        sanstha_name_hi: monitoringData?.sanstha_name_hi || null,
        smscount: monitoringData?.smscount || null,
        vendor_phone: monitoringData?.vendor_phone || null,
        unit_no: monitoringData?.unit_no || "N/A",
        submitted_date: monitoringData?.updated_at
          ? moment(monitoringData?.updated_at).format("YYYY-MM-DD HH:mm:ss")
          : "N/A",
      });
    } else {
      setDetails([]);
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
      dataIndex: "sr",
      key: "sr",
      width: "5%",
    },
    {
      title: "Question (EN)",
      dataIndex: "question_en",
      key: "question_en",
    },
    // {
    //   title: "Question (HI)",
    //   dataIndex: "question_hi",
    //   key: "question_hi",
    // },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image !== "N" ? (
          <Image width={130} src={`${ImageUrl}${image}`} alt="Question Image" />
        ) : (
          "-"
        ),
      width: "15%",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      render: (answer) => (
        <div
          className={`p-1 px-3 rounded-md flex w-fit text-xs ${
            answer === "Yes"
              ? "bg-green-500"
              : answer === "No"
              ? "bg-orange-500"
              : "bg-blue-200"
          }`}
        >
          {answer}
        </div>
      ),
      width: "10%",
    },
  ];

  // download pdf
  const downloadPDF = () => {
    DownloadPDF({ assetDetails, details });
  };

  // pdf header
  const pdfHeader = ["Sr no", "Question", "Answer"];

  // pdf data
  const pdfData = details?.map((opt, index) => [
    index + 1,
    opt?.question_en,
    opt?.answer === "Yes" ? "Yes" : "No",
  ]);

  return (
    <div>
      <div className="mx-auto p-3 pb-3 bg-white shadow-md rounded-lg w-full mt-3">
        <div className="flex items-center gap-2 font-semibold">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              navigate(`/monitoring`, {
                state: {
                  key: "monitoring",
                  record: record,
                },
              });
            }}
          >
            <ArrowLeftOutlined />
          </Button>
          <div className="text-d9 text-2xl w-full flex items-end">
            <span className="mr-1">Monitoring Report For:</span>
            <span className="text-blue-500">
              {assetDetails?.asset_type_name}
            </span>
          </div>
          {/* <Button type="primary" onClick={downloadPDF}>
              Download PDF
            </Button> */}
          <MonitoringEngPdf
            titleName={`Monitoring Report`}
            pdfName={`Monitoring Report`}
            headerData={pdfHeader || []}
            rows={pdfData || []}
            tableObject={assetDetails || {}}
          />
          <ExportToExcel
            excelData={excelData || []}
            fileName={`Monitoring Report`}
          />
        </div>
        <Divider className="bg-d9 h-2/3 mt-1" />
        <div className="mt-3" ref={contentRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[40%,40%,20%]">
            <table
              className="table-auto w-full text-left border-collapse border-none" // Apply border-none to table
            >
              <tbody>
                <tr>
                  <td className="font-semibold w-[40%] border-0">Category</td>
                  <td className="border-0">
                    : {assetDetails?.asset_main_type_name || "NA"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold w-[40%] border-0">Type</td>
                  <td className="border-0">
                    : {assetDetails?.asset_type_name || "NA"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    Vendor Name
                  </td>
                  <td className="border-0">
                    : {assetDetails?.vendor_name || "NA"}
                  </td>
                </tr>
                {assetDetails?.sector_name && (
                  <tr>
                    <td className="font-semibold w-[40%] border-0">Sector</td>
                    <td className="border-0">
                      : {assetDetails?.sector_name || "NA"}
                    </td>
                  </tr>
                )}
                {assetDetails?.parking_name && (
                  <tr>
                    <td className="font-semibold w-[40%] border-0">
                      Parking Name
                    </td>
                    <td className="border-0">
                      : {assetDetails?.parking_name || "NA"}
                    </td>
                  </tr>
                )}
                {/* tentage */}
                {assetDetails?.asset_main_type_id === "2" && (
                  <>
                    <tr>
                      <td className="font-semibold w-[40%] border-0">
                        Sanstha Name
                      </td>
                      <td className="border-0">
                        : {assetDetails?.sanstha_name_hi || "NA"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold w-[40%] border-0">
                        Mela Patri Name
                      </td>
                      <td className="border-0">
                        : {assetDetails?.mela_patri_name || "NA"}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <table className="table-auto w-full text-left border-collapse border-none">
              <tbody>
                <tr>
                  <td className="font-semibold w-[40%] border-0">Latitude</td>
                  <td className="border-0">: {` ${assetDetails?.latitude}`}</td>
                </tr>
                <tr>
                  <td className="font-semibold w-[40%] border-0">Longitude</td>
                  <td className="border-0">
                    : {` ${assetDetails?.longitude}`}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {assetDetails?.asset_main_type_id === "2"
                      ? "TAF ID"
                      : "PTC ID"}
                  </td>
                  <td className="border-0">
                    :{" "}
                    {`${assetDetails?.code || "NA"}-${
                      assetDetails?.unit_no || "NA"
                    }`}
                  </td>
                </tr>
                {assetDetails?.asset_main_type_id === "2" && (
                  <tr>
                    <td className="font-semibold w-[40%] border-0">
                      Mela Road Name
                    </td>
                    <td className="border-0">
                      : {assetDetails?.mela_road_name || "NA"}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    Submitted Date
                  </td>
                  <td className="border-0">
                    :
                    {assetDetails?.submitted_date
                      ? ` ${moment(assetDetails?.submitted_date).format(
                          "DD-MMM-YYYY hh:mm A"
                        )}`
                      : "NA"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold w-[40%] border-0">Remark</td>
                  <td className="border-0">
                    :{` ${assetDetails?.remark || "NA"}`}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="grid md:grid-cols-2">
              <div className="w-full">
                <div>Asset Image</div>
                {assetDetails?.photo ? (
                  <Image
                    width={125}
                    height={125}
                    src={`${ImageUrl}${assetDetails?.photo}`}
                    alt="Asset"
                  />
                ) : (
                  <span>No Image Available</span>
                )}
              </div>
              <div className="flex justify-center items-center w-full">
                <CoordinatesMap
                  coordinates={[
                    assetDetails?.longitude,
                    assetDetails?.latitude,
                  ]}
                  showLocation={false}
                />
              </div>
            </div>
          </div>
        </div>
        {details?.length ? (
          <>
            <Table
              columns={dateColumns || []}
              dataSource={details || []}
              pagination={false}
              scroll={{ x: 1000, y: 350 }}
              bordered
              className="rounded-none mt-2"
              loading={loading}
            />
          </>
        ) : (
          <div className="mt-3 font-semibold text-orange-500 text-center">
            Compliance completed successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringReport;
