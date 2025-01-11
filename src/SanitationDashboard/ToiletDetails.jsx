import React, { useState, useEffect, useMemo } from "react";
import { Select, Tooltip, Button, Form } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import lines from "../assets/Dashboard/lines.png";
import { getSectorsList } from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import SanitationDashSelector from "./Slice/sanitationDashboardSelector";
import { getSanitationDashData } from "./Slice/sanitationDashboard";
import { getFormData } from "../urils/getFormData";
import { DICT, langingPage } from "../utils/dictionary";
import QuestionSelector from "../register/questions/questionSelector";
import {
  getPercentage,
  priorityToiletTypes_Id,
  VendorWiseReportcolumns,
} from "../constant/const";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import CustomSelect from "../commonComponents/CustomSelect";
import { getQuestionList } from "../register/questions/questionSlice";
import ViewVendorsSectors from "../register/AssetType/viewVendors";
import URLS from "../urils/URLS";
import {
  getVendorCategoryTypeDrop,
  getVendorReports,
} from "../Reports/VendorwiseReports/vendorslice";
import VendorSelectors from "../Reports/VendorwiseReports/vendorSelectors";

const ToiletDetails = () => {
  const [dict, lang] = useOutletContext();
  const [assetData, setAssetData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showData, setShowData] = useState(null);
  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    clean: 0,
    maintenance: 0,
    unclean: 0,
  });

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { QuestionDrop } = QuestionSelector(); // questions
  const { SanitationDash_data, loading } = SanitationDashSelector(); // sanitation dashboard
  const { vendorReports, VendorReport_Loading, VendorCatTypeDrop } =
    VendorSelectors(); // vendor dropdown & Reports
  const vendorsData = vendorReports?.data?.vendors || [];
  const toiletData = assetData?.asset_types || [];

  const typeDropdown = useMemo(() => {
    return (
      toiletData?.map((item) => ({
        value: item?.asset_type_id,
        label: item?.name,
      })) || []
    );
  }, [toiletData]);

  const userRoleId = localStorage.getItem("role_id");
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
      maintenance: 0,
      unclean: 0,
    });
  };

  // show module
  const handleCleanData = async (data) => {
    const formValue = form.getFieldsValue();
    const finalData = {
      asset_main_type_id: data?.asset_main_type_id,
      asset_type_id: data?.asset_type_id,
      ...(formValue?.vendor_id && { vendor_id: formValue?.vendor_id }),
      ...(formValue?.sector_id && { sector_id: formValue?.sector_id }),
      date: dayjs(formValue?.date).format("YYYY-MM-DD"),
    };

    const formData = await getFormData(finalData);
    const url = URLS?.vendorReporting?.path;
    dispatch(getVendorReports(url, formData)); // vendor reports
    setTimeout(() => {
      setShowData(data);
    }, 500);
  };

  // Handle form submission
  const onFinish = async (values) => {
    const dayjsDate = new Date(values?.date);
    const formattedDate = moment(dayjsDate).format("YYYY-MM-DD");
    const finalValues = {
      ...(values?.sector_id && { sector_id: values?.sector_id }),
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      ...(values?.question_id && { question_id: values?.question_id }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
    };
    const formData = await getFormData(finalValues);
    dispatch(getSanitationDashData(formData));
  };

  // today date
  const todayData = async () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
    });
    const finalData = {
      date: newDate,
      question_id: 1,
      ...(userRoleId === "9" && {
        sector_id: userSectorId,
      }),
    };
    form.setFieldValue("question_id", "1");
    userRoleId === "9" && form.setFieldValue("sector_id", userSectorId);
    const formData = await getFormData(finalData);
    dispatch(getSanitationDashData(formData));
  };

  useEffect(() => {
    if (SanitationDash_data) {
      setAssetData(SanitationDash_data?.data); // sanitation data
    }
  }, [SanitationDash_data]);

  useEffect(() => {
    todayData(); // today data
    const paramData = {
      asset_main_type_id: 1,
    };
    dispatch(getVendorCategoryTypeDrop(paramData)); // asset type wise vendor list
    dispatch(getSectorsList()); // all sectors
    dispatch(getQuestionList()); // get question
  }, []);

  const sortedArray =
    toiletData
      ?.map((item) => ({
        ...item,
        asset_type_id: Number(item?.asset_type_id),
      }))
      ?.sort((a, b) => a?.asset_type_id - b?.asset_type_id) || []; // Sort in ascending order

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
      const totalMonitoring = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.todaysmonitaring) || 0,
        0
      );
      const partially_compliant = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.partially_compliant) || 0,
        0
      );
      const compliant = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.compliant) || 0,
        0
      );
      const not_compliant = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.not_compliant) || 0,
        0
      );
      const toiletunclean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.toiletunclean) || 0,
        0
      );

      setCount({
        total: total,
        registered: totalReg,
        monitoring: totalMonitoring,
        partially_compliant: partially_compliant,
        compliant: compliant,
        not_compliant: not_compliant,
        toiletunclean: toiletunclean,
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

  return (
    <>
      <div className="p-4 bg-white rounded-xl space-y-4">
        <div className="text-xl font-bold">
          {dict.sanitation_toilet_details[lang]}
        </div>
        <div className="flex justify-start items-center space-x-6 mb-1">
          <div className="flex items-center mb-4 mr-6">
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">{dict.todays_monitoring[lang]}</span>
            </div>
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 bg-yellow-400 rounded-full mr-2"></div>
              {/* <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div> */}
              {/* <span className="text-sm">{dict.clean[lang]}</span> */}
              <span className="text-sm">{dict.Partial_Complaint[lang]}</span>
            </div>
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
              {/* <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div> */}
              {/* <span className="text-sm">{"Not Compliant"}</span> */}
              <span className="text-sm">{dict.not_Complaint[lang]}</span>
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
              allowClear={userRoleId === "9" ? false : true}
              label={`${dict?.select_sector[lang]}`}
              placeholder={`${dict?.select_sector[lang]}`}
              options={userRoleId === "9" ? SectorArray : SectorListDrop || []}
            />
            <CustomSelect
              name={"vendor_id"}
              label={`${dict?.select_vendor[lang]}`}
              placeholder={`${dict?.select_vendor[lang]}`}
              options={VendorCatTypeDrop || []}
            />
            <CustomSelect
              name={"asset_type_id"}
              label={`${DICT?.select_toilet[lang]}`}
              placeholder={`${DICT?.select_toilet[lang]}`}
              options={typeDropdown || []}
            />
            <CustomSelect
              name="question_id" // This is the field name
              label={dict.select_question[lang]}
              placeholder={dict.select_question[lang]}
              options={QuestionDrop || []}
            />
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
          </div>
        </Form>

        <div
          className={`grid ${
            showAll
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
              : "sm:grid-cols-2 xl:grid-cols-3 md:grid-cols-3"
          } gap-3 sm:gap-3 md:gap-4 lg:gap-4`}
        >
          {sortedArray?.length > 0 ? (
            sortedArray
              ?.filter((data) =>
                showAll
                  ? true
                  : priorityToiletTypes_Id.includes(
                      data?.asset_type_id?.toString()
                    )
              )
              ?.map((item, index) => (
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
                  arrow={{ pointAtCenter: true }}
                >
                  <div
                    className={`relative p-3 border rounded-md shadow-md flex min-h-[110px] flex-col justify-between bg-gray-50 ${
                      showAll ? "" : "h-40"
                    }`}
                    onClick={(e) => {
                      handleCleanData(item);
                    }}
                  >
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500 font-bold">
                        {lang === "en" ? item?.name : item?.name_hi}
                      </div>
                      <div
                        className="flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold">
                          {item?.todaysmonitaring || 0}
                        </span>
                      </div>
                    </div>
                    {/* <div className="text-start flex-1">
                      <div className="text-sm text-gray-500 font-bold">
                        {lang === "en" ? item?.name : item?.name_hi}
                      </div>
                    </div> */}
                    <div className="absolute bottom-4 left-3 right-3 flex justify-between">
                      <div
                        className="flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold">
                          {getPercentage(
                            Number(item?.partially_compliant) || 0,
                            (Number(item?.toiletclean) || 0) +
                              (Number(item?.toiletunclean) || 0)
                          ) + "%"}
                          {/* {item?.partially_compliant || 0} */}
                        </span>
                      </div>
                      <div
                        className="flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold">
                          {/* {item?.clean} */}
                          {/* {item?.not_compliant || 0} */}
                          {getPercentage(
                            Number(item?.not_compliant) || 0,
                            (Number(item?.toiletclean) || 0) +
                              (Number(item?.toiletunclean) || 0)
                          ) + "%"}
                        </span>
                      </div>
                      <div
                        className="flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold">
                          {/* {item?.toiletunclean || 0} */}
                          {getPercentage(
                            Number(item?.toiletunclean) || 0,
                            (Number(item?.toiletclean) || 0) +
                              (Number(item?.toiletunclean) || 0)
                          ) + "%"}
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

        {toiletData?.length > 0 ? (
          !showAll ? (
            <Button
              size="medium"
              type="primary"
              onClick={() => setShowAll(true)}
              className="w-32 bg-orange-400 font-semibold flex-shrink-0"
            >
              {dict.see_more[lang]}
            </Button>
          ) : (
            <Button
              size="medium"
              type="primary"
              onClick={() => setShowAll(false)}
              className="w-32 bg-orange-400 font-semibold flex-shrink-0"
            >
              {dict.show_less[lang]}
            </Button>
          )
        ) : null}
      </div>

      {/* total quantity */}
      <ViewVendorsSectors
        width={1200}
        loading={VendorReport_Loading}
        title={`${lang === "en" ? showData?.name : showData?.name_hi}`}
        openModal={showData && !loading}
        handleCancel={handleCancel}
        tableData={vendorDetails?.list || []}
        column={VendorWiseReportcolumns || []}
        footer={() => (
          <div className="flex justify-between">
            <strong>Vendors: {vendorsData?.length}</strong>
            <p></p>
            <p></p>
            <p></p>
            <strong>Total: {count?.total || 0}</strong>
            <strong>Registered: {count?.registered || 0}</strong>
            <strong>Monitoring : {count?.monitoring || 0}</strong>
            <strong>
              Partialy Compliant : {count?.partially_compliant || 0}
            </strong>
            <strong>Compliant : {count?.compliant || 0}</strong>
            <strong>Not Compliant: {count?.not_compliant || 0}</strong>
            <strong>Unclean: {count?.toiletunclean || 0}</strong>
          </div>
        )}
      />
    </>
  );
};

export default ToiletDetails;
