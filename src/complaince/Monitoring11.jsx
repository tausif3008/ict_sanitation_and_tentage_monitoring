import React, { useState, useEffect } from "react";
import { Table, Button, Input, message, Modal } from "antd";
import { Link } from "react-router-dom";
import QRCode from "qrcode.react";
import CommonDivider from "../commonComponents/CommonDivider";
import MonitoringReport from "./MonitoringReport";

const { Search } = Input;

const Monitoring = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isAssetList, setIsAssetList] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [isModalVisible, setIsModalVisible] = useState(false); // State for Modal visibility
  const [qrCodeData, setQrCodeData] = useState(""); // State for QR code data
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // State for QR code image URL
  const [assetInfo, setsetAssetInfo] = useState();

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://filemanagement.metaxpay.in:8001/asset-list/"
        );
        const result = await response.json();

        if (response.ok && result.data) {
          const transformedData = result.data.map((item, index) => {
            return {
              key: item.id,
              srNo: index + 1,
              assetsId: item.id,
              dataCreated: item.date_created,
              assetsName: item.asset_name || "N/A",
              assetsCode: item.asset_code || "N/A",
              vendor: item.vendor || "N/A",
              qrCodeUrl: item.qr_code || "", // Add QR code URL
              img: item.asset_image,
            };
          });

          setData(transformedData);
          setFilteredData(transformedData); // Initialize filtered data
        } else {
          message.error(result.message || "Failed to load assets");
        }
      } catch (error) {
        message.error(
          error.message || "An error occurred while fetching the assets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("status") === "success") {
      setSuccessMessage("Asset Registered Successfully");
      setTimeout(() => {
        setSuccessMessage(""); // Hide the message after 3 seconds
      }, 3000);
    }
  }, []);

  const handleSearch = (value) => {
    const filtered = data.filter(
      (item) =>
        item.assetsName.toLowerCase().includes(value.toLowerCase()) ||
        item.assetsCode.toLowerCase().includes(value.toLowerCase()) ||
        item.vendor.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const showQrCode = (record) => {
    setQrCodeData(record.assetsCode); // Set the QR code data (can be the assetsCode or any other data)
    setQrCodeUrl(record.qrCodeUrl); // Set the QR code URL
    setIsModalVisible(true); // Show the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Hide the modal
  };

  const columns = [
    {
      title: "Assets Name",
      dataIndex: "assetsName",
      key: "assetsName",
    },
    {
      title: "Assets Code",
      dataIndex: "assetsCode",
      key: "assetsCode",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => showQrCode(record)}>
            QR
          </Button>
          <Button type="link" onClick={() => setsetAssetInfo(record)}>
            View Monitoring
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {!assetInfo ? (
        <div className="">
          {/* Success Message */}
          {successMessage && (
            <div className="text-center text-green-500 font-bold mb-5">
              {successMessage}
            </div>
          )}

          {!isAssetList && (
            <>
              <CommonDivider label={"Assets Monitoring Listing"} />
              <div className="mb-2 flex justify-between items-center">
                <Search
                  placeholder="Search assets"
                  onSearch={handleSearch}
                  className="w-[300px]"
                />
              </div>
              <Table
                scroll={{ y: 450 }}
                columns={columns}
                bordered
                dataSource={filteredData}
                loading={loading}
                pagination={false}
              />
            </>
          )}
          {/* Replace this with another component/form if needed */}
          {isAssetList && <div>Other Component/Form</div>}

          <Modal
            width={300}
            title="QR Code"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <div className="flex justify-center items-center text-center">
              {qrCodeUrl ? (
                <img
                  src={"http://filemanagement.metaxpay.in:8001" + qrCodeUrl}
                  alt="QR Code"
                  className="w-[200px]"
                />
              ) : (
                <QRCode value={qrCodeData} />
              )}
            </div>
          </Modal>
        </div>
      ) : (
        <div>
          <MonitoringReport
            data={assetInfo}
            setsetAssetInfo={setsetAssetInfo}
          ></MonitoringReport>
        </div>
      )}
    </>
  );
};

export default Monitoring;
