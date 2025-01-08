import React, { useState } from "react";
import ToiletsCount from "./ToiletsCount";
import ToiletDetails from "./ToiletDetails";
import CleanlinessReport from "./CleanlinessReport";
import IncidentReportAnalysis from "./IncidentReportAnalysis";
import VendorPerformance from "./VendorPerformance";
import MajorIssuesCount from "./MajorIssuesCount";
import { DICT } from "../utils/dictionary";
import HelplineNo from "./helplineNo";
import SanitationDashSelector from "./Slice/sanitationDashboardSelector";
// import FileStorageWrapper from "./FileStorageWrapper";
// import MapData from "./MapData";
// import phone from "../assets/Dashboard/phone.png";
// import phoneIcon from "../assets/Dashboard/phone-alt.png";

const SanitationDashboard = () => {
  const localLang = localStorage.getItem("lang");
  const [lang, setLang] = useState(localLang || "en");
  const props = { dict: DICT, lang: lang };
  const { SanitationDash_data } = SanitationDashSelector(); // sanitation dashboard
  const performanceData = SanitationDash_data?.data || [];

  return (
    <div className="grid grid-cols-4 mx-3 mt-3 gap-3 ">
      <div className="w-full border lg:col-span-1 col-span-4 shadow-md bg-white rounded-md">
        <ToiletsCount {...props}></ToiletsCount>
      </div>
      <div className="lg:col-span-3 col-span-4 border shadow-md bg-white rounded-md">
        <ToiletDetails {...props}></ToiletDetails>
      </div>
      <div className="col-span-4 shadow-md bg-white rounded-md">
        <MajorIssuesCount {...props}></MajorIssuesCount>
      </div>
      <div className="col-span-4 shadow-md bg-white rounded-md">
        <CleanlinessReport {...props}></CleanlinessReport>
      </div>

      {/* <div className="col-span-4 shadow-md bg-white rounded-md">
        <FileStorageWrapper {...props}></FileStorageWrapper>
      </div> */}
      <div className="col-span-4 md:col-span-2 shadow-md bg-white rounded-md">
        <IncidentReportAnalysis performanceData={performanceData} />
      </div>
      <div className="col-span-4 md:col-span-2 shadow-md bg-white rounded-md">
        <VendorPerformance performanceData={performanceData} />
      </div>
      {/* <div className="col-span-4 shadow-md bg-white rounded-md">
        <MapData {...props}></MapData>
      </div> */}

      <HelplineNo />
    </div>
  );
};

export default SanitationDashboard;
