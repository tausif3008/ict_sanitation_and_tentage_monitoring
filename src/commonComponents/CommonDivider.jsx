import { Divider } from "antd";
import React from "react";

const CommonDivider = ({ label, compo = <></> }) => {
  return (
    <>
      <div className="text-green-700 flex justify-between items-center w-full font-semibold text-2xl mt-3 ml-5">
        <div>{label}</div>
        {compo}
      </div>
      <Divider className="bg-green-500 mt-0 mb-3 mx-4" />
    </>
  );
};

export default CommonDivider;
