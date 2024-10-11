import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import URLS from "../urils/URLS";
import { getData } from "../Fetch/Axios";
import {} from "../register/AssetType/AssetTypeSlice";
import CommonDivider from "../commonComponents/CommonDivider";
import CommonTable from "../commonComponents/CommonTable";

import {
  setAssetInfo,
  setMonitoringListIsUpdated,
  setUpdateMonitoringEl,
} from "./monitoringSlice";
import { Image } from "antd";

const Monitoring = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const isUpdatedSelector = useSelector(
    (state) => state.monitoringSlice?.isUpdated
  );

  const params = useParams();
  const navigate = useNavigate();

  // qr

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.monitoring.path + "/?";

    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS.asset.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      const list = data.listings.map((el, index) => {
        return {
          ...el,
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
      dispatch(setMonitoringListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector]);

  // qr code
  useEffect(() => {
    dispatch(setUpdateMonitoringEl({ updateElement: null }));
  }, [dispatch]);

  const columns = [
    {
      title: "Assets Type Name",
      dataIndex: "asset_type_name",
      key: "assetsName",
      width: 210,
    },

    {
      title: "Assets Code",
      dataIndex: "asset_code",
      key: "assetsCode",
      width: 110,
    },
    {
      title: "QR",
      dataIndex: "asset_qr_code",
      width: 80,
      render: (qr) => {
        return (
          <Image
            src={URLS.baseUrl + "/" + qr}
            alt="QR Code"
            style={{ maxWidth: "50px" }}
          />
        );
      },
    },

    {
      title: "remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 130,

      render: (text, record) => (
        <div className="flex gap-2">
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              navigate("/monitoring-report/" + record.id);
              dispatch(setAssetInfo(record));
            }}
          >
            Monitoring
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <CommonDivider
        label={"Asset Type Monitoring "}
        // compo={
        //   <Button
        //     className="bg-orange-300 mb-1"
        //     onClick={() => {
        //       navigate("/add-update-monitoring");
        //     }}
        //   >
        //     Add Monitoring
        //   </Button>
        // }
      ></CommonDivider>

      <CommonTable
        columns={columns}
        uri={"monitoring"}
        details={details}
        loading={loading}
        scroll={{ x: 1000, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default Monitoring;
