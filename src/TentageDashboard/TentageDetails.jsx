import React, { useEffect, useState } from "react";
import { Tooltip, Button, Form } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useOutletContext } from "react-router";
import { useDispatch } from "react-redux";

import lines from "../assets/Dashboard/lines.png";
import { getVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import { getSectorsList } from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import TentageSelector from "./Slice/tentageSelector";
import { langingPage } from "../utils/dictionary";
import CustomSelect from "../commonComponents/CustomSelect";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import { getFormData } from "../urils/getFormData";
import { getTentageDashboardData } from "./Slice/tentageSlice";
import ViewVendorsSectors from "../register/AssetType/viewVendors";
import { VendorWiseReportcolumns } from "../constant/const";
import VendorSelectors from "../Reports/VendorwiseReports/vendorSelectors";
import { getVendorReports } from "../Reports/VendorwiseReports/vendorslice";
import URLS from "../urils/URLS";

const TentageDetails = () => {
  const dateFormat = "YYYY-MM-DD";
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    clean: 0,
    unclean: 0,
  });
  const [showData, setShowData] = useState(null);
  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const [dict, lang] = useOutletContext();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { VendorListDrop } = VendorSupervisorSelector(); // vendor list
  const { TentageDash_data, loading } = TentageSelector(); // tentage dashboard
  const toiletData = TentageDash_data?.data?.asset_types || [];
  const { vendorReports } = VendorSelectors(); // vendor Reports
  const vendorsData = vendorReports?.data?.vendors || [];

  const userRoleId = localStorage.getItem("role_id");
  const user_Id = localStorage.getItem("userId");

  // Reset the form
  const handleReset = () => {
    form.resetFields();
    todayData();
  };

  // close module
  const handleCancel = () => {
    setShowData(null);
    setCount({
      total: 0,
      registered: 0,
      clean: 0,
      unclean: 0,
    });
  };

  // Handle form submission
  const onFinish = async (values) => {
    const dayjsDate = new Date(values?.date);
    const formattedDate = moment(dayjsDate).format("YYYY-MM-DD");
    const finalValues = {
      ...(values?.sector_id && { sector_id: values?.sector_id }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      ...(userRoleId === "8" && { vendor_id: user_Id }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
    };
    const formData = await getFormData(finalValues);
    dispatch(getTentageDashboardData(formData)); // tentage dashboard
  };

  // today date
  const todayData = async () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
    });
    const finalData = {
      date: newDate,
      ...(userRoleId === "8" && { vendor_id: user_Id }),
    };
    const formData = await getFormData(finalData);
    dispatch(getTentageDashboardData(formData)); // tentage dashboard
  };

  // show module
  const handleCleanData = async (data) => {
    const formValue = form.getFieldsValue();
    const finalData = {
      asset_main_type_id: data?.asset_main_type_id,
      asset_type_id: data?.asset_type_id,
      ...(formValue?.vendor_id && { vendor_id: formValue?.vendor_id }),
      date: dayjs(formValue?.date).format("YYYY-MM-DD"),
      ...(userRoleId === "8" && { vendor_id: user_Id }),
    };

    const formData = await getFormData(finalData);
    const url = URLS?.vendorReporting?.path;
    dispatch(getVendorReports(url, formData)); // vendor reports
    setShowData(data);
  };

  useEffect(() => {
    if (vendorReports) {
      const total = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.total) || 0,
        0
      );
      const totalReg = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.registered) || 0,
        0
      );
      const totalClean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.clean) || 0,
        0
      );
      const totalUnclean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.unclean) || 0,
        0
      );
      setCount({
        total: total,
        registered: totalReg,
        clean: totalClean,
        unclean: totalUnclean,
      });
    }
  }, [vendorReports]);

  useEffect(() => {
    if (vendorReports) {
      setVendorDetails((prevDetails) => ({
        ...prevDetails,
        list: vendorReports?.data?.vendors || [],
        pageLength: vendorReports?.data?.paging?.[0]?.length || 0,
        currentPage: vendorReports?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: vendorReports?.data?.paging?.[0]?.totalrecords || 0,
      }));
    }
  }, [vendorReports]);

  useEffect(() => {
    userRoleId !== "8" && dispatch(getVendorList()); // vendor details
    dispatch(getSectorsList()); // all sectors
    todayData();
  }, []);

  return (
    <>
      <div className="p-4 bg-white rounded-xl space-y-4">
        <div className="text-xl font-bold"> {dict.tentage_details[lang]}</div>

        <div className="flex justify-start items-center space-x-6 mb-1">
          <div className="flex items-center mb-4 mr-6">
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">{dict.clean[lang]}</span>
            </div>
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">{dict.unclean[lang]}</span>
            </div>
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <CustomDatepicker
              name={"date"}
              label={`${langingPage?.date[lang]}`}
              placeholder={`${langingPage?.date[lang]}`}
              className="w-full"
              rules={[
                {
                  required: true,
                  message: "Please select a date!",
                },
              ]}
            />
            <CustomSelect
              name={"sector_id"}
              label={`${dict?.select_sector[lang]}`}
              placeholder={`${dict?.select_sector[lang]}`}
              options={SectorListDrop || []}
            />
            {userRoleId != "8" && (
              <CustomSelect
                name={"vendor_id"}
                label={`${dict?.select_vendor[lang]}`}
                placeholder={`${dict?.select_vendor[lang]}`}
                options={VendorListDrop || []}
              />
            )}
            <div className="flex justify-start my-4 space-x-2">
              <div>
                <Button
                  loading={loading}
                  type="button"
                  htmlType="submit"
                  className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                >
                  {dict?.search[lang]}
                </Button>
              </div>

              <div>
                <Button
                  loading={loading}
                  type="button"
                  className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-400"
                  onClick={handleReset}
                >
                  {langingPage?.reset[lang]}
                </Button>
              </div>
            </div>
          </div>{" "}
        </Form>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-3 md:gap-4 lg:gap-4 gap-y-6">
          {toiletData?.length > 0 ? (
            toiletData?.map((item, index) => (
              <Tooltip
                key={index}
                title={
                  <div>
                    <strong>
                      {lang === "en" ? item?.name : item?.name_hi}
                    </strong>
                    <div>Total Quantity: {item?.total}</div>
                    <div>Registered Quantity: {item?.registered}</div>
                  </div>
                }
                placement="top"
                // arrowPointAtCenter
                arrow={{ pointAtCenter: true }}
              >
                <div
                  className="relative p-3 border rounded-md shadow-md flex flex-col justify-between bg-gray-50"
                  style={{
                    minHeight: "170px",
                  }}
                  onClick={(e) => {
                    handleCleanData(item);
                  }}
                >
                  <div className="text-start flex-1">
                    <div className="text-sm text-gray-500 font-bold">
                      {lang === "en" ? item?.name : item?.name_hi}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-3 right-3 flex justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-semibold">
                        {item?.clean}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm font-semibold">
                        {item?.unclean}
                      </span>
                    </div>
                  </div>
                  <img
                    src={lines}
                    alt="Card Icon"
                    className="absolute bottom-0 right-0 h-full w-auto"
                  />
                </div>
              </Tooltip>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-32">
              {dict.no_data_available[lang]}
            </div>
          )}
        </div>
      </div>
      {/* total quantity */}
      <ViewVendorsSectors
        title={`${lang === "en" ? showData?.name : showData?.name_hi}`}
        openModal={showData}
        handleCancel={handleCancel}
        tableData={vendorDetails?.list || []}
        column={VendorWiseReportcolumns || []}
        footer={() => (
          <div className="flex justify-between">
            <strong>Total Vendors: {vendorsData?.length}</strong>
            <strong>Total : {count?.total || 0}</strong>
            <strong>Total Registered: {count?.registered || 0}</strong>
            <strong>Total Clean : {count?.clean || 0}</strong>
            <strong>Total Unclean: {count?.unclean || 0}</strong>
          </div>
        )}
      />
    </>
  );
};

export default TentageDetails;
