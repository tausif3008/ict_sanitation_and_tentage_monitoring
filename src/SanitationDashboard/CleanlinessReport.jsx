import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Button, message, Select, TimePicker } from "antd";
import URLS from "../urils/URLS";

const CleanlinessReport = () => {

  const [selectedToilet, setSelectedToilet] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const toiletData = assetData?.asset_count;

  const options = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ["#00E396", "#FF4560"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: sectorData.map((sector) => sector.name),
    },
    yaxis: {
      title: {
        text: "Time (Mins)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} mins`;
        },
      },
    },
  };

  const series = [
    {
      name: "Sanitized",
      data: [
        60, 80, 75, 50, 49, 60, 70, 57, 78, 86, 47, 75, 86, 67, 98, 56, 75, 56,
        87, 46, 55, 77, 66, 88, 76,
      ],
    },
    {
      name: "Non Sanitized",
      data: [
        29, 30, 35, 20, 30, 24, 50, 30, 40, 55, 30, 66, 44, 55, 66, 44, 55, 44,
        65, 45, 46, 37, 47, 54, 66,
      ],
    },
  ];

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
        const response = await fetch(
          `${URLS.baseUrl}/sector`,
          {
            method: "GET",
            headers: headers,
          }
        );
        const result = await response.json();

        if (result.success) {
          setSectorData(result.data.sectors);
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };
    fetchSectorData();
  }, []);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(
          `${URLS.baseUrl}/questions`
         ,
          {
            method: "GET",
            headers: headers,
          }
        );
        const result = await response.json();

        if (result.success) {
          setQuestionData(result.data.listings);
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };
    fetchQuestionData();
  }, []);

  useEffect(() => {
    const fetchToiletData = async () => {
      try {
        const response = await fetch(
          `${URLS.baseUrl}/dashboard`,
          { method: "POST", headers: headers }
        );
        const result = await response.json();
        if (result.success) {
          setAssetData(result.data);
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };
    fetchToiletData();
  }, []);

  return (
    <div className="bg-white p-3 rounded-lg mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">
          Sectorwise Cleanliness Report (Under Monitoring)
        </h3>
      </div>
      <div className="flex flex-wrap gap-3 mt-0">
        <div>
          <TimePicker size="middle"></TimePicker>
        </div>
        <Select
          value={selectedToilet}
          onChange={(value) => setSelectedToilet(value)}
          placeholder="Select Toilet"
          style={{ minWidth: "300px" }}
        >
          {toiletData?.map((toilet) => (
            <Select.Option key={toilet.asset_type_id} value={toilet.type}>
              {toilet.type}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={selectedQuestion}
          onChange={(value) => setSelectedQuestion(value)}
          placeholder="Select Question"
          style={{ width: "300px" }}
        >
          {questionData?.map((questions) => (
            <Select.Option
              key={questions.question_id}
              value={questions.question_en}
            >
              {questions.question_en}
            </Select.Option>
          ))}
        </Select>
        <Button
          size="medium"
          type="primary"
          htmlType="submit"
          className="w-32 bg-orange-400 font-semibold"
          style={{ flexShrink: 0 }} 
        >
          Search
        </Button>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default CleanlinessReport;

