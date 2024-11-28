import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table } from "antd";
import CommonDivider from "../commonComponents/CommonDivider";
import ExportToPDF from "./reportFile";
import ExportToExcel from "./ExportToExcel";
import { getSectorReports } from "./SectorSlice/sectorSlice";
import URLS from "../urils/URLS";
import SectorReportSelectors from "./SectorSlice/sectorSelector";

const SectorWiseReport = () => {
  const [sectors, setSectors] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const dispatch = useDispatch();
  const { SectorReports, loading } = SectorReportSelectors();
  const sectorData = SectorReports?.data?.sectors || [];

  console.log("sectorData", sectorData);

  useEffect(() => {
    if (SectorReports) {
      setSectors(sectorData);
      const totalQty = sectorData?.reduce(
        (acc, sector) => acc + sector.total,
        0
      );
      setTotalQuantity(totalQty);
    }
  }, [SectorReports]);

  useEffect(() => {
    const url = URLS?.sector_wise_report?.path;
    dispatch(getSectorReports(url));
    return () => {};
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
        loading={loading}
        columns={columns}
        dataSource={sectors}
        rowKey="sector_id"
        pagination={{ pageSize: 10 }}
        bordered
        footer={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <strong>Total Sectors: {sectorData?.length}</strong> |{" "}
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
