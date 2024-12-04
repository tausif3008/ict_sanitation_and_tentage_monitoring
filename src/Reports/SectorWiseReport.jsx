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
  const [totalQuantity, setTotalQuantity] = useState(0);
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

  // const sectorData = SectorReports?.data?.sectors || [];
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
      setTotalQuantity(totalQty);
    }
  }, [SectorReports]);

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
    { title: "Sector Name", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "total", key: "total" },
    { title: "Registered", dataIndex: "registered", key: "registered" },
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
            excelData={sectorData || []}
            fileName={
              filesName
                ? `Sector-Wise-${filesName}-Report`
                : `Sector-Wise-Report`
            }
            dynamicFields={{ "Total Quantity": totalQuantity }}
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
                    <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
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
