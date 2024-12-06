import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";
import { Table, Collapse, Form, Button, Row, Col } from "antd";

import CommonDivider from "../commonComponents/CommonDivider";
import ExportToPDF from "./reportFile";
import ExportToExcel from "./ExportToExcel";
import { getSectorReports } from "./SectorSlice/sectorSlice";
import URLS from "../urils/URLS";
import SectorReportSelectors from "./SectorSlice/sectorSelector";
import search from "../assets/Dashboard/icon-search.png";
import CustomSelect from "../commonComponents/CustomSelect";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../register/AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../register/AssetType/assetTypeSelectors";
import { getVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getFormData } from "../urils/getFormData";
import { getValueLabel } from "../constant/const";
import CustomDatepicker from "../commonComponents/CustomDatepicker";

const SectorWiseReport = () => {
  const [totalQuantity, setTotalQuantity] = useState({
    totalQnty: 0,
    registered: 0,
    clean: 0,
    unclean: 0,
  });
  const [filesName, setFilesName] = useState(null); // files Name

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { SectorReports, loading } = SectorReportSelectors(); // sector reports

  const sectorData = useMemo(() => {
    return SectorReports?.data?.sectors?.map((item) => ({
      ...item,
      total: Number(item?.total),
      registered: Number(item?.registered),
      clean: Number(item?.clean),
      unclean: Number(item?.unclean),
    }));
  }, [SectorReports]);

  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const categoryType = form.getFieldValue("asset_main_type_id");

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
    const url = URLS?.sector_wise_report?.path;
    dispatch(getSectorReports(url, formData)); // sector reports
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getCurrentData();
    setFilesName(null);
  };

  // file name
  useEffect(() => {
    if (categoryType) {
      const value = getValueLabel(categoryType, AssetMainTypeDrop, "");
      setFilesName(value);
    }
  }, [categoryType, AssetMainTypeDrop]);

  useEffect(() => {
    if (SectorReports) {
      const totalQty = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.total),
        0
      );
      const totalRegister = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.registered),
        0
      );
      const totalClean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.clean),
        0
      );
      const totalUnclean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.unclean),
        0
      );
      setTotalQuantity({
        totalQnty: totalQty,
        registered: totalRegister,
        clean: totalClean,
        unclean: totalUnclean,
      });
    }
  }, [SectorReports]);

  // current data
  const getCurrentData = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      asset_main_type_id: "1",
    });
    const url = URLS?.assetType?.path + "1";
    dispatch(getAssetTypes(url)); // get assset type
    const finalValues = {
      date: newDate,
      asset_main_type_id: "1",
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

  // useEffect(() => {
  //   if (AssetMainTypeDrop) {
  //     console.log("AssetMainTypeDrop", AssetMainTypeDrop);
  //   }
  // }, [AssetMainTypeDrop]);

  const columns = [
    { title: "Sector Name", dataIndex: "name", key: "name" },
    { title: "Total Quantity", dataIndex: "total", key: "total" },
    { title: "Total Registered", dataIndex: "registered", key: "registered" },
    { title: "Clean", dataIndex: "clean", key: "clean" },
    { title: "Unclean", dataIndex: "unclean", key: "unclean" },
  ];

  // pdf header
  const pdfHeader = ["Sector Name", "Total", "Registered", "Clean", "Unclean"];

  // pdf data
  const pdfData = sectorData?.map((sector) => [
    sector?.name,
    Number(sector?.total),
    Number(sector?.registered),
    Number(sector?.clean),
    Number(sector?.unclean),
  ]);

  // excel data
  const myexcelData = useMemo(() => {
    return sectorData?.map((data, index) => ({
      Sr: index + 1,
      Name: data?.name,
      // "Name In Hindi": data?.name_hi,
      Quantity: Number(data?.total),
      Registered: Number(data?.registered),
      Clean: Number(data?.clean),
      Unclean: Number(data?.unclean),
    }));
  }, [sectorData]);

  return (
    <div style={{ padding: "24px" }}>
      <CommonDivider label={"Sector-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={
              filesName
                ? `Sector-Wise-${filesName} Report`
                : `Sector-Wise Report`
            }
            pdfName={
              filesName
                ? `Sector-Wise-${filesName}-Report`
                : `Sector-Wise-Report`
            }
            headerData={pdfHeader}
            rows={pdfData}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={myexcelData || []}
            fileName={
              filesName
                ? `Sector-Wise-${filesName}-Report`
                : `Sector-Wise-Report`
            }
            dynamicFields={{
              "Total Quantity": totalQuantity?.totalQnty,
              "Total Register": totalQuantity?.registered,
              "Total Clean": totalQuantity?.clean,
              "Total Unclean": totalQuantity?.unclean,
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
                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_main_type_id"}
                        label={"Select Category"}
                        placeholder={"Select Category"}
                        onSelect={handleSelect}
                        options={AssetMainTypeDrop?.slice(0, 2) || []}
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
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
                      />
                    </Col>
                    <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
                      <CustomDatepicker
                        name={"date"}
                        label={"Date"}
                        className="w-full"
                        placeholder={"Date"}
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
        dataSource={sectorData || []}
        rowKey="sector_id"
        pagination={{ pageSize: 30 }}
        bordered
        footer={() => (
          <div className="flex justify-between">
            <strong>Total Sectors: {sectorData?.length}</strong>
            <strong>Total Quantity: {totalQuantity?.totalQnty}</strong>
            <strong>Total Register: {totalQuantity?.registered}</strong>
            <strong>Total Clean: {totalQuantity?.clean}</strong>
            <strong>Total Unclean: {totalQuantity?.unclean}</strong>
          </div>
        )}
      />
    </div>
  );
};

export default SectorWiseReport;
