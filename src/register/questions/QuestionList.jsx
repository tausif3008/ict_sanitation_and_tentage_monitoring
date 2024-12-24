import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";

const QuestionList = () => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const getUsers = async () => {
    setLoading(true);
    let uri = URLS.questions.path + "/?";
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
    {
      title: "Sr. No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: "Question (English)",
      dataIndex: "question_en",
      key: "question_en",
      width: 300,
    },
    {
      title: "Question (Hindi)",
      dataIndex: "question_hi",
      key: "question_hi",
      width: 300,
    },
    {
      title: "Image Require",
      dataIndex: "is_image",
      key: "is_image",
      render: (value) => (value === "1" ? "Yes" : "No"), // Render "Yes" for 1 and "No" for 0
    },
    {
      title: "Image Require ON",
      dataIndex: "is_image_on",
      key: "is_image_on",
      render: (value) => (value === "1" ? "Yes" : "No"), // Render "Yes" for 1 and "No" for 0
    },
    {
      title: "Primary Question",
      dataIndex: "is_primary",
      key: "is_primary",
      render: (value) => (value === "1" ? "Yes" : "No"), // Render "Yes" for 1 and "No" for 0
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
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
            className="bg-orange-300 mb-1"
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

export default QuestionList;
