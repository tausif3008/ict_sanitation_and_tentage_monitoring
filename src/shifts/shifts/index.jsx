import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import { getShifts } from "./shiftSlice";
import ShiftSelectors from "./shiftSelectors";
import URLS from "../../urils/URLS";

const columns = [
  {
    title: "Sr. No", // Asset main type
    dataIndex: "sr",
    key: "sr",
    width: 80,
  },
  {
    title: "Shift Name",
    dataIndex: "name",
    key: "name",
    width: 300,
  },
  {
    title: "Start Time",
    dataIndex: "from_time",
    key: "from_time",
    width: 300,
    render: (text) => {
      return text ? moment(text, "HH:mm:ss").format("hh:mm A") : "00";
    },
  },
  {
    title: "End Time",
    dataIndex: "to_time",
    key: "to_time",
    width: 300,
    render: (text) => {
      return text ? moment(text, "HH:mm:ss").format("hh:mm A") : "00";
    },
  },
];

const Shift = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, ShiftData } = ShiftSelectors();
  const params = useParams();

  const [userDetails, setUserDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  useEffect(() => {
    if (ShiftData) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        list: ShiftData?.data?.listings || [],
        pageLength: ShiftData?.data?.paging?.[0]?.length || 0,
        currentPage: ShiftData?.data?.paging?.[0]?.currentPage || 1,
        totalRecords: ShiftData?.data?.paging?.[0]?.totalrecords || 0,
      }));
    }
  }, [ShiftData]);

  useEffect(() => {
    let uri = URLS.shift.path + "?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    } else {
      uri = URLS.shift.path;
    }
    dispatch(getShifts(uri)); // get shift data
    // dispatch(getShifts("shifts?page=1&per_page=100")); // get shift data

    return () => {};
  }, [params]);

  return (
    <>
      <div className="">
        <CommonDivider label={"Shift"}></CommonDivider>

        <CommonTable
          loading={loading}
          uri={`shift`}
          columns={columns || []}
          details={userDetails || []}
          scroll={{ x: 300, y: 400 }}
        ></CommonTable>
      </div>{" "}
    </>
  );
};

export default Shift;
