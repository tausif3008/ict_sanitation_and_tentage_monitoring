import React, { useState, useEffect } from "react";
import { Table, Button, Input, message, Modal, Image } from "antd";
import { Link } from "react-router-dom";
import QRCode from "qrcode.react";
import CommonTable from "../commonComponents/CommonTable";
import CommonDivider from "../commonComponents/CommonDivider";

const { Search } = Input;

const AssetsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isAssetList, setIsAssetList] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [isModalVisible, setIsModalVisible] = useState(false); // State for Modal visibility
  const [qrCodeData, setQrCodeData] = useState(""); // State for QR code data
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // State for QR code image URL

  const [assestInfo, setAssestInfo] = useState({});

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://filemanagement.metaxpay.in:8001/asset-list/"
        );
        const result = await response.json();

        if (response.ok && result.data) {
          const transformedData = result.data.map((item, index) => ({
            key: item.id,
            srNo: index + 1,
            assetsId: item.id,
            assetsName: item.asset_name || "N/A",
            assetsCode: item.asset_code || "N/A",
            vendor: item.vendor || "N/A",
            qrCodeUrl:
              "http://filemanagement.metaxpay.in:8001" + item.qr_code || "", // Add QR code URL
          }));
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
          <Button type="link">View</Button>
          <Button type="link">Edit</Button>
          {/* <Button type="link">Delete</Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="">
      {/* Success Message */}
      {successMessage && (
        <div
          style={{
            textAlign: "center",
            color: "green",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {successMessage}
        </div>
      )}

      {!isAssetList && (
        <>
          <CommonDivider
            label={"Assets Listing"}
            compo={
              <Link to="/asset-registration">
                <Button className="bg-orange-300 mb-1">Add New Asset</Button>
              </Link>
            }
          />
          <div className="mb-4 flex justify-between items-center">
            <Search
              placeholder="Search assets"
              onSearch={handleSearch}
              style={{ width: 300 }}
              className="mr-4 p-2"
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30"],
            }}
          />
        </>
      )}
      {/* Replace this with another component/form if needed */}
      {isAssetList && <div>Other Component/Form</div>}

      {/* QR Code Modal */}
      <Modal
        width={300}
        title="QR Code"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          {qrCodeUrl ? (
            <Image
            width={230}
              src={qrCodeUrl}
              alt={qrCodeUrl}
            />
          ) : (
            <QRCode value={qrCodeData} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AssetsList;
