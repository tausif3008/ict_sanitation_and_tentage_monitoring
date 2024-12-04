import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, Collapse, Form, Button, Row, Col } from "antd";
import moment from "moment";
import dayjs from "dayjs";

import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getVendorReports } from "./vendorslice";
import VendorSelectors from "./vendorSelectors";
import ExportToPDF from "../reportFile";
import ExportToExcel from "../ExportToExcel";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getValueLabel } from "../../constant/const";
import { getFormData } from "../../urils/getFormData";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import CustomSelect from "../../commonComponents/CustomSelect";
import search from "../../assets/Dashboard/icon-search.png";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";

const VendorReports = () => {
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalClean, setTotalClean] = useState(0);
  const [totalUnclean, setTotalUnclean] = useState(0);
  const [total, setTotal] = useState(0);

  const [excelData, setExcelData] = useState([]);
  const [filesName, setFilesName] = useState(null); // files Name
  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, vendorReports } = VendorSelectors(); // vendor reports
  const vendorsData = vendorReports?.data?.vendors || [];

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
    const url = URLS?.vendorReporting?.path;
    dispatch(getVendorReports(url, formData)); // vendor reports
  };

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

  // reset form
  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue({
      asset_type_id: null,
    });
    getCurrentData();
    setFilesName(null);
  };

  useEffect(() => {
    if (vendorReports) {
      const total = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.total),
        0
      );
      const totalReg = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.registered),
        0
      );
      const totalClean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.clean),
        0
      );
      const totalUnclean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.unclean),
        0
      );
      setTotal(total);
      setTotalRegistered(totalReg);
      setTotalClean(totalClean);
      setTotalUnclean(totalUnclean);
    }
  }, [vendorReports]);

  // file name
  useEffect(() => {
    if (categoryType) {
      const value = getValueLabel(categoryType, AssetMainTypeDrop, "");
      setFilesName(value);
    }
  }, [categoryType, AssetMainTypeDrop]);

  useEffect(() => {
    getCurrentData(); // current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    dispatch(getVendorList()); // vendor list

    return () => {};
  }, []);

  useEffect(() => {
    if (vendorReports) {
      setVendorDetails((prevDetails) => ({
        ...prevDetails,
        list: vendorReports?.data?.vendors || [],
        pageLength: vendorReports?.data?.paging?.[0]?.length || 0,
        currentPage: vendorReports?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: vendorReports?.data?.paging?.[0]?.totalrecords || 0,
      }));

      const myexcelData = vendorReports?.data?.vendors?.map((data, index) => {
        return {
          sr: index + 1,
          name: data?.name,
          // email: data?.email,
          // phone: data?.phone,
          // address: data?.address,
          // pin: data?.pin,
          // company: data?.company,
          // language: data?.language,
          Total: Number(data?.total),
          Registered: Number(data?.registered),
          Clean: Number(data?.clean),
          Unclean: Number(data?.unclean),
        };
      });
      setExcelData(myexcelData);
    }
  }, [vendorReports]);

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Registered",
      dataIndex: "registered",
      key: "registered",
    },
    {
      title: "Clean",
      dataIndex: "clean",
      key: "clean",
    },
    {
      title: "Unclean",
      dataIndex: "unclean",
      key: "unclean",
    },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Vendor Name",
    "Total",
    "Registered",
    "Clean",
    "Unclean",
  ];

  // pdf data
  const pdfData = useMemo(() => {
    return (
      excelData?.map((opt) => [
        opt?.sr,
        opt?.name,
        opt?.total,
        opt?.registered,
        opt?.clean,
        opt?.unclean,
      ]) || []
    );
  }, [excelData]);

  return (
    <div>
      <CommonDivider label={"Vendor-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={
              filesName
                ? `Vendor-Wise-${filesName} Report`
                : `Vendor-Wise Report`
            }
            pdfName={
              filesName
                ? `Vendor-Wise-${filesName}-Report`
                : `Vendor-Wise-Report`
            }
            headerData={pdfHeader}
            rows={pdfData}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={
              filesName
                ? `Vendor-Wise-${filesName} Report`
                : `Vendor-Wise Report`
            }
            dynamicFields={{
              Total: total,
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
        dataSource={vendorDetails?.list || []}
        rowKey="sector_id"
        pagination={{ pageSize: 50 }}
        bordered
        footer={() => (
          <div className="flex justify-between">
            <span>
              <strong>Total Vendors: {vendorsData?.length}</strong> |{" "}
              <strong>Total : {total}</strong> |{" "}
              <strong>Total Registered: {totalRegistered}</strong> |{" "}
              <strong>Total Clean : {totalClean}</strong> |{" "}
              <strong>Total Unclean: {totalUnclean}</strong> |{" "}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default VendorReports;
