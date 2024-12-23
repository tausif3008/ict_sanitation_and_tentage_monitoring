import React, { useState, useEffect } from "react";
import { Select, Tooltip, Button, Form } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import lines from "../assets/Dashboard/lines.png";
import { getSectorsList } from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import VendorSupervisorSelector from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getVendorList } from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import SanitationDashSelector from "./Slice/sanitationDashboardSelector";
import { getSanitationDashData } from "./Slice/sanitationDashboard";
import { getFormData } from "../urils/getFormData";
import { DICT, langingPage } from "../utils/dictionary";
import QuestionSelector from "../register/questions/questionSelector";
import { priorityToiletTypes_Id } from "../constant/const";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import CustomSelect from "../commonComponents/CustomSelect";
import { getQuestionList } from "../register/questions/questionSlice";

const ToiletDetails = () => {
  const [dict, lang] = useOutletContext();
  const [assetData, setAssetData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { VendorListDrop } = VendorSupervisorSelector(); // vendor list
  const { QuestionDrop } = QuestionSelector(); // questions
  const { SanitationDash_data, loading } = SanitationDashSelector(); // sanitation dashboard
  const toiletData = assetData?.asset_types || [];

  // Reset the form
  const handleReset = () => {
    form.resetFields();
    todayData();
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
    };
    form.setFieldValue("question_id", "1");
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
    dispatch(getVendorList()); // vendor details
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

  return (
    <div className="p-4 bg-white rounded-xl space-y-4">
      <div className="text-xl font-bold">
        {dict.sanitation_toilet_details[lang]}
      </div>
      <div className="flex justify-start items-center space-x-6 mb-1">
        <div className="flex items-center mb-4 mr-6">
          <div className="flex items-center mr-6">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xl">{dict.clean[lang]}</span>
          </div>
          <div className="flex items-center mr-6">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xl">{dict.unclean[lang]}</span>
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
          <CustomSelect
            name={"vendor_id"}
            label={`${dict?.select_vendor[lang]}`}
            placeholder={`${dict?.select_vendor[lang]}`}
            options={VendorListDrop || []}
          />
          <Form.Item
            label={`${DICT?.select_toilet[lang]}`}
            name="asset_type_id"
          >
            <Select
              placeholder={`${DICT?.select_toilet[lang]}`}
              allowClear
              showSearch
              filterOption={(input, option) => {
                return option?.children
                  ?.toLowerCase()
                  ?.includes(input?.toLowerCase());
              }}
              className="rounded-none"
            >
              {toiletData?.map((option) => (
                <Select.Option
                  key={option?.asset_type_id}
                  value={option?.asset_type_id}
                >
                  {option?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
                className="w-fit rounded-none text-white bg-orange-400 hover:bg-orange-600"
                onClick={handleReset}
              >
                {langingPage?.reset[lang]}
              </Button>
            </div>
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
                  className={`relative p-3 border rounded-md shadow-md flex flex-col justify-between bg-gray-50 ${
                    showAll ? "" : "h-40"
                  }`}
                  style={{
                    minHeight: "110px",
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

      {toiletData?.length > 0 ? (
        !showAll ? (
          <Button
            size="medium"
            type="primary"
            onClick={() => setShowAll(true)}
            className="w-32 bg-orange-400 font-semibold"
            style={{ flexShrink: 0 }}
          >
            {dict.see_more[lang]}
          </Button>
        ) : (
          <Button
            size="medium"
            type="primary"
            onClick={() => setShowAll(false)}
            className="w-32 bg-orange-400 font-semibold"
            style={{ flexShrink: 0 }}
          >
            {dict.show_less[lang]}
          </Button>
        )
      ) : null}
    </div>
  );
};

export default ToiletDetails;
