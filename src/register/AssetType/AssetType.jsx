import React, { useEffect, useState } from "react";
import { Button, message, Modal, Table } from "antd";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { useNavigate, useParams } from "react-router";
import { getData } from "../../Fetch/Axios";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getVendorListAssetType,
  setAssetTypeListIsUpdated,
  setUpdateAssetEl,
} from "./AssetTypeSlice";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";
import AssetTypeSelectors from "./assetTypeSelectors";
import ViewVendorsSectors from "./viewVendors";

const vendorColumn = [
  {
    title: "Sr No",
    dataIndex: "sr_no",
    key: "sr_no",
    width: "10%",
  },
  {
    title: "Vendor Name",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "Allotted Sector Quantity",
    dataIndex: "total_allotted_quantity",
    key: "total_allotted_quantity",
    width: "20%",
  },
];

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
  const [showVendorsList, setVendorsList] = useState([]); // vendor list
  const { VendorListAssetType } = AssetTypeSelectors(); // asset type wise vendor list

  const isUpdatedSelector = useSelector(
    (state) => state.assetTypeUpdateEl?.isUpdated
  );

  const params = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState();

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

      const list = data.assettypes.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
          action: (
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              // onClick={() => {
              //   dispatch(setUpdateAssetEl({ updateElement: el }));
              //   navigate("/asset-type-registration");
              // }}
              onClick={() => {
                dispatch(setUpdateAssetEl({ updateElement: el }));
                navigate("/asset-type-registration", {
                  state: {
                    key: "UpdateKey",
                    record: el, // Pass the record as part of the state
                  },
                });
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
          currentPage: data.paging[0].currentpage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    } else {
      setLoading(false);
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
          list: data.listings,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentpage,
          totalRecords: data.paging[0].totalrecords,
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
    if (isUpdatedSelector) {
      dispatch(setAssetTypeListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector, searchQuery]);

  const showModal = async (assetTypeId) => {
    setSelectedAssetType(assetTypeId);
    await fetchQuestions(assetTypeId); // Fetch questions for the asset type
    setIsModalVisible(true); // Show the modal
  };

  // close list
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
    setQuestions([]); // Clear the questions when modal closes
    setshowVendors(false);
  };

  // get vendors data
  const getVedorsData = (value) => {
    setVendorsList([]);
    dispatch(getVendorListAssetType(value));
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
        <Button
          type="link"
          onClick={() => getVedorsData(record?.asset_type_id)}
        >
          View Vendors
        </Button>
      ),
    },
    {
      title: "Questions", // Number of questions
      dataIndex: "questions",
      key: "questions",
      render: (text, record) => (
        <Button type="link" onClick={() => showModal(record?.asset_type_id)}>
          View Questions
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
    },
  ];

  useEffect(() => {
    dispatch(setUpdateAssetEl({ updateElement: null }));
  }, []);

  const totalAllottedQuantity = details.list
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
      ></CommonTable>

      <div className="text-right font-semibold mt-2">
        Total Allotted Quantity: {totalAllottedQuantity}
      </div>

      <Modal
        title={`Questions for Asset Type ID: ${selectedAssetType}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {questions?.list?.length > 0 ? (
          <Table
            bordered
            dataSource={questions.list}
            rowKey="question_id"
            pagination={false}
            scroll={{ x: 800, y: 400 }}
            columns={[
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
            ]}
          />
        ) : (
          <p>No questions found for this type.</p>
        )}
      </Modal>

      <ViewVendorsSectors
        title={"Vendor List"}
        openModal={showVendors}
        handleCancel={handleCancel}
        tableData={showVendorsList || []}
        column={vendorColumn || []}
      />
    </div>
  );
};

export default AssetTypeList;
