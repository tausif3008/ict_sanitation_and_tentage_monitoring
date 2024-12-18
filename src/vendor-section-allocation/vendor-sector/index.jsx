import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Form, Input, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { useDispatch } from "react-redux";
import { deleteSupervisorSectorAllocation } from "./Slice/vendorSectorSlice";

// sector allocation
const VendorSectorAllocation = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState();
  const [viewDeleteModal, setViewDeleteModal] = useState(false); // view delete model

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = () => {
    setViewDeleteModal(false);
  };

  // handle delete
  const handleDelete = (data) => {
    form.setFieldsValue({
      user_id: data?.user_id,
      sector_id: data?.sector_id,
      supervisor_name: data?.supervisor_name,
      sector_name: data?.sector_name,
    });
    setViewDeleteModal(true);
  };

  // handle delete API
  const onFinish = async (value) => {
    const url =
      URLS?.deleteAllocate_Sector?.path +
      `/${value?.user_id}/${value?.sector_id}`;
    const res = await dispatch(deleteSupervisorSectorAllocation(url));
    if (res) {
      getUsers();
      message.success(
        `${value?.supervisor_name} ${value?.sector_name} Allocation Record deleted Successfully`
      );
    } else {
      message.error("Something went wrong! Please try again.");
    }
    setViewDeleteModal(false);
  };

  const getUsers = async () => {
    setLoading(true);

    let uri = URLS.getAllocate_Sector.path + "?";
    if (params.page) {
      uri = uri + params.page;
    }

    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    if (searchQuery) {
      uri = uri + searchQuery;
    }

    const extraHeaders = {
      "x-api-version": URLS.getAllocate_Supervisor.version,
    };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;

      const list = data.listings.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
        };
      });

      setDetails(() => {
        return {
          list: list,
          pageLength: res?.data?.paging[0].length,
          currentPage: res?.data?.paging[0].currentPage,
          totalRecords: res?.data?.paging[0].totalrecords,
        };
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers(); // users
  }, [params, searchQuery]);

  const columns = [
    {
      title: "Sr.No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: "Supervisor Name",
      dataIndex: "supervisor_name",
      key: "supervisor_name",
    },
    // {
    //   title: "Email",
    //   dataIndex: "user_email",
    //   key: "user_email",
    // },
    {
      title: "Mobile No.",
      dataIndex: "user_phone",
      key: "user_phone",
    },
    {
      title: "Sector Name",
      dataIndex: "sector_name",
      key: "sector_name",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => {
        return (
          // <Button
          //   className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
          //   onClick={() => {
          //     navigate("/sector-allocation-form", {
          //       state: {
          //         key: "UpdateKey",
          //         record: record, // Pass the record as part of the state
          //       },
          //     });
          //   }}
          // >
          //   <EditOutlined />
          // </Button>
          <Button
            className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
            onClick={() => {
              handleDelete(record);
            }}
          >
            <DeleteOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="">
      <>
        <CommonDivider
          label={"Allocate Sectors"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() =>
                navigate("/sector-allocation-form", {
                  state: {
                    key: "AddKey",
                  },
                })
              }
            >
              Add
            </Button>
          }
        ></CommonDivider>

        <CommonTable
          columns={columns}
          uri={"sector-allocation"}
          loading={loading}
          details={details}
          setUserDetails={setDetails}
        ></CommonTable>

        <Modal
          title="Delete Supervisor Sector Allocation"
          open={viewDeleteModal}
          onCancel={handleCancel}
          footer={null}
          width={400}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <p>
              Are you sure you want to delete this Supervisor Sector Allocation
              Record?
            </p>

            {/* Optional: Confirmation Checkbox or other fields */}
            <Form.Item name="supervisor_name">
              <Input
                disabled
                className="w-full"
                placeholder="Supervisor Name"
              />
            </Form.Item>
            <Form.Item name="sector_name">
              <Input disabled className="w-full" placeholder="Sector Name" />
            </Form.Item>
            <Form.Item name="user_id">
              <Input disabled className="w-full" placeholder="User Id" />
            </Form.Item>
            <Form.Item name="sector_id">
              <Input disabled className="w-full" placeholder="Sector Id" />
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
      </>
    </div>
  );
};

export default VendorSectorAllocation;
