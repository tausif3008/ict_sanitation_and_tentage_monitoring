import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Button, Form, Input, message, Modal, Table } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import CommonTable from "../../../commonComponents/CommonTable";
import CommonDivider from "../../../commonComponents/CommonDivider";
import URLS from "../../../urils/URLS";
import { getData } from "../../../Fetch/Axios";
import {
  deleteVendorDetails,
  setUpdateVendorDetailsEl,
  setVendorDetailsListIsUpdated,
} from "./vendorDetailsSlice";
import { getPdfExcelData } from "../../asset/AssetsSlice";
import { exportToExcel } from "../../../Reports/ExportExcelFuntion";
import { ExportPdfFunction } from "../../../Reports/ExportPdfFunction";
import { VendorDetailsPdfFunction } from "./vendorDetailsPdf";
import { VendorDetailsToExcel } from "./vendorDetailsExcel";

const VendorDetails = () => {
  const [loading, setLoading] = useState(false);
  const [viewDeleteModal, setViewDeleteModal] = useState(false);
  const [proposedSectors, setProposedSectors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState();

  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const isUpdatedSelector = useSelector(
    (state) => state.vendorDetailsUpdateEl?.isUpdated
  );

  const handleProposedSectorsView = (data, record) => {
    setProposedSectors(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setViewDeleteModal(false);
    setIsModalVisible(false);
    setProposedSectors([]);
  };

  // handle delete
  const handleDelete = (data) => {
    form.setFieldsValue({
      asset_type_name: data?.asset_type_name,
      vendor_detail_id: data?.vendor_detail_id,
    });
    setViewDeleteModal(true);
  };

  // handle delete API
  const onFinish = async (value) => {
    const url = URLS?.deleteVendorDetails?.path + value?.vendor_detail_id;
    const res = await dispatch(deleteVendorDetails(url));
    if (res) {
      getDetails();
      message.success(
        "Vendor Details Deleted Successfully for " + value?.asset_type_name
      );
    } else {
      message.error("Something went wrong! Please try again.");
    }
    setViewDeleteModal(false);
  };

  const getDetails = async () => {
    setLoading(true);
    let uri = URLS.vendorDetails.path + params.id + "&";

    if (params.page) uri += params.page;
    if (params.per_page) uri += "&" + params.per_page;

    const res = await getData(uri, {
      "x-api-version": URLS.vendorDetails.version,
    });

    if (res) {
      const data = res.data;
      setLoading(false);
      setUserName(data.userdetails[0]?.user_name);

      const list = data.userdetails.map((el, index) => ({
        ...el,
        sr: index + 1,
        action: (
          <Button
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            key={el.name + index}
            onClick={() => {
              dispatch(setUpdateVendorDetailsEl({ updateElement: el }));
              navigate("/vendor/add-vendor-details-form/" + params.id);
            }}
          >
            <EditOutlined />
          </Button>
        ),
      }));

      setDetails({
        list,
        pageLength: data.paging[0].length,
        currentPage: data.paging[0].currentPage,
        totalRecords: data.paging[0].totalrecords,
      });
    }
  };

  useEffect(() => {
    dispatch(setUpdateVendorDetailsEl({ updateElement: null }));
  }, [dispatch]);

  useEffect(() => {
    if (params.id) {
      getDetails();
      if (isUpdatedSelector) {
        dispatch(setVendorDetailsListIsUpdated({ isUpdated: false }));
      }
    } else {
      navigate("/vendor");
    }
  }, [params, isUpdatedSelector, dispatch, navigate]);

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: "Category",
      dataIndex: "asset_main_type_name",
      key: "main_type",
    },
    {
      title: "Toilets & Tentage Type",
      dataIndex: "asset_type_name",
      key: "asset_type",
      width: 300,
    },
    {
      title: "Contract Number",
      dataIndex: "contract_number",
      key: "contract_number",
      width: 120,
    },
    {
      title: "Work Order Number",
      dataIndex: "work_order_number",
      key: "work_order_number",
      width: 120,
    },
    {
      title: "Allotted Quantity",
      dataIndex: "total_allotted_quantity",
      key: "total_allotted_quantity",
    },
    {
      title: "Proposed Sectors & Parking",
      dataIndex: "proposedsectors",
      key: "proposed_sectors",
      render: (text, record) => (
        <div
          onClick={() => handleProposedSectorsView(text, record)}
          className="text-blue-500 cursor-pointer"
        >
          View
        </div>
      ),
    },
    {
      title: "Manager Contact 1",
      dataIndex: "manager_contact_1",
      key: "manager_contact_1",
      width: 160,
    },
    {
      title: "Manager Contact 2",
      dataIndex: "manager_contact_2",
      key: "manager_contact_2",
      width: 160,
    },
    {
      title: "Date of Allocation",
      dataIndex: "date_of_allocation",
      key: "date_of_allocation",
      width: 160,
      render: (text) => {
        return text ? moment(text).format("DD-MMM-YYYY") : ""
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 130,
      render: (text, record) => (
        <>
          <div className="flex justify-between">
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              onClick={() => {
                const newObject = Object.keys(record)
                  .filter((key) => key !== "action") // Filter out 'action'
                  .reduce((obj, key) => {
                    obj[key] = record[key]; // Rebuild the object without 'action'
                    return obj;
                  }, {});
                dispatch(setUpdateVendorDetailsEl({ updateElement: record }));
                navigate(`/vendor/add-vendor-details-form/${params?.id}`, {
                  state: {
                    key: "UpdateKey",
                    record: newObject, // Pass the record as part of the state
                  },
                });
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
              onClick={() => {
                handleDelete(record);
              }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        </>
      ),
    },
  ];

  const totalAllottedQuantity = details.list
    .reduce(
      (total, item) => total + Number(item.total_allotted_quantity || 0),
      0
    )
    .toLocaleString(); // Convert to digit format with commas

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Category",
    "Toilets & Tentage Type",
    // "Contract Number",
    // "Work Order Number",
    "Total Allotted Quantity",
    // "Date of Allocation",
    // "Country",
  ];

  // pdf header
  const subTableHeader = [
    "Sector Name / Parking Name",
    "Quantity",
  ];

  // excel && pdf file
  const exportToFile = async (isExcel) => {
    try {
      const url = URLS.vendorDetails.path + `${params?.id}&page=1&per_page=5000`;

      const res = await dispatch(
        getPdfExcelData(`${url}${searchQuery ? searchQuery : ""}`)
      );

      if (!res?.data?.userdetails) {
        throw new Error("No data found in the response data.");
      }

      // Map data for Excel
      const myexcelData =
        isExcel &&
        res?.data?.userdetails?.map((data, index) => {
          return {
            Sr: index + 1,
            "Category": data?.asset_main_type_name,
            "Toilets & Tentage Type": data?.asset_type_name,
            "Total Allotted Quantity": Number(data?.total_allotted_quantity),
            "Sector / Parking": [...data?.proposedsectors?.map((item) => [
              item?.sector_name,
              Number(item?.quantity),
            ]),
            ...data?.proposedparkings?.map((item) => [
              item?.parking_name,
              Number(item?.quantity),
            ])]
          };
        });

      const pdfData =
        !isExcel &&
        res?.data?.userdetails?.map((data, index) => [
          index + 1,
          data?.asset_main_type_name,
          data?.asset_type_name,
          // Number(data?.contract_number),
          // Number(data?.work_order_number),
          Number(data?.total_allotted_quantity),
          // moment(data?.date_of_allocation).format("DD-MMM-YYYY"),
          [...data?.proposedsectors?.map((item) => [
            item?.sector_name,
            item?.quantity,
          ]),
          ...data?.proposedparkings?.map((item) => [
            item?.parking_name,
            item?.quantity,
          ])]
        ]);

      // Call the export function
      isExcel && VendorDetailsToExcel(myexcelData, `${userName} Vendor Details`);

      // Call the export function
      !isExcel &&
        VendorDetailsPdfFunction(
          `${userName} Vendor Details`,
          `${userName} Vendor Details`,
          pdfHeader,
          pdfData,
          subTableHeader,
          true
        );
    } catch (error) {
      message.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
  };


  return (
    <div>
      <div className="flex gap-2 items-center">
        <Link to="/vendor">
          <Button className="bg-gray-200 rounded-full w-9 h-9">
            <ArrowLeftOutlined />
          </Button>
        </Link>

        <div className="w-full">
          <CommonDivider
            label={
              <div>
                Vendor Details For{" "}
                <span className="text-blue-500">{userName}</span>
              </div>
            }
            compo={
              <Button
                className="bg-orange-300 mb-1"
                onClick={() =>
                  // navigate("/vendor/add-vendor-details-form/" + params.id)
                  navigate(`/vendor/add-vendor-details-form/${params?.id}`, {
                    state: {
                      key: "AddKey",
                    },
                  })
                }
              >
                Add Details
              </Button>
            }
          />
          <div className="flex justify-end gap-2 font-semibold mb-4">
            <div>
              <Button
                type="primary"
                onClick={() => {
                  exportToFile(false);
                }}
              >
                Download Pdf
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  exportToFile(true);
                }}
              >
                Download Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CommonTable
        columns={columns}
        uri={"vendor/add-vendor-details/" + params.id}
        details={details}
        loading={loading}
      />

      <div className="text-right font-semibold mt-2">
        Total Allotted Quantity: {totalAllottedQuantity}
      </div>

      {/* sectors */}
      <Modal
        title={`Proposed Sectors & Parking`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {proposedSectors?.proposedsectors?.length ? (
          <>
            <Table
              bordered
              dataSource={proposedSectors?.proposedsectors}
              rowKey="sector_name"
              className="mb-4"
              pagination={false}
              scroll={{ x: 300, y: 400 }}
              columns={[
                {
                  title: "Sector Name",
                  dataIndex: "sector_name",
                  key: "sector_name",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
              ]}
            />
          </>
        ) : (
          <p>No sectors found for this asset type.</p>
        )}
        {proposedSectors?.proposedparkings?.length ? (
          <>
            <Table
              bordered
              className="mb-4"
              dataSource={proposedSectors?.proposedparkings}
              rowKey="sector_name"
              pagination={false}
              scroll={{ x: 300, y: 400 }}
              columns={[
                {
                  title: "Parking Name",
                  dataIndex: "parking_name",
                  key: "parking_name",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
              ]}
            />
          </>
        ) : (
          <p>No Parking found for this asset type.</p>
        )}
        {(proposedSectors?.proposedsectors?.length ||
          proposedSectors?.proposedparkings?.length) && (
            <div className="text-right font-semibold mt-2">
              Total Quantity:{" "}
              {(
                proposedSectors?.proposedparkings?.reduce(
                  (total, park) => total + Number(park?.quantity || 0),
                  0
                ) +
                proposedSectors?.proposedsectors?.reduce(
                  (total, sector) => total + Number(sector?.quantity || 0),
                  0
                )
              ).toLocaleString()}
            </div>
          )}
      </Modal>

      <Modal
        title="Delete Vendor Details"
        open={viewDeleteModal}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <p>Are you sure you want to delete this Vendor Details?</p>

          {/* Optional: Confirmation Checkbox or other fields */}
          <Form.Item name="asset_type_name">
            <Input disabled className="w-full" placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item name="vendor_detail_id">
            <Input disabled className="w-full" placeholder="Enter quantity" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button type="primary" danger htmlType="submit">
                Delete
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorDetails;
