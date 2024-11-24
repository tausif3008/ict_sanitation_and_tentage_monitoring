import React from "react";
import FacilityDetailsForm from "./FacilityDetailsForm";
import DashboardTitle from "../DashboardTitle";
import FacilityDetailsTable from "./FacilityDetailsTable";

const FacilityDetails = ({ title, columns, dataSource }) => {
  return (
    <div className="rounded-md">
      <DashboardTitle
        title={title || "Vehicles Details"}
      ></DashboardTitle>
      <div className="p-2">
        <FacilityDetailsForm></FacilityDetailsForm>
      </div>
      <div>
        <FacilityDetailsTable
          columnss={columns}
          dataSourcee={dataSource}
        ></FacilityDetailsTable>
      </div>
    </div>
  );
};

export default FacilityDetails;
