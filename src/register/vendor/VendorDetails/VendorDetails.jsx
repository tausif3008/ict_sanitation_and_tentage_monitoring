import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import CommonTable from "../../../commonComponents/CommonTable";
import CommonDivider from "../../../commonComponents/CommonDivider";
import URLS from "../../../urils/URLS";
import { useNavigate, useParams } from "react-router";
import { getData } from "../../../Fetch/Axios";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setUpdateVendorDetailsEl,
  setVendorDetailsListIsUpdated,
} from "./vendorDetailsSlice";
import CommonSearchForm from "../../../commonComponents/CommonSearchForm";

const VendorDetails = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const [proposedSectors, setProposedSectors] = useState();
  const [isModalVisible, setIsModalVisible] = useState();
  const params = useParams();
  const [userName, setUserName] = useState("");

  const handleProposedSectorsView = (record) => {
    setProposedSectors(record);
    setIsModalVisible(true); // Show the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setProposedSectors([]);
  };

  const columns = [
    {
      title: "Asset Main Type",
      dataIndex: "asset_main_type_name",
      key: "main_type",
    },
    {
      title: "Asset Type",
      dataIndex: "asset_type_name",
      key: "asset_type",
      width: 300,
    },
    {
      title: "Contract Number",
      dataIndex: "contract_number",
      key: "contract_number",
      width: 160,
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
      title: "Work Order Number",
      dataIndex: "work_order_number",
      key: "work_order_number",
      width: 180,
    },
    {
      title: "Date of Allocation",
      dataIndex: "date_of_allocation",
      key: "date_of_allocation",
      width: 160,
    },
    {
      title: "Total Allotted Quantity",
      dataIndex: "total_allotted_quantity",
      key: "total_allotted_quantity",
    },
    {
      title: "Proposed Sectors",
      dataIndex: "proposedsectors",
      key: "proposed_sectors",

      render: (record) => {
        return (
          <div
            onClick={() => handleProposedSectorsView(record)}
            className="text-blue-500"
          >
            {" "}
            View
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
    },
  ];

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.vendorDetails.path + params.id + "&";

    if (params.page) {
      uri = uri + params.page;
    }

    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const res = await getData(uri, {
      "x-api-version": URLS.vendorDetails.version,
    });

    if (res) {
      const data = res.data;
      setLoading(false);

      setUserName(data.userdetails[0]?.user_name);

      const list = data.userdetails.map((el, index) => {
        return {
          ...el,
          action: (
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              onClick={() => {
                dispatch(setUpdateVendorDetailsEl({ updateElement: el }));
                navigate("/vendor/add-vendor-details-form/" + params.id);
              }}
            >
              <EditOutlined></EditOutlined>
            </Button>
          ),
        };
      });

      setDetails(() => {
        return {
          list,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentPage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    }
  };

  const isUpdatedSelector = useSelector(
    (state) => state.vendorDetailsUpdateEl?.isUpdated
  );

  useEffect(() => {
    dispatch(setUpdateVendorDetailsEl({ updateElement: null }));
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (params.id) {
      getDetails();
      if (isUpdatedSelector) {
        dispatch(setVendorDetailsListIsUpdated({ isUpdated: false }));
      }
    } else {
      navigate("/vendor");
    }
  }, [params, isUpdatedSelector]);

  return (
    <div className="">
      <>
        {/* <CommonSearchForm
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          fields={[
            { name: "name", label: "Name" },
            { name: "email", label: "email" },
            // { name: "index_no", label: "Index No." },
          ]}
        ></CommonSearchForm> */}
        <div className="flex gap-2 items-center ">
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
                  onClick={() => {
                    navigate("/vendor/add-vendor-details-form/" + params.id);
                  }}
                >
                  Add Details
                </Button>
              }
            ></CommonDivider>
          </div>
        </div>

        <CommonTable
          columns={columns}
          uri={"vendor/add-vendor-details/" + params.id} // react url
          details={details}
          loading={loading}
        ></CommonTable>

        <Modal
          title={`Proposed Sectors`}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          {proposedSectors?.length ? (
            <Table
              bordered
              dataSource={proposedSectors}
              rowKey="question_id"
              pagination={false}
              scroll={{ x: 300, y: 400 }}
              columns={[
                {
                  title: "Sector Name",
                  dataIndex: "sector_name",
                  key: "sector_name",
                },
                {
                  title: "quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
              ]}
            />
          ) : (
            <p>No questions found for this asset type.</p>
          )}
        </Modal>
      </>
    </div>
  );
};

export default VendorDetails;
