import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import search from "../../assets/Dashboard/icon-search.png";
import {
  getValueLabel,
  globalDateFormat,
  gsdWiseMonitoringcolumns,
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
      sector_id: "1",
    });
    const finalValues = {
      date: newDate,
      sector_id: "1",
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

  // const getUsers = async (dataObj = {}) => {
  //   const newParam = {
  //     page: dataObj?.page || "1",
  //     per_page: dataObj?.size || "25",
  //     ...form.getFieldsValue(),
  //   };
  //   onFinishForm(newParam);
  // };

  useEffect(() => {
    if (GSDMonitoring_data) {
      const myData = GSDMonitoring_data?.data?.gsd;

      const totalMonitoring = myData?.reduce(
        (acc, circle) => acc + Number(circle?.todaysmonitaring) || 0,
        0
      );
      const total_allocation = myData?.reduce(
        (acc, circle) => acc + Number(circle?.total_allocation) || 0,
        0
      );
      const lastTableRow = [
        {
          name: `Total : ${gsdData?.list?.length - 1}`,
          total_allocation: total_allocation,
          todaysmonitaring: totalMonitoring,
          todaysmonitarings: total_allocation - totalMonitoring,
        },
      ];

      setGsdData((prevDetails) => ({
        ...prevDetails,
        list: [...GSDMonitoring_data?.data?.gsd, ...lastTableRow] || [],
        pageLength: GSDMonitoring_data?.data?.paging?.[0]?.length || 0,
        currentPage: GSDMonitoring_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: GSDMonitoring_data?.data?.paging?.[0]?.totalrecords || 0,
      }));

      setCount({
        total: GSDMonitoring_data?.data?.gsd?.length,
        todaysmonitaring: totalMonitoring,
        total_allocation: total_allocation,
        totalPendingMonitoring: total_allocation - totalMonitoring,
      });

      const myexcelData = GSDMonitoring_data?.data?.gsd?.map((data, index) => {
        return {
          Sr: index + 1,
          Name: data?.name,
          "Mobile Number": data?.phone,
          "Total Allocation": Number(data?.total_allocation) || 0,
          Monitoring: Number(data?.todaysmonitaring) || 0,
          "Pending Monitoring":
            (Number(data?.total_allocation) || 0) -
            (Number(data?.todaysmonitaring) || 0),
        };
      });
      setExcelData(myexcelData);
    }
  }, [GSDMonitoring_data]);

  // pdf header
  const pdfHeader = [
    "Sr No",
    "GSD Name",
    "Mobile Number",
    "Total Allocation",
    "Monitoring",
    "Pending Monitoring",
  ];

  // pdf data
  const pdfData = useMemo(() => {
    return (
      excelData?.map((opt) => [
        opt?.Sr,
        opt?.Name,
        opt?.["Mobile Number"],
        opt?.["Total Allocation"],
        opt?.Monitoring,
        opt?.["Pending Monitoring"],
      ]) || []
    );
  }, [excelData]);

  const sectorName = getValueLabel(
    formValue?.sector_id,
    SectorListDrop,
    "Sector Name"
  );

  const pdfNames = `GSD Wise ${sectorName} Monitoring Report (${dayjs(
    formValue?.date
  ).format("DD-MMM-YYYY")})`;

  return (
    <div>
      <CommonDivider label={"GSD Wise Monitoring Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          <ExportToPDF
            titleName={pdfNames}
            pdfName={pdfNames}
            headerData={pdfHeader}
            IsLastLineBold={true}
            IsNoBold={true}
            // applyTableStyles={true}
            rows={[
              ...pdfData,
              [
                "",
                "Total",
                "",
                count?.total_allocation,
                count?.todaysmonitaring,
                count?.totalPendingMonitoring,
              ],
            ]}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            titleName={pdfNames}
            fileName={pdfNames}
            dynamicArray={[
              {
                name: "Total Allocation",
                value: count?.total_allocation,
                colIndex: 4,
              },
              {
                name: "Monitoring",
                value: count?.todaysmonitaring,
                colIndex: 5,
              },
              {
                name: "Pending Monitoring",
                value: count?.totalPendingMonitoring,
                colIndex: 6,
              },
            ]}
          />
        </div>
      </div>
      <div>
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
                        options={SectorListDrop || []}
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
                      <div>
                        <Button
                          loading={gsd_monitoringLoader}
                          type="button"
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          Search
                        </Button>
                      </div>
                      <div>
                        <Button
                          loading={gsd_monitoringLoader}
                          type="button"
                          className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                          onClick={resetForm}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </Row>
                </Form>
              ),
            },
          ]}
        />
      </div>
      <CustomTable
        loading={gsd_monitoringLoader}
        columns={gsdWiseMonitoringcolumns || []}
        bordered
        dataSource={gsdData || []}
        scroll={{ x: 800, y: 400 }}
        tableSubheading={{
          "Total Records": gsdData?.totalRecords,
          "Total Allocation": count?.total_allocation,
          "Total Monitoring": count?.todaysmonitaring,
          "Total Pending Monitoring": count?.totalPendingMonitoring,
        }}
        pagination={true}
        // onPageChange={(page, size) => {
        //   const obj = {
        //     page: page,
        //     size: size,
        //   };
        //   getUsers(obj);
        // }}
      />
    </div>
  );
};

export default GsdWiseMonitoringReport;
