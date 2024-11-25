import React, { useState, useEffect } from "react";
import { DatePicker, Select, message, Tooltip, Button, Form } from "antd";
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

const ToiletDetails = () => {
  const dateFormat = "YYYY-MM-DD";
  const validAssetTypes = ["1", "2", "3", "4", "5"];

  const [dict, lang] = useOutletContext();
  const [assetData, setAssetData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { VendorListDrop } = VendorSupervisorSelector(); // vendor list
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
  }, []);

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
          <Form.Item label={`${langingPage?.date[lang]}`} name="date">
            <DatePicker
              allowClear={false}
              format={dateFormat}
              placeholder="Select Date"
              className="w-full rounded-none"
            />
          </Form.Item>
          <Form.Item label={`${dict?.sector[lang]}`} name="sector_id">
            <Select
              placeholder={`${dict?.sector[lang]}`}
              allowClear
              showSearch
              filterOption={(input, option) => {
                return option?.children
                  ?.toLowerCase()
                  ?.includes(input?.toLowerCase());
              }}
              className="rounded-none"
            >
              {SectorListDrop?.map((option) => (
                <Select.Option key={option?.value} value={option?.value}>
                  {option?.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={`${dict?.vendor[lang]}`} name="vendor_id">
            <Select
              placeholder={`${dict?.vendor[lang]}`}
              allowClear
              showSearch
              filterOption={(input, option) => {
                return option?.children
                  ?.toLowerCase()
                  ?.includes(input?.toLowerCase());
              }}
              className="rounded-none"
            >
              {VendorListDrop?.map((option) => (
                <Select.Option key={option?.value} value={option?.value}>
                  {option?.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={`${DICT?.toilet[lang]}`} name="asset_type_id">
            <Select
              placeholder={`${DICT?.toilet[lang]}`}
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
          </Form.Item>{" "}
        </div>
        <div className="flex justify-start space-x-2">
          <div>
            <Button
              loading={loading}
              type="button"
              // htmlType="submit"
              className="w-fit rounded-none text-white bg-orange-400"
              onClick={handleReset}
            >
              {langingPage?.reset[lang]}
            </Button>
          </div>
          <div>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="w-fit rounded-none bg-5c"
            >
              {dict?.search[lang]}
            </Button>
          </div>
        </div>{" "}
      </Form>

      <div
        className={`grid ${
          showAll
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
            : "sm:grid-cols-2 xl:grid-cols-3 md:grid-cols-3"
        } gap-3 sm:gap-3 md:gap-4 lg:gap-4`}
      >
        {toiletData?.length > 0 ? (
          toiletData
            ?.filter((data) =>
              showAll ? true : validAssetTypes.includes(data?.asset_type_id)
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
                arrowPointAtCenter
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
