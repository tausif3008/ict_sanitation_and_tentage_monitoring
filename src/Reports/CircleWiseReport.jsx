import React, { useEffect, useMemo, useState } from "react";
import { Table, Collapse, Form, Button, Row, Col } from "antd";
import "jspdf-autotable";
import CommonDivider from "../commonComponents/CommonDivider";
import ExportToPDF from "./reportFile";
import ExportToExcel from "./ExportToExcel";
import CircleSelector from "./CircleSlice/circleSelector";
import dayjs from "dayjs";
import URLS from "../urils/URLS";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../register/AssetType/AssetTypeSlice";
import { getVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import { getFormData } from "../urils/getFormData";
import moment from "moment";
import { useDispatch } from "react-redux";
import { getCircleReports } from "./CircleSlice/circleSlices";
import AssetTypeSelectors from "../register/AssetType/assetTypeSelectors";
import CustomSelect from "../commonComponents/CustomSelect";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import search from "../assets/Dashboard/icon-search.png";
import CustomDatepicker from "../commonComponents/CustomDatepicker";

const CircleWiseReport = () => {
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalClean, setTotalClean] = useState(0);
  const [totalUnclean, setTotalUnclean] = useState(0);

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { CircleReports, loading } = CircleSelector(); // circle reports

  const CircleData = useMemo(() => {
    return CircleReports?.data?.circles?.map((item) => ({
      ...item,
      registered: Number(item?.registered),
      sector_id: Number(item?.sector_id),
      clean: Number(item?.clean),
      unclean: Number(item?.unclean),
    }));
  }, [CircleReports]);
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { VendorListDrop } = VendorSupervisorSelector(); // vendor

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  // fiter finish
  const onFinishForm = async (values) => {
    const dayjsDate = new Date(values?.date);
    const formattedDate = moment(dayjsDate).format("YYYY-MM-DD");
    const finalValues = {
      ...(values?.asset_main_type_id && {
        asset_main_type_id: values?.asset_main_type_id,
      }),
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    const formData = await getFormData(data);
    const url = URLS?.circle_wise_report?.path;
    dispatch(getCircleReports(url, formData)); // circle reports
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getCurrentData();
  };

  useEffect(() => {
    if (CircleReports) {
      const totalReg = CircleData?.reduce(
        (acc, circle) => acc + Number(circle?.registered),
        0
      );
      const totalClean = CircleData?.reduce(
        (acc, circle) => acc + Number(circle?.clean),
        0
      );
      const totalUnclean = CircleData?.reduce(
        (acc, circle) => acc + Number(circle?.unclean),
        0
      );
      setTotalRegistered(totalReg);
      setTotalClean(totalClean);
      setTotalUnclean(totalUnclean);
    }
  }, [CircleReports]);

  // current data
  const getCurrentData = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
    });
    const finalValues = {
      date: newDate,
    };
    callApi(finalValues);
  };

  useEffect(() => {
    getCurrentData(); // current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    dispatch(getVendorList()); // vendor list

    return () => {};
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
  const pdfData = useMemo(() => {
    return (
      CircleData?.map((circle) => [
        circle?.name,
        // circle?.registered,
        // circle?.clean,
        // circle?.unclean,
        Number(circle?.registered),
        Number(circle?.clean),
        Number(circle?.unclean),
      ]) || []
    );
  }, [CircleData]);

  // excel data
  const myexcelData = useMemo(() => {
    return CircleData?.map((data, index) => ({
      sr: index + 1,
      Name: data?.name,
      Registered: Number(data?.registered),
      Clean: Number(data?.clean),
      Unclean: Number(data?.unclean),
    }));
  }, [CircleData]);

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
            excelData={myexcelData || []}
            fileName={"Circle-Wise-Report"}
            dynamicFields={{
              "Register Unit": totalRegistered,
              Clean: totalClean,
              Unclean: totalUnclean,
            }}
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
                    <Col key="date" xs={24} sm={12} md={6} lg={5}>
                      <CustomDatepicker
                        name={"date"}
                        label={"Date"}
                        className="w-full"
                        placeholder={"Date"}
                      />
                    </Col>
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
                      />
                    </Col>
                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_main_type_id"}
                        label={"Select Category"}
                        placeholder={"Select Category"}
                        onSelect={handleSelect}
                        options={AssetMainTypeDrop || []}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Asset Type"}
                        placeholder={"Select Asset Type"}
                        options={AssetTypeDrop || []}
                      />
                    </Col>
                    <Col
                      xs={24}
                      sm={12}
                      md={6}
                      lg={4}
                      className="flex justify-end gap-2"
                    >
                      <Button
                        type="primary"
                        className="rounded-none bg-5c"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="rounded-none bg-green-300 text-black"
                      >
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ),
            },
          ]}
        />
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={CircleData || []}
        rowKey="circle_id"
        pagination={{ pageSize: 10 }}
        bordered
        footer={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <strong>Total Circles: {CircleData?.length}</strong> |{" "}
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
