import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { EditOutlined } from "@ant-design/icons";
import AppConstants from "../../urils/AppConstants";

const VendorProposedSectors = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const params = useParams();

  const getUsers = async () => {
    setLoading(true);
    let uri = URLS.vendorProposedSectors.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS.users.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res?.data;
      setUserDetails(() => {
        return {
          list: data?.listings,
          pageLength: data?.paging[0].length,
          currentPage: data?.paging[0].currentPage,
          totalRecords: data?.paging[0].totalrecords,
        };
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, [params]);

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "question_id",
    //   key: "question_id",
    // },
    // {
    //   title: "Asset Type", // New column for Asset Type
    //   dataIndex: "asset_type", // Assuming this is the correct field from the API response
    //   key: "asset_type",
    // },
    {
      title: "Question (English)",
      dataIndex: "question_en",
      key: "question_en",
    },
    {
      title: "Question (Hindi)",
      dataIndex: "question_hi",
      key: "question_hi",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <>
          <div className="flex justify-between">
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              onClick={() => {
                navigate(`/add-question-form`, {
                  state: {
                    key: "UpdateKey",
                    record: record, // Pass the record as part of the state
                  },
                });
              }}
            >
              <EditOutlined />
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="">
      <CommonDivider
        label={"Question List"}
        compo={
          <Button
            onClick={() => navigate("/add-question-form")}
            className="mb-1"
            style={{ backgroundColor: AppConstants.AddButtonColor }}
          >
            Add Questions
          </Button>
        }
      ></CommonDivider>

      <CommonTable
        loading={loading}
        uri={"questions"}
        columns={columns}
        details={userDetails}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default VendorProposedSectors;
