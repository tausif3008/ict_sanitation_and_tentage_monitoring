import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Collapse, Form, Button } from "antd";
import CommonDivider from "../../commonComponents/CommonDivider"; // Adjust path as necessary
import { getParkingData } from "./parkingSlice";
import URLS from "../../urils/URLS";
import ParkingSelector from "./parkingSelector";
import CustomTable from "../../commonComponents/CustomTable";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import search from "../../assets/Dashboard/icon-search.png";
import { getValueLabel } from "../../constant/const";

const ParkingList = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { parkingData, loading } = ParkingSelector(); // parking data
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const url = URLS?.parking?.path;

  // filter finish
  const onFinishForm = (values) => {
    const finalValues = {
      ...(values?.mapped_sector_id && {
        mapped_sector_id: values?.mapped_sector_id,
      }),
      ...(values?.keywards && { keywards: values?.keywards }),
    };
    dispatch(getParkingData(url, finalValues)); // get parking data
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    dispatch(getParkingData(url)); // get parking data
  };

  useEffect(() => {
    if (parkingData?.success) {
      setDetails(() => {
        return {
          list: parkingData?.data?.parkings,
        };
      });
    } else {
      setDetails({
        list: [],
        pageLength: 25,
        currentPage: 1,
      });
    }
  }, [parkingData]);

  useEffect(() => {
    dispatch(getParkingData(url)); // get parking data
    dispatch(getSectorsList()); // all sectors
  }, []);

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "sr_no",
      key: "sr_no",
      width: 100,
      render: (text, record, index) => index + 1,
    },
    { title: "Parking Name", dataIndex: "name", key: "name" },
    {
      title: "Sector Name",
      dataIndex: "mapped_sector_id",
      key: "mapped_sector_id",
      render: (text) => {
        return text ? getValueLabel(text, SectorListDrop, null) || "-" : "-";
      },
    },
  ];

  return (
    <div>
      <CommonDivider
        label={"Parking List"}
        compo={
          <Button
            onClick={() =>
              navigate("/add-parking-form", {
                state: {
                  key: "AddKey",
                },
              })
            }
            className="bg-orange-300 mb-1"
          >
            Add Parking
          </Button>
        }
      ></CommonDivider>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                  <CustomInput
                    label="Parking Name"
                    name="keywards"
                    placeholder="Enter Parking Name"
                  />
                  <CustomSelect
                    name={"mapped_sector_id"}
                    label={"Select Sector"}
                    placeholder={"Select Sector"}
                    options={SectorListDrop || []}
                  />
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <div>
                      <Button
                        loading={loading}
                        type="button"
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        Search
                      </Button>
                    </div>
                    <div>
                      <Button
                        loading={loading}
                        type="button"
                        className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            ),
          },
        ]}
      />
      <CustomTable
        loading={loading}
        columns={columns || []}
        bordered
        dataSource={details || []}
        scroll={{ x: 1000, y: 400 }}
        pagination={true}
        tableSubheading={{
          "Total Records": details?.list?.length,
        }}
      />
    </div>
  );
};

export default ParkingList;
