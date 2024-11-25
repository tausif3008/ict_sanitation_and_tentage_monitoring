import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { Button, message, Select, TimePicker } from "antd";
import { useOutletContext } from "react-router";
import VendorSectorSelectors from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getDashboardData } from "./Slice/sanitationDashboard";
import SanitationDashSelector from "./Slice/sanitationDashboardSelector";
import { getQuestionList } from "../register/questions/questionSlice";
import QuestionSelector from "../register/questions/questionSelector";

const CleanlinessReport = () => {
  const [dict, lang] = useOutletContext();
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const dispatch = useDispatch();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown ( api of this drop call in ToiletDetails component of sanitation dash)
  const category = SectorListDrop?.map((data) => data?.label);
  const { Dash_Drop, SanitationDash_data } = SanitationDashSelector(); // dashboard
  const { QuestionDrop } = QuestionSelector(); // questions
  const sectorOptions = SanitationDash_data?.data?.sectorgraph || [];

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
      categories: category || [],
      // categories: sectorData?.map((sector) => sector?.name),
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
      // data: [
      //   60, 80, 75, 50, 49, 60, 70, 57, 78, 86, 47, 75, 86, 67, 98, 56, 75, 56,
      //   87, 46, 55, 77, 66, 88, 76,
      // ],
      data: sectorOptions?.map((item) => Number(item?.yes) || 0),
    },
    {
      name: "Non Sanitized",
      // data: [
      //   29, 30, 35, 20, 30, 24, 50, 30, 40, 55, 30, 66, 44, 55, 66, 44, 55, 44,
      //   65, 45, 46, 37, 47, 54, 66,
      // ],
      data: sectorOptions?.map((item) => Number(item?.no) || 0),
    },
  ];

  useEffect(() => {
    dispatch(getDashboardData()); // get dashboard data
    dispatch(getQuestionList()); // get question
  }, []);

  return (
    <div className="bg-white p-3 rounded-lg mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">
          {dict.sectorwise_cleanliness_report[lang]}
        </h3>
      </div>
      <div className="flex flex-wrap gap-3 mt-0">
        {/* <div>
          <TimePicker size="middle"></TimePicker>
        </div> */}
        <Select
          value={selectedToilet}
          onChange={(value) => setSelectedToilet(value)}
          placeholder={dict.select_toilet[lang]}
          style={{ minWidth: "300px" }}
        >
          {Dash_Drop?.map((toilet) => (
            <Select.Option key={toilet?.value} value={toilet?.value}>
              {toilet?.label}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={selectedQuestion}
          onChange={(value) => setSelectedQuestion(value)}
          placeholder={dict.select_question[lang]}
          style={{ width: "300px" }}
        >
          {QuestionDrop?.map((questions) => (
            <Select.Option key={questions?.value} value={questions?.value}>
              {questions?.label}
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
          {dict.search[lang]}
        </Button>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default CleanlinessReport;
