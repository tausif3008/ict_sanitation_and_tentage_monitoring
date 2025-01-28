import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button } from "antd";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import search from "../../assets/Dashboard/icon-search.png";
import {
  getValueLabel,
  globalDateFormat,
  percentageOptions,
} from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getFormData } from "../../urils/getFormData";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import CustomTable from "../../commonComponents/CustomTable";
import ExportToExcel from "../ExportToExcel";
import ExportToPDF from "../reportFile";
import GSDMonitoringSelector from "../GSDWiseMonitoringReport/Slice/GSDMonitoringSelector";
import { getGSDMonitoringData } from "../GSDWiseMonitoringReport/Slice/GSDMonitoringReport";
import URLS from "../../urils/URLS";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import MonitoringSelector from "../../complaince/monitoringSelector";

const AttendanceReport = () => {
  const [loading] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [gsdData, setGsdData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    todaysmonitaring: 0,
    totalPendingMonitoring: 0,
    total_allocation: 0,
  });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { GSDMonitoring_data, gsd_monitoringLoader } = GSDMonitoringSelector();
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop

  const sectorName = getValueLabel(formValue?.sector_id, SectorListDrop, null);
  const percentageName = getValueLabel(
    `${formValue?.percentage}`,
    percentageOptions,
    null
  );
  const fileDateName = `(${dayjs(formValue?.date).format("DD-MMM-YYYY")})`;

  // file name
  const getReportName = () => {
    let name = "GSD Wise";
    if (sectorName) {
      name += `- ${sectorName}`;
    }
    if (percentageName) {
      name += `- ${percentageName}`;
    }
    name += `- Monitoring Report ${fileDateName}`;
    return name;
  };
  const fileName = getReportName();

  const pdfTitleParam = [
    ...(formValue?.sector_id
      ? [
          {
            label: `Allocate Sector : ${sectorName || "Combined"}`,
          },
        ]
      : []),
    ...(formValue?.percentage
      ? [
          {
            label: `Monitoring Percentage :  ${percentageName || "Combined"}`,
          },
        ]
      : []),
  ];

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      date: dayjs(values?.date).format("YYYY-MM-DD"),
      ...(values?.sector_id && {
        sector_id: values?.sector_id,
      }),
    };
    callApi(finalData);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getCurrentData();
  };

  // current data
  const getCurrentData = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, globalDateFormat),
    });
    const finalValues = {
      date: newDate,
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    const formData = await getFormData(data);
    dispatch(getGSDMonitoringData(formData)); // vendor reports
  };

  useEffect(() => {
    getCurrentData();
    dispatch(getSectorsList()); // all sectors
    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls)); // monitoring agent list
  }, []);

  useEffect(() => {
    if (GSDMonitoring_data) {
      let myData = GSDMonitoring_data?.data;
      console.log("myData", myData);
      const selectedPercentage = formValue?.percentage;
      if (selectedPercentage) {
        const filteredData = myData?.gsd?.filter((circle) => {
          if (Number(selectedPercentage) === 0) {
            return Number(circle?.performance) === Number(selectedPercentage);
          } else if (
            Number(selectedPercentage) === 89 ||
            Number(selectedPercentage) === 79
          ) {
            return Number(circle?.performance) <= Number(selectedPercentage);
          } else {
            return Number(circle?.performance) >= Number(selectedPercentage);
          }
        });
        myData = {
          gsd: filteredData,
        };
      }

      const totalMonitoring = myData?.gsd?.reduce(
        (acc, circle) => acc + Number(circle?.todaysmonitaring) || 0,
        0
      );
      const total_allocation = myData?.gsd?.reduce(
        (acc, circle) => acc + Number(circle?.total_allocation) || 0,
        0
      );

      setGsdData((prevDetails) => ({
        ...prevDetails,
        list: myData?.gsd || [],
        pageLength: myData?.paging?.[0]?.length || 0,
        currentPage: myData?.paging?.[0]?.currentpage || 1,
        totalRecords: myData?.paging?.[0]?.totalrecords || 0,
      }));

      setCount({
        total: myData?.gsd?.length,
        todaysmonitaring: totalMonitoring,
        total_allocation: total_allocation,
        totalPendingMonitoring: total_allocation - totalMonitoring,
      });

      const myexcelData = myData?.gsd?.map((data, index) => {
        return {
          Sr: index + 1,
          Name: data?.name,
          "Mobile Number": Number(data?.phone),
          "Allocate Sectors": getValueLabel(
            `${data?.allocate_sector_id}`,
            SectorListDrop,
            "-"
          ),
          "Worked Sectors":
            Array.isArray(data?.workedsectors) && data?.workedsectors.length > 0
              ? data?.workedsectors
                  .map((value) => {
                    return getValueLabel(`${value}`, SectorListDrop, "-");
                  })
                  .join(", ")
              : "-",
          "Total Allocation": Number(data?.total_allocation) || 0,
          Monitoring: Number(data?.todaysmonitaring) || 0,
          "Monitoring%": `${Math.round(data?.performance)}%` || 0,
          "Pending Monitoring":
            (Number(data?.total_allocation) || 0) -
            (Number(data?.todaysmonitaring) || 0),
        };
      });
      setExcelData(myexcelData);
    }
  }, [GSDMonitoring_data]);

  const columns = useMemo(
    () => [
      {
        title: "GSD Name",
        dataIndex: "name",
        key: "name",
        width: 100,
        sorter: (a, b) => {
          const nameA = a?.name ? a?.name?.toString() : "";
          const nameB = b?.name ? b?.name?.toString() : "";
          return nameA?.localeCompare(nameB);
        },
      },
      {
        title: "Shift 1",
        dataIndex: "phone",
        key: "phone",
        width: 100,
      },
      {
        title: "Shift 2",
        dataIndex: "phone",
        key: "phone",
        width: 100,
      },
    ],
    [SectorListDrop]
  );
  // pdf header
  const pdfHeader = ["Sr No", "GSD Name", "Shift 1", "Shift 2"];

  // pdf data
  const pdfData = useMemo(() => {
    return excelData?.map((opt) => [opt?.Sr, opt?.Name]) || [];
  }, [excelData]);

  return (
    <div>
      <CommonDivider label={"Attendance Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={`Attendance Report ${fileDateName}`}
          pdfName={fileName}
          headerData={pdfHeader}
          IsLastLineBold={true}
          landscape={true}
          tableTitles={pdfTitleParam || []}
          rows={[
            ...pdfData,
            [
              "",
              "Total",
              "",
              "",
              "",
              count?.total_allocation,
              count?.todaysmonitaring,
              "",
              count?.totalPendingMonitoring,
            ],
          ]}
        />
        <ExportToExcel
          excelData={excelData || []}
          titleName={fileName}
          fileName={fileName}
          dynamicArray={[
            {
              name: "Total Allocation",
              value: count?.total_allocation,
              colIndex: 6,
            },
            {
              name: "Monitoring",
              value: count?.todaysmonitaring,
              colIndex: 7,
            },
            {
              name: "Pending Monitoring",
              value: count?.totalPendingMonitoring,
              colIndex: 9,
            },
          ]}
        />
      </div>
      <Collapse
        defaultActiveKey={["1"]}
        size="small"
        className="rounded-none mt-3"
        items={[
          {
            key: 1,
            label: (
              <div className="flex items-center h-full">
                <img src={search} className="h-5" alt="Search Icon" />
              </div>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinishForm}
                key="form1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                  <CustomSelect
                    name={"created_by"}
                    label={"Select GSD"}
                    placeholder={"Select GSD"}
                    options={monitoringAgentDrop || []}
                    // search dropdown
                    isOnSearchFind={true}
                    apiAction={getMonitoringAgent}
                    onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
                  />
                  <CustomSelect
                    name={"sector_id"}
                    label={"Select Sector"}
                    placeholder={"Select Sector"}
                    options={SectorListDrop || []}
                  />
                  <CustomDatepicker
                    name={"date"}
                    label={"Date"}
                    className="w-full"
                    placeholder={"Date"}
                  />
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <div>
                      <Button
                        loading={loading}
                        type="button"
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        Search
                      </Button>
                    </div>
                    <div>
                      <Button
                        loading={loading}
                        type="button"
                        className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            ),
          },
        ]}
      />
      <CustomTable
        loading={gsd_monitoringLoader}
        columns={columns || []}
        bordered
        dataSource={gsdData || []}
        scroll={{ x: 800, y: 400 }}
        tableSubheading={{
          "Total Records": gsdData?.list?.length,
        }}
        pagination={true}
      />
    </div>
  );
};

export default AttendanceReport;
