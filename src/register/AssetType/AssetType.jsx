import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Table } from "antd";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { getVendorListAssetType } from "./AssetTypeSlice";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";
import AssetTypeSelectors from "./assetTypeSelectors";
import ViewVendorsSectors from "./viewVendors";
import { vendorColumn } from "../../constant/const";

const AssetTypeList = () => {
  const [questions, setQuestions] = useState([]); // To store questions for the selected asset type
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [selectedAssetType, setSelectedAssetType] = useState(null); // Currently selected asset type for viewing questions
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });
  const [showVendors, setshowVendors] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [showVendorsList, setVendorsList] = useState([]); // vendor list
  const [allQuantity, setAllQuantity] = useState(0); // vendor list all quantity
  const [rowRecord, setRowRecord] = useState(); // vendor list all quantity
  const { VendorListAssetType } = AssetTypeSelectors(); // asset type wise vendor list

  const params = useParams();
  const navigate = useNavigate();

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.assetTypes.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    }
    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }
    if (searchQuery) {
      uri = uri + searchQuery;
    }
    const extraHeaders = { "x-api-version": URLS.assetTypes.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      setDetails(() => {
        return {
          list: data.assettypes,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentpage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    } else {
      setLoading(false);
      setDetails(() => {
        return {
          list: [],
          pageLength: 25,
          currentPage: 1,
          totalRecords: 0,
        };
      });
    }
  };

  const fetchQuestions = async (assetTypeId) => {
    try {
      const response = await getData(URLS.assetQuestions.path + assetTypeId, {
        "x-api-version": URLS.assetQuestions.version,
      });

      const data = response.data;
      if (data.listings.length > 0) {
        setQuestions({
          unCommonList: data?.listings?.filter((data) => {
            return data?.is_primary != "1";
          }),
          commonList: data?.listings?.filter((data) => {
            return data?.is_primary === "1";
          }),
          pageLength: data?.paging[0].length,
          currentPage: data?.paging[0].currentpage,
          totalRecords: data?.paging[0].totalrecords,
        });
      } else {
        setQuestions([]); // If no questions are found
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      message.error("Failed to fetch questions");
    }
  };

  useEffect(() => {
    getDetails();
  }, [params, searchQuery]);

  const showModal = async (assetTypeId) => {
    setRowRecord(assetTypeId);
    setSelectedAssetType(assetTypeId?.asset_type_id);
    await fetchQuestions(assetTypeId?.asset_type_id); // Fetch questions for the asset type
    setIsModalVisible(true); // Show the modal
  };

  // close list
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
    setQuestions([]); // Clear the questions when modal closes
    setshowVendors(false);
    setRowRecord(null);
  };

  // get vendors data
  const getVedorsData = (value) => {
    setRowRecord(value);
    setVendorsList([]);
    setAllQuantity(0);
    dispatch(getVendorListAssetType(value?.asset_type_id));
    setshowVendors(true);
  };

  useEffect(() => {
    if (VendorListAssetType) {
      const myData = VendorListAssetType?.data?.userdetails?.map(
        (data, index) => {
          return {
            sr_no: index + 1,
            ...data,
          };
        }
      );
      let totalQuantity = VendorListAssetType?.data?.userdetails?.reduce(
        (accumulator, data) => {
          return accumulator + Number(data?.total_allotted_quantity || 0);
        },
        0
      );
      setAllQuantity(totalQuantity);
      setVendorsList(myData); // asset type wise vendor list
    }
  }, [VendorListAssetType]);

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
      key: "asset_main_type",
    },
    {
      title: "Toilets & Tentage Type", // Asset name
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Total Quantity", // Total quantity
      dataIndex: "total_quantity",
      key: "total_quantity",
    },
    {
      title: "Total Registered",
      dataIndex: "registered",
      key: "registered",
      render: (text) => (text ? text : 0),
    },
    {
      title: "Description", // Asset description
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Vendors", // Number of questions
      dataIndex: "vendors_list",
      key: "vendors_list",
      render: (text, record) => (
        <Button type="link" onClick={() => getVedorsData(record)}>
          View Vendors
        </Button>
      ),
    },
    {
      title: "Questions", // Number of questions
      dataIndex: "questions",
      key: "questions",
      render: (text, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          View Questions
        </Button>
      ),
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
                navigate("/asset-type-registration", {
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
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   fixed: "right",
    //   width: 100,
    // },
  ];

  const questionsColumns = [
    {
      title: "Question (EN)",
      dataIndex: "question_en",
      key: "question_en",
    },
    {
      title: "Question (HI)",
      dataIndex: "question_hi",
      key: "question_hi",
    },
  ];

  const totalAllottedQuantity = details?.list
    .reduce((total, item) => total + Number(item.total_quantity || 0), 0)
    .toLocaleString(); // Format with commas

  return (
    <div className="">
      <CommonDivider
        label={"Toilets & Tentage Type List"}
        compo={
          <Button
            className="bg-orange-300 mb-1"
            onClick={() => {
              navigate("/asset-type-registration");
            }}
          >
            Add Toilets & Tentage Type
          </Button>
        }
      ></CommonDivider>

      <CommonSearchForm
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        // fields={[{ name: "name", label: "Asset Type" }]}
        dropdown={
          <CommonFormDropDownMaker
            uri={"assetMainTypePerPage"}
            responseListName="assetmaintypes"
            responseLabelName="name"
            responseIdName="asset_main_type_id"
            selectLabel={"Toilets & Tentage Category"}
            selectName={"asset_main_type_id"}
            required={false}
            RequiredMessage={"Main type is required!"}
          ></CommonFormDropDownMaker>
        }
      ></CommonSearchForm>

      <div className="h-3"></div>
      <CommonTable
        columns={columns}
        uri={"asset-type-list"}
        details={details}
        loading={loading}
        scroll={{ x: 1200, y: 400 }}
        tableSubheading={{
          "Total Allotted Quantity": totalAllottedQuantity,
        }}
      ></CommonTable>

      <Modal
        title={
          <div>
            <h5>{`Questions for Asset Type ID: ${selectedAssetType}`}:</h5>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div className="mb-4">
          <p>
            <strong>Category:</strong> {rowRecord?.asset_main_type_name}
          </p>
          <p>
            <strong>Toilets & Tentage Type:</strong> {rowRecord?.name}
          </p>
        </div>
        {questions?.commonList?.length > 0 ? (
          <>
            <h6>Common Questions :</h6>
            <Table
              bordered
              className="mb-4"
              dataSource={questions?.commonList}
              rowKey="question_id"
              pagination={false}
              scroll={{ x: 800, y: 400 }}
              columns={questionsColumns || []}
            />
          </>
        ) : (
          <p>No Common questions found for this type.</p>
        )}
        {questions?.unCommonList?.length > 0 ? (
          <>
            <h6>Individual Questions :</h6>
            <Table
              bordered
              dataSource={questions?.unCommonList}
              rowKey="question_id"
              pagination={false}
              scroll={{ x: 800, y: 400 }}
              columns={questionsColumns || []}
            />
          </>
        ) : (
          <p>No Individual questions found for this type.</p>
        )}
      </Modal>

      <ViewVendorsSectors
        title={"Vendor List"}
        openModal={showVendors}
        handleCancel={handleCancel}
        tableData={showVendorsList || []}
        tableHeaderData={
          [
            {
              label: "Category",
              value: rowRecord?.asset_main_type_name,
            },
            {
              label: "Toilets & Tentage Type",
              value: rowRecord?.name,
            },
          ] || []
        }
        column={vendorColumn || []}
        footer={`Total Allotted Quantity : ${allQuantity}`}
      />
    </div>
  );
};

export default AssetTypeList;
