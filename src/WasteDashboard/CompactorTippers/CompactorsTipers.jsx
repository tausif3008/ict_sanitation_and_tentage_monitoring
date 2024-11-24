import React from "react";
import Compactors from "./Compactors";
import Tippers from "./Tippers";
import Wastes from "./Wastes";

const CompactorsTippers = () => {
  return (
    <div className="flex  flex-col gap-3 p-2 w-full">
      <div className="flex justify-between gap-3 w-full">
        <Compactors></Compactors>
        <Tippers></Tippers>
      </div>
      {/* <div>
        <Wastes></Wastes>
      </div> */}
    </div>
  );
};

export default CompactorsTippers;
