import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import search from "../../assets/Dashboard/icon-search.png";
import {
  getFormatedNumber,
  getValueLabel,
  globalDateFormat,
  percentageOptions,
} from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getFormData } from "../../urils/getFormData";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import GSDMonitoringSelector from "./Slice/GSDMonitoringSelector";
import { getGSDMonitoringData } from "./Slice/GSDMonitoringReport";
import CustomTable from "../../commonComponents/CustomTable";
import ExportToExcel from "../ExportToExcel";
import ExportToPDF from "../reportFile";

const GsdWiseMonitoringReport = () => {
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

  const userRoleId = localStorage.getItem("role_id");
  const isSmoUser = Number(userRoleId) === 9;
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;
  const userSectorId = sessionData?.allocatedsectors?.[0]?.sector_id;
  const userSectorArray = sessionData?.allocatedsectors || [];

  const SectorArray = useMemo(() => {
    return (
      SectorListDrop?.filter((obj1) =>
        userSectorArray?.some((obj2) => obj2?.sector_id === obj1?.value)
      ) || []
    );
  }, [SectorListDrop, userSectorArray]);

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
      ...(isSmoUser && { sector_id: userSectorId }),
    });
    const finalValues = {
      date: newDate,
      ...(isSmoUser && { sector_id: userSectorId }),
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
  }, []);

  useEffect(() => {
    if (GSDMonitoring_data) {
      let myData = GSDMonitoring_data?.data;
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

      const ascendingOrderData = myData?.gsd
        ? [...myData?.gsd]?.sort((a, b) => a?.performance - b?.performance)
        : [];

      setGsdData((prevDetails) => ({
        ...prevDetails,
        list: ascendingOrderData,
        pageLength: myData?.paging?.[0]?.length || 0,
        currentPage: myData?.paging?.[0]?.currentpage || 1,
        totalRecords: myData?.paging?.[0]?.totalrecords || 0,
      }));

      setCount({
        total: ascendingOrderData?.length,
        todaysmonitaring: totalMonitoring,
        total_allocation: total_allocation,
        totalPendingMonitoring: total_allocation - totalMonitoring,
      });

      const myexcelData = ascendingOrderData?.map((data, index) => {
        return {
          Sr: index + 1,
          Name: data?.name,
          "Mobile Number": Number(data?.phone),
          "Allotted Sector": getValueLabel(
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
        title: "Mobile Number",
        dataIndex: "phone",
        key: "phone",
        width: 100,
      },
      {
        title: "Allotted Sector",
        dataIndex: "allocate_sector_id",
        key: "allocate_sector_id",
        width: 100,
        render: (text, record) => {
          return text ? getValueLabel(`${text}`, SectorListDrop, "-") : "-";
        },
      },
      {
        title: "Worked Sectors",
        dataIndex: "workedsectors",
        key: "workedsectors",
        width: 100,
        render: (text, record) => {
          if (Array.isArray(text) && text?.length > 0) {
            return text
              ?.map((value) => {
                return getValueLabel(`${value}`, SectorListDrop, "-");
              })
              .join(", ");
          } else {
            return "-";
          }
        },
      },
      {
        title: "Total Allocation",
        dataIndex: "total_allocation",
        key: "total_allocation",
        width: 50,
        sorter: (a, b) => a?.total_allocation - b?.total_allocation,
      },
      {
        title: "Monitoring",
        dataIndex: "todaysmonitaring",
        key: "todaysmonitaring",
        width: 50,
        sorter: (a, b) => a?.todaysmonitaring - b?.todaysmonitaring,
      },
      {
        title: "Monitoring %",
        dataIndex: "performance",
        key: "performance",
        width: 50,
        sorter: (a, b) => a?.performance - b?.performance,
        render: (text, record) => {
          return text ? `${Math.round(text)} %` : "0%";
        },
      },
      {
        title: "Pending Monitoring",
        dataIndex: "todaysmonitarings",
        key: "todaysmonitarings",
        width: 50,
        sorter: (a, b) => {
          const aPendingMonitoring =
            (Number(a?.total_allocation) || 0) -
            (Number(a?.todaysmonitaring) || 0);
          const bPendingMonitoring =
            (Number(b?.total_allocation) || 0) -
            (Number(b?.todaysmonitaring) || 0);
          return aPendingMonitoring - bPendingMonitoring;
        },
        render: (text, record) => {
          return (
            (Number(record?.total_allocation) || 0) -
            (Number(record?.todaysmonitaring) || 0)
          );
        },
      },
    ],
    [SectorListDrop]
  );
  // pdf header
  const pdfHeader = [
    "Sr No",
    "GSD Name",
    "Mobile Number",
    "Allotted Sector",
    "Worked Sectors",
    "Total Allocation",
    "Monitoring",
    "Monitoring%",
    "Pending Monitoring",
  ];

  // pdf data
  const pdfData = useMemo(() => {
    return (
      excelData?.map((opt) => [
        opt?.Sr,
        opt?.Name,
        opt?.["Mobile Number"],
        opt?.["Allotted Sector"],
        opt?.["Worked Sectors"],
        opt?.["Total Allocation"],
        opt?.Monitoring,
        opt?.["Monitoring%"],
        opt?.["Pending Monitoring"],
      ]) || []
    );
  }, [excelData]);

  return (
    <>
      <CommonDivider label={"GSD Wise Monitoring Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={`GSD Wise Monitoring Report ${fileDateName}`}
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
                <Row gutter={[16, 16]} align="middle">
                  <Col key="sector_id" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"sector_id"}
                      label={"Select Sector"}
                      placeholder={"Select Sector"}
                      allowClear={isSmoUser ? false : true}
                      options={isSmoUser ? SectorArray : SectorListDrop || []}
                    />
                  </Col>
                  <Col key="percentage" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"percentage"}
                      label={"Select Percentage"}
                      placeholder={"Select Percentage"}
                      options={percentageOptions || []}
                    />
                  </Col>
                  <Col key="date" xs={24} sm={12} md={6} lg={5}>
                    <CustomDatepicker
                      name={"date"}
                      label={"Date"}
                      className="w-full"
                      placeholder={"Date"}
                    />
                  </Col>
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <Button
                      loading={gsd_monitoringLoader}
                      type="button"
                      htmlType="submit"
                      className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Search
                    </Button>
                    <Button
                      loading={gsd_monitoringLoader}
                      type="button"
                      className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                  </div>
                </Row>
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
          "Total Records": getFormatedNumber(gsdData?.list?.length) || 0,
          "Total Allocation": getFormatedNumber(count?.total_allocation) || 0,
          "Total Monitoring": getFormatedNumber(count?.todaysmonitaring) || 0,
          "Total Pending Monitoring":
            getFormatedNumber(count?.totalPendingMonitoring) || 0,
        }}
        pagination={true}
      />
    </>
  );
};

export default GsdWiseMonitoringReport;
