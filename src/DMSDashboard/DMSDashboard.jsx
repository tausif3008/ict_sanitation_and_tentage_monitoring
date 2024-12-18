import React from "react";
import TotalDocuments from "./TotalDocuments";
import DocumentDetails from "./DocumetDetails";
import Document from "./Documents/Document";
import SavedDocuments from "./SavedDocuments";
import RecentActivities from "./RecentActivities";
import UploadDocument from "./UploadDocuments";
import Approvals from "./Approvals";
import FileUploadingFrequency from "./FileUploadingFrequency";
import FileStorage from "./FileStorage";
import FileHistory from "./FileHistory";
import HelplineNo from "../SanitationDashboard/helplineNo";

const DMSDashboard = () => {
  return (
    <div className="grid grid-cols-4 mx-3 mt-3 gap-3 ">
      <div className="col-span-4 grid grid-cols-6 gap-2">
        <div className="col-span-6 md:col-span-3 shadow-md bg-white rounded-md">
          <TotalDocuments></TotalDocuments>
        </div>
        <div className="w-full md:col-span-3 col-span-6 shadow-md bg-white rounded-md">
          <DocumentDetails></DocumentDetails>
        </div>
      </div>

      <div className="col-span-4 lg:col-span-3 bg-white shadow-md rounded">
        <Document></Document>
      </div>

      <div className="col-span-4 sm:h-[350px] lg:h-auto lg:col-span-1 grid grid-rows-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3  ">
        <div className="sm:h-[350px] lg:h-[250px] overflow-y-scroll bg-white rounded-lg shadow ">
          <SavedDocuments></SavedDocuments>
        </div>

        <div className="sm:h-[350px] lg:h-[265px] overflow-y-scroll bg-white rounded-lg shadow">
          <RecentActivities></RecentActivities>
        </div>
      </div>
      <div className="col-span-4 lg:col-span-4 rounded grid grid-cols-1 md:grid-cols-2 gap-3 ">
        <UploadDocument></UploadDocument>
        <Approvals></Approvals>
      </div>
      <div className="col-span-4 lg:col-span-4 rounded grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <FileUploadingFrequency></FileUploadingFrequency>
        <FileStorage></FileStorage>
        <FileHistory></FileHistory>
      </div>

      <HelplineNo />
    </div>
  );
};

export default DMSDashboard;
