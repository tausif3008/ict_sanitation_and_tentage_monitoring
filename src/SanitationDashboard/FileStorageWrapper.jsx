import React from "react";
import FileStorage from "./FileStorage";

const FileStorageWrapper = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FileStorage series={[100, 200, 300]} total="500" dropdownType="zone" />

      <FileStorage series={[150, 150, 200]} total="500" dropdownType="sector" />

      <FileStorage series={[200, 120, 180]} total="500" dropdownType="circle" />
    </div>
  );
};

export default FileStorageWrapper;
