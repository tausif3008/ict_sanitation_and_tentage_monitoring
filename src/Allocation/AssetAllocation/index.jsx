import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Button, Form, Input, message, Modal, Tooltip } from "antd";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";

import { deleteSupervisorSectorAllocation } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import ToiletAndTentageSelector from "../../register/asset/assetSelectors";
import { getAssetAllocationData } from "../../register/asset/AssetsSlice";
import CustomTable from "../../commonComponents/CustomTable";

// sector allocation
const AssetAllocation = () => {
  const [viewDeleteModal, setViewDeleteModal] = useState(false); // view delete model
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, AssetAllocateData } = ToiletAndTentageSelector(); // asset allocation

  useEffect(() => {
    if (AssetAllocateData) {
      setDetails(() => {
        return {
          list: AssetAllocateData?.data?.listings,
          pageLength: AssetAllocateData?.data?.paging[0].length,
          currentPage: AssetAllocateData?.data?.paging[0].currentPage,
          totalRecords: AssetAllocateData?.data?.paging[0].totalrecords,
        };
      });
    }
  }, [AssetAllocateData]);

  const handleCancel = () => {
    setViewDeleteModal(false);
  };

  // handle delete
  const handleDelete = (data) => {
    form.setFieldsValue({
      allocation_id: data?.allocation_id,
      allocated_user: data?.allocated_user,
    });
    setViewDeleteModal(true);
  };

  // handle delete API
  const onFinish = async (value) => {
    const url = URLS?.deleteAllocate_Asset?.path + `/${value?.allocation_id}`;
    const res = await dispatch(deleteSupervisorSectorAllocation(url));
    if (res) {
      dispatch(getAssetAllocationData());
      message.success(
        `${value?.allocated_user} Allocation Record deleted Successfully`
      );
    } else {
      message.error("Something went wrong! Please try again.");
    }
    setViewDeleteModal(false);
  };

  useEffect(() => {
    dispatch(getAssetAllocationData()); //  assets allocation
  }, []);

  const columns = [
    {
      title: "Allocated User",
      dataIndex: "allocated_user",
      key: "allocated_user",
    },
    {
      title: "Allocated Phone",
      dataIndex: "allocated_phone",
      key: "allocated_phone",
    },
    {
      title: "Asset Code",
      dataIndex: "asset_code",
      key: "asset_code",
    },
    {
      title: "Sector Name",
      dataIndex: "sector_id",
      key: "sector_id",
    },
    {
      title: "Parking Name",
      dataIndex: "parking_id",
      key: "parking_id",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 150,
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <Tooltip title="Reallocate">
              <Button
                className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
                onClick={() => {
                  navigate("/asset-allocation-form", {
                    state: {
                      key: "UpdateKey",
                      record: record, // Pass the record as part of the state
                    },
                  });
                }}
              >
                <SyncOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
                onClick={() => {
                  handleDelete(record);
                }}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <CommonDivider label={"Allocate Assets"}></CommonDivider>
      <CustomTable
        loading={loading}
        columns={columns || []}
        bordered
        dataSource={details || []}
        scroll={{ x: 100, y: 400 }}
        tableSubheading={{
          "Total Records": AssetAllocateData?.data?.listings?.length,
        }}
      />
      <Modal
        title={
          <div>
            <h5>Delete Asset Allocation</h5>
          </div>
        }
        open={viewDeleteModal}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <p>Are you sure you want to delete this Asset Allocation Record?</p>
          <Form.Item name="allocated_user">
            <Input disabled className="w-full" placeholder="GSD Name" />
          </Form.Item>
          <Form.Item name="allocation_id">
            <Input disabled className="w-full" placeholder="Id" />
          </Form.Item>
          <p>
            <strong className="text-red-500 font-bold">
              Please note: The data in this field cannot be recovered.
            </strong>
          </p>
          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button type="primary" danger htmlType="submit">
                Delete
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AssetAllocation;
