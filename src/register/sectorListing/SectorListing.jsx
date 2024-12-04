import React, { useEffect, useState } from "react";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { useDispatch } from "react-redux";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";

const columns = [
  {
    title: "Sector Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
];

const SectorsListing = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const dispatch = useDispatch();
  const { SectorData } = VendorSectorSelectors(); // sector data

  useEffect(() => {
    if (SectorData) {
      const myData = SectorData?.data?.sectors;
      setDetails(() => ({
        list: myData || [],
        totalRecords: myData?.length,
      }));
    }
  }, [SectorData]);

  useEffect(() => {
    dispatch(getSectorsList()); // all sectors
  }, []);

  return (
    <div>
      <>
        <CommonDivider label={"Sectors List"} />
        <CommonTable columns={columns} details={details} />
      </>
    </div>
  );
};

export default SectorsListing;
