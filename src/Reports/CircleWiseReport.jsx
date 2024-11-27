import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography } from "antd";
import "jspdf-autotable";
import CommonDivider from "../commonComponents/CommonDivider";
import ExportToPDF from "./reportFile";
import ExportToExcel from "./ExportToExcel";

const { Title } = Typography;

const CircleWiseReport = () => {
  const [circles, setCircles] = useState([]);
  const [totalCircles, setTotalCircles] = useState(0);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalClean, setTotalClean] = useState(0);
  const [totalUnclean, setTotalUnclean] = useState(0);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchCircleData = async () => {
      try {
        const response = await axios.post(
          "https://kumbhtsmonitoring.in/php-api/reporting/circle", // Updated API endpoint
          {},
          { headers }
        );

        if (response.data.success) {
          const circleData = response.data.data.circles;
          setCircles(circleData);
          setTotalCircles(circleData.length);
          const totalReg = circleData.reduce(
            (acc, circle) => acc + circle.registered,
            0
          );
          const totalClean = circleData.reduce(
            (acc, circle) => acc + circle.clean,
            0
          );
          const totalUnclean = circleData.reduce(
            (acc, circle) => acc + circle.unclean,
            0
          );
          setTotalRegistered(totalReg);
          setTotalClean(totalClean);
          setTotalUnclean(totalUnclean);
        } else {
          console.error("Failed to fetch circle data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching circle data:", error);
      }
    };

    fetchCircleData();
  }, []);

  const columns = [
    { title: "Circle Name", dataIndex: "name", key: "name" },
    { title: "Registered", dataIndex: "registered", key: "registered" },
    { title: "Clean", dataIndex: "clean", key: "clean" },
    { title: "Unclean", dataIndex: "unclean", key: "unclean" },
  ];

  // pdf header
  const pdfHeader = ["Circle Name", "Registered", "Clean", "Unclean"];

  // pdf data
  const pdfData = circles?.map((circle) => [
    circle?.name,
    circle?.registered,
    circle?.clean,
    circle?.unclean,
  ]);

  return (
    <div style={{ padding: "24px" }}>
      <CommonDivider label={"Circle-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={"Circle-Wise Report"}
            pdfName={"Circle-Wise-Report"}
            headerData={pdfHeader}
            rows={pdfData}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={circles || []}
            fileName={"Circle-Wise-Report"}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={circles}
        rowKey="circle_id"
        pagination={{ pageSize: 10 }}
        bordered
        footer={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <strong>Total Circles: {totalCircles}</strong> |{" "}
              <strong>Registered: {totalRegistered}</strong> |{" "}
              <strong>Clean: {totalClean}</strong> |{" "}
              <strong>Unclean: {totalUnclean}</strong>
            </span>
            <span></span> {/* Empty span to maintain structure */}
          </div>
        )}
      />
    </div>
  );
};

export default CircleWiseReport;
