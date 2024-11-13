import React, { useState, useEffect } from "react";
import { Button, Table, Image, Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getData } from "../Fetch/Axios";
import URLS from "../urils/URLS";
import moment from "moment"; // For date formatting

const MonitoringReport = () => {
  const [details, setDetails] = useState({ list: [] });
  const [loading, setLoading] = useState(true);
  const [assetDetails, setAssetDetails] = useState({});
  const params = useParams();
  const navigate = useNavigate();

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
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <div className="mt-3">
          <div className="flex gap-1 flex-col">
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
              Remark:
              <span className="font-semibold">{assetDetails?.remark}</span>
            </div>
            <div>
              Submitted Date:
              <span className="font-semibold">
                {assetDetails?.submitted_date}
              </span>
              {/* Display Submitted Date */}
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
