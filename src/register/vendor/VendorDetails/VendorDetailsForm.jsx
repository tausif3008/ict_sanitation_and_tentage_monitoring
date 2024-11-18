import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  DatePicker,
  message,
  Space,
  InputNumber,
} from "antd";
import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { postData } from "../../../Fetch/Axios";
import URLS from "../../../urils/URLS";
import { getFormData } from "../../../urils/getFormData";
import optionsMaker from "../../../urils/OptionMaker";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setVendorDetailsListIsUpdated } from "./vendorDetailsSlice";
import dayjs from "dayjs";
import CommonFormDropDownMaker from "../../../commonComponents/CommonFormDropDownMaker";
import { getParkingData } from "../../parking/parkingSlice";
import ParkingSelector from "../../parking/parkingSelector";
import { getValueLabel } from "../../../constant/const";

const { Option } = Select;

const dateFormat = "YYYY-MM-DD";

const VendorDetailsForm = () => {
  const [loading, setLoading] = useState(false);
  const [assetTypes, setAssetTypes] = useState([]);
  const [assetMainTypeId, setAssetMainTypeId] = useState();
  const [sectorOptions, setSectorOptions] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [parkQuantity, setParkQuantity] = useState(0);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;
  const { parkingDrop } = ParkingSelector();

  // Prepopulate form if editing vendor details
  useEffect(() => {
    if (key === "UpdateKey") {
      const parkEdit = record?.proposedparkings?.map((data) => {
        return {
          quantity: data?.quantity,
          parking: data?.parking_id,
        };
      });

      // Calculate the total parking quantity using reduce
      const totalParkingQuantity = record?.proposedparkings?.reduce(
        (total, data) => {
          return total + Number(data?.quantity); // Add quantity to the total sum
        },
        0
      ); // 0 is the initial value of total

      setParkQuantity(totalParkingQuantity);

      form.setFieldsValue({
        parking_info: parkEdit,
      });
      setAssetMainTypeId(record?.asset_main_type_id);
      const updatedDetails = { ...record };

      updatedDetails.date_of_allocation = dayjs(
        updatedDetails.date_of_allocation
      );

      const sector_info = [];

      let quantity = 0;

      if (updatedDetails.proposedsectors.length) {
        quantity =
          quantity + updatedDetails.proposedsectors[0]?.quantity * 1 || 0;

        form.setFieldsValue({
          sector: updatedDetails.proposedsectors[0].sector_id,
          quantity: updatedDetails.proposedsectors[0]?.quantity * 1 || 0,
        });

        for (
          let index = 1;
          index < updatedDetails.proposedsectors.length;
          index++
        ) {
          sector_info.push({
            sector: updatedDetails.proposedsectors[index].sector_id,
            quantity: updatedDetails.proposedsectors[index]?.quantity * 1 || 0,
          });
          quantity =
            quantity + updatedDetails.proposedsectors[index]?.quantity * 1 || 0;
        }
        setQuantity(quantity);

        form.setFieldsValue({
          sector_info,
        });
      }
      form.setFieldsValue(updatedDetails);
    }
  }, [key, record, form]);

  // Populate asset types for selection
  useEffect(() => {
    if (assetMainTypeId)
      optionsMaker(
        "vendorAsset",
        "assettypes",
        "name",
        setAssetTypes,
        "?asset_main_type_id=" + assetMainTypeId,
        "asset_type_id"
      );
  }, [assetMainTypeId]);

  // handle sector
  const handelQuantitySector = () => {
    const vals = form.getFieldsValue();

    const selected = [];
    selected.push(vals.sector);

    if (vals?.sector_info) {
      for (const key of vals?.sector_info) {
        if (key?.sector) {
          if (selected.includes(key.sector)) {
            message.info("Sector Already Selected!");
          } else {
            selected.push(key.sector);
          }
        }
      }
    }
  };
  // handle parking
  const handelQuantityParking = () => {
    const vals = form.getFieldsValue();

    const selected = [];
    selected.push(vals.parking);

    if (vals?.sector_info) {
      for (const key of vals?.parking_info) {
        if (key?.parking) {
          if (selected.includes(key.parking)) {
            message.info("Parking Already Selected!");
          } else {
            selected.push(key.parking);
          }
        }
      }
    }
  };

  // sector quantity
  const handelQuantity = () => {
    const vals = form.getFieldsValue();

    let total = 0;

    total = vals.quantity;

    if (vals?.sector_info) {
      for (const key of vals?.sector_info) {
        if (key?.quantity) total = total + key?.quantity;
      }
    }

    setQuantity(() => {
      return total;
    });
  };

  // parking quantity
  const handelParkQuantity = () => {
    const vals = form.getFieldsValue();
    let total = 0;

    if (vals?.parking_info) {
      for (const key of vals?.parking_info) {
        if (Number(key?.quantity)) total = total + Number(key?.quantity);
      }
    }

    setParkQuantity(() => {
      return Number(total);
    });
  };

  const onFinish = async (values) => {
    setLoading(true);

    if (params.id) {
      values.user_id = params.id;
    } else {
      return message.info("Invalid User");
    }

    if (values.date_of_allocation) {
      values.date_of_allocation = values.date_of_allocation.format(dateFormat);
    }

    if (key === "UpdateKey") {
      values.vendor_detail_id = record?.vendor_detail_id;
    }

    const vals = form.getFieldsValue();

    const selectedSectors = []; // id
    const quantities = []; // quantity

    selectedSectors.push(vals.sector);
    quantities.push(vals.quantity);

    if (vals?.sector_info) {
      for (const key of vals?.sector_info) {
        if (key?.sector) {
          if (selectedSectors.includes(key.sector)) {
            for (const key1 of sectorOptions) {
              if (key1?.value == key?.sector) {
                message.error(key1.label + " Found duplicate");
                setLoading(false);
                return;
              }
            }
          } else {
            selectedSectors.push(key.sector);
            quantities.push(key.quantity);
          }
        }
      }
    }

    values.proposed_sectors_quantity = quantities.join(",");
    values.proposed_sectors_id = selectedSectors.join(",");
    values.total_allotted_quantity = Number(quantity) + parkQuantity;
    delete values["sector_info"];

    //  parking
    const selectedParking = []; // id
    const park_quantity = []; // quantity

    if (vals?.parking_info) {
      for (const key of vals?.parking_info) {
        if (key?.parking) {
          if (selectedParking.includes(key.parking)) {
            for (const key1 of sectorOptions) {
              if (key1?.value == key?.parking) {
                const keyLabel = getValueLabel(
                  key1?.value,
                  parkingDrop,
                  "parking"
                );
                message.error(keyLabel + " Found duplicate");
                setLoading(false);
                return;
              }
            }
          } else {
            selectedParking.push(key.parking);
            park_quantity.push(key.quantity);
          }
        }
      }
    }

    values.proposed_parkings_quantity = park_quantity.join(",");
    values.proposed_parkings_id = selectedParking.join(",");
    delete values["parking_info"];

    const res = await postData(
      getFormData(values),
      key === "UpdateKey"
        ? URLS.editVendorDetails.path
        : URLS.addVendorDetails.path,
      {
        version: URLS.addVendorDetails.version,
      }
    );

    if (res) {
      if (res.data.success) {
        form.resetFields();
        dispatch(setVendorDetailsListIsUpdated({ isUpdated: true }));

        if (key === "UpdateKey") {
          navigate("/vendor/add-vendor-details/" + params.id);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (params.id) {
    } else {
      navigate("/vendor");
    }
  }, [params, navigate]);

  useEffect(() => {
    optionsMaker(
      "sectors",
      "sectors",
      "name",
      setSectorOptions,
      "",
      "sector_id"
    );

    // get parking data
    const url = URLS?.parking?.path;
    dispatch(getParkingData(url));
  }, []);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              if (params.id)
                navigate("/vendor/add-vendor-details/" + params.id);
              else navigate("/vendor");
            }}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between ">
            <div className="font-bold">
              {key === "UpdateKey"
                ? `Update Vendor Details ${record?.user_name}`
                : "Vendor Details"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <CommonFormDropDownMaker
              uri={"assetMainTypePerPage"}
              responseListName="assetmaintypes"
              responseLabelName="name"
              responseIdName="asset_main_type_id"
              selectLabel={"Asset Main Type"}
              selectName={"asset_main_type_id"}
              required={true}
              RequiredMessage={"Main type is required!"}
              setValue={setAssetMainTypeId}
            ></CommonFormDropDownMaker>
            <Form.Item
              label={<div className="font-semibold">Asset Type</div>}
              name="asset_type_id"
              rules={[{ required: true, message: "Please enter asset type" }]}
              className="mb-4 w-full"
            >
              <Select
                showSearch
                placeholder="Select Asset Type"
                optionFilterProp="children"
              >
                {assetTypes.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">LOE Number</div>}
              name="contract_number"
              rules={[{ required: true, message: "Please enter LOE number" }]}
              className="mb-4"
            >
              <Input placeholder="Enter LOE number" className="rounded-none" />
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Manager Contact 1</div>}
              name="manager_contact_1"
              rules={[
                { required: true, message: "Please enter manager contact 1" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Enter manager contact 1"
                className="rounded-none"
              />
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Manager Contact 2</div>}
              name="manager_contact_2"
              rules={[
                { required: true, message: "Please enter manager contact 2" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Enter manager contact 2"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              label={<div className="font-semibold">Work Order Number</div>}
              name="work_order_number"
              rules={[
                { required: true, message: "Please enter work order number" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Enter work order number"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              label="Date of Allocation"
              name="date_of_allocation"
              rules={[
                { required: true, message: "Please select date of allocation" },
              ]}
            >
              <DatePicker
                format={dateFormat}
                placeholder="Select Date"
                className="w-full"
              />
            </Form.Item>

            <div className="col-span-3 font-semibold ">
              Total Alloted Quantity: {quantity + parkQuantity}
            </div>

            <div className="col-span-3 grid grid-cols-3 justify-start items-start gap-3 mt-3 mb-2">
              <Form.Item
                label="Sector"
                name="sector"
                rules={[
                  {
                    required: true,
                    message: "Please select sector!",
                  },
                ]}
              >
                <Select
                  onChange={handelQuantitySector}
                  placeholder="Select a sector"
                >
                  {sectorOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please select quantity!",
                  },
                ]}
              >
                <InputNumber
                  onInput={handelQuantity}
                  className="w-full"
                  placeholder="Quantity"
                />
              </Form.Item>
            </div>
            <div></div>
          </div>

          <Form.List name="sector_info">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    className="grid grid-cols-3 justify-start items-start gap-3 mt-3 mb-2"
                    key={key}
                  >
                    <div className="w-full ">
                      <Form.Item
                        {...restField}
                        name={[name, "sector"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select sector!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select a sector"
                          onChange={handelQuantitySector}
                        >
                          {sectorOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="">
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        rules={[
                          {
                            required: true,
                            message: "Please enter quantity!",
                          },
                        ]}
                      >
                        <InputNumber
                          onInput={handelQuantity}
                          className="w-full"
                          placeholder="Enter quantity"
                        />
                      </Form.Item>
                    </div>

                    <div className="flex ">
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                          handelQuantity();
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Sector
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* <div className="col-span-3 mb-4 font-semibold ">
            Total Alloted Parking Quantity: {parkQuantity}
          </div> */}
          <Form.List name="parking_info">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    className="grid grid-cols-3 justify-start items-start gap-3 mt-3 mb-2"
                    key={key}
                  >
                    <div className="w-full ">
                      <Form.Item
                        {...restField}
                        name={[name, "parking"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select Parking!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select a parking"
                          onChange={handelQuantityParking}
                        >
                          {parkingDrop?.map((option) => (
                            <Option key={option?.value} value={option?.value}>
                              {option?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="">
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        rules={[
                          {
                            required: true,
                            message: "Please enter quantity!",
                          },
                        ]}
                      >
                        <InputNumber
                          onInput={handelParkQuantity}
                          className="w-full"
                          placeholder="Enter quantity"
                        />
                      </Form.Item>
                    </div>

                    <div className="flex ">
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                          handelParkQuantity();
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Parking
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {key === "UpdateKey" ? "Update" : "Register"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VendorDetailsForm;
