import React, { useState, useEffect } from "react";
import { Button, Table, Image, Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getData } from "../Fetch/Axios";
import URLS from "../urils/URLS";
import CommonTable from "../commonComponents/CommonTable";

const MonitoringReport = ({ data }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assetDetails, setAssetDetails] = useState({});

  const params = useParams();

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.monitoringDetails.path + params.id + "&";

    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS.monitoringDetails.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      setLoading(false);
      const data = res?.data;
      const list = data?.listings[0].questions;

      setDetails(() => {
        return {
          list,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentpage,
          totalRecords: data.paging[0].totalrecords,
        };
      });

      const assetDetails = data.listings[0];

      setAssetDetails({
        latitude: assetDetails?.latitude,
        longitude: assetDetails?.longitude,
        remark: assetDetails?.remark,
        photo: assetDetails?.photo,
        asset_type_name: assetDetails?.asset_type_name,
        qrCode: assetDetails?.asset_qr_code,
      });
    }
  };

  useEffect(() => {
    getDetails();
  }, [params]);

  const dateColumns = [
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
    // {
    //   title: "SLA",
    //   dataIndex: "sla",
    //   key: "sla",
    // },

    {
      title: "image",
      dataIndex: "image",
      key: "answer",
      render: (image) => {
        console.log("image", image);
        if (image !== "N") {
          <Image width={130} src={URLS.baseUrl + image} alt="QR Code" />;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      render: (answer) => {
        if (answer === "1") {
          return (
            <div className="bg-green-500 p-1 px-3 rounded-md flex w-fit text-xs">
              Yes
            </div>
          );
        } else if (answer === "0") {
          return (
            <div className="bg-orange-500 p-1 px-3 rounded-md flex w-fit text-xs">
              No
            </div>
          );
        } else {
          return (
            <div className="bg-blue-200 p-1 px-3 rounded-md flex w-fit text-xs">
              Maintenance
            </div>
          );
        }
      },
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   width: 250,
    // },
  ];

  const navigate = useNavigate();

  return (
    <div>
      <div className="mx-auto p-3 pb-3 bg-white shadow-md rounded-lg w-full mt-3">
        <div className="flex items-center gap-2 font-semibold">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              navigate("/monitoring");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end ">
            <span className="mr-1"> Monitoring Report For: </span>{" "}
            <span className="text-blue-500">
              {assetDetails.asset_type_name}
            </span>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        {details?.list?.length ? (
          <div className="mt-3">
            <div className="flex gap-1 flex-col">
              <div>
                Latitude:{" "}
                <span className="font-semibold">{assetDetails.latitude}</span>
              </div>
              <div>
                Longitude:{" "}
                <span className="font-semibold">{assetDetails.longitude}</span>
              </div>
              <div>
                Remark:{" "}
                <span className="font-semibold">{assetDetails.remark}</span>
              </div>
            </div>

            <div className="flex justify-between mt-2 mb-3">
              <div className="flex flex-col text-center font-semibold">
                <span>QR Code</span>
                <Image
                  width={130}
                  src={URLS.baseUrl + "/" + assetDetails?.qrCode}
                  alt="QR Code"
                />
              </div>
              <div className="flex flex-col text-center font-semibold">
                <span>Asset Image</span>
                <Image
                  width={125}
                  height={125}
                  src={URLS.baseUrl + assetDetails?.photo}
                ></Image>
              </div>
            </div>

            <Table
              columns={dateColumns}
              dataSource={details.list}
              pagination={false}
              scroll={{ x: 1000, y: 350 }}
              bordered
              className="rounded-none"
              loading={loading}
            />
          </div>
        ) : (
          <div className="mt-3 font-semibold text-orange-500 text-center">
            Not Report Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringReport;
