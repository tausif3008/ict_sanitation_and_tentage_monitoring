import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import CommonDivider from "../commonComponents/CommonDivider";
import ExportToPDF from "./reportFile";
import ExportToExcel from "./ExportToExcel";

const SectorWiseReport = () => {
  const [sectors, setSectors] = useState([]);
  const [totalSectors, setTotalSectors] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const response = await axios.post(
          "https://kumbhtsmonitoring.in/php-api/reporting/sector",
          {},
          { headers }
        );

        if (response.data.success) {
          const sectorData = response.data.data.sectors;
          setSectors(sectorData);
          setTotalSectors(sectorData.length);
          const totalQty = sectorData.reduce(
            (acc, sector) => acc + sector.total,
            0
          );
          setTotalQuantity(totalQty);
        } else {
          console.error("Failed to fetch sector data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching sector data:", error);
      }
    };

    fetchSectorData();
  }, []);

  const columns = [
    { title: "Sector Name", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "total", key: "total" },
    { title: "Registered", dataIndex: "registered", key: "registered" },
    { title: "Clean", dataIndex: "clean", key: "clean" },
    { title: "Unclean", dataIndex: "unclean", key: "unclean" },
  ];

  // pdf header
  const pdfHeader = ["Sector Name", "Total", "Registered", "Clean", "Unclean"];

  // pdf data
  const pdfData = sectors?.map((sector) => [
    sector?.name,
    sector?.total,
    sector?.registered,
    sector?.clean,
    sector?.unclean,
  ]);

  return (
    <div style={{ padding: "24px" }}>
      <CommonDivider label={"Sector-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={"Sector-Wise Report"}
            pdfName={"Sector-Wise-Report"}
            headerData={pdfHeader}
            rows={pdfData}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={sectors || []}
            fileName={"Sector-Wise-Report"}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={sectors}
        rowKey="sector_id"
        pagination={{ pageSize: 10 }}
        bordered
        footer={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <strong>Total Sectors: {totalSectors}</strong> |{" "}
              <strong>Total Quantity: {totalQuantity}</strong>
            </span>
            <span></span> {/* Empty span to maintain structure */}
          </div>
        )}
      />
    </div>
  );
};

export default SectorWiseReport;
