import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Space } from "antd";
import * as XLSX from "xlsx";
import CommonDivider from "../commonComponents/CommonDivider";
import ExportToPDF from "./reportFile";

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sectors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sector Report");
    XLSX.writeFile(workbook, "SectorWiseReport.xlsx");
  };

  return (
    <div style={{ padding: "24px" }}>
      <CommonDivider label={"Sector-Wise Report"} />
      <Space style={{ marginBottom: 16, float: "right" }}>
        <Button type="primary" onClick={exportToExcel}>
          Download Excel
        </Button>
        <ExportToPDF
          titleName={"Sector-Wise Report"}
          pdfName={"Sector-Wise Report"}
          rows={sectors?.map((sector) => [
            sector?.name,
            sector?.total,
            sector?.registered,
            sector?.clean,
            sector?.unclean,
          ])}
          headerData={[
            "Sector Name",
            "Total",
            "Registered",
            "Clean",
            "Unclean",
          ]}
        />
        ;
      </Space>
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
