import React, { useContext, useEffect, useState } from "react";
import { Button, Image, message, Modal, Table } from "antd";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { useNavigate, useParams } from "react-router";
import { getData } from "../../Fetch/Axios";
import { useDispatch, useSelector } from "react-redux";
import { setAssetListIsUpdated, setUpdateAssetEl } from "./AssetsSlice";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";

const AssetsList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const isUpdatedSelector = useSelector(
    (state) => state.assetsSlice?.isUpdated
  );

  const params = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState();

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.assetList.path + "/?";
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
      const list = data.listings.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
          action: (
            // <Button
            //   className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
            //   key={el.name + index}
            //   onClick={() => {
            //     navigate("/asset-registration");
            //   }}
            // >
            //   Edit
            // </Button>
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              onClick={() => {
                navigate(`/asset-details/${el.assets_id}`);
              }}
            >
              Details
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
    }
  };

  useEffect(() => {
    getDetails();
    if (isUpdatedSelector) {
      dispatch(setAssetListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector, searchQuery]);

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
      key: "asset_main_type_name",
      width: 140,
    },
    {
      title: "Toilets & Tentage Type",
      dataIndex: "asset_type_name",
      key: "asset_type_name",
      width: 220,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      width: 200,
    },
    {
      title: "Vendor Asset Code",
      dataIndex: "vendor_asset_code",
      key: "vendor_asset_code",
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: 100,
    },
    {
      title: "Circle",
      dataIndex: "circle_id",
      key: "circle_id",
      width: 100,
    },
    {
      title: "Location",
      render: (text, record) =>
        `${record.latitude || "N/A"}, ${record.longitude || "N/A"}`,
      key: "location",
    },
    {
      title: "QR Code",
      width: 100,
      render: (text, record) => (
        <Image
          src={URLS.baseUrl + "/" + record.qr_code}
          width={60}
          height={60}
          alt={record.qr_code}
        ></Image>
      ),
      key: "qrCode",
    },
    {
      title: "Photo",
      width: 100,
      render: (text, record) =>
        record.photo ? (
          <Image
            width={60}
            height={60}
            src={`https://kumbhtsmonitoring.in/php-api/${record.photo}`}
            alt="Assets Photo"
          />
        ) : (
          "No Image"
        ),
      key: "photo",
    },
    {
      title: "Tagged At",
      dataIndex: "tagged_at",
      key: "tagged_at",
    },
  ];

  useEffect(() => {
    dispatch(setUpdateAssetEl({ updateElement: null }));
  }, []);

  return (
    <div className="">
      <CommonDivider
        label={"Toilets & Tentage List"}
        // compo={
        //   <Button
        //     className="bg-orange-300 mb-1"
        //     onClick={() => {
        //       navigate("/asset-registration");
        //     }}
        //   >
        //     Add Asset
        //   </Button>
        // }
      ></CommonDivider>

      <CommonSearchForm
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        dropdown={
          <CommonFormDropDownMaker
            uri={"assetMainTypePerPage"}
            responseListName="assetmaintypes"
            responseLabelName="name"
            responseIdName="asset_main_type_id"
            // selectLabel={"Toilets & Tentage Category"}
            selectName={"asset_main_type_id"}
            required={false}
            // RequiredMessage={"Main type is required!"}
          ></CommonFormDropDownMaker>
        }
        fields={[{ name: "vendor_asset_code", label: "" }]}
        // fields={[{ name: "vendor_asset_code", label: "" }]}
      ></CommonSearchForm>

      <CommonTable
        columns={columns}
        uri={"asset-list"}
        details={details}
        loading={loading}
        scroll={{ x: 1500, y: 400 }}
      ></CommonTable>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        title="QR Code"
        width={200}
      >
        {qrCodeUrl ? (
          <Image src={qrCodeUrl} alt="QR Code" />
        ) : (
          <p>No QR Code available</p>
        )}
      </Modal>
    </div>
  );
};

export default AssetsList;
