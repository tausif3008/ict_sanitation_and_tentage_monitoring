import React from "react";
import { DICT } from "../urils/dictionary"; // Assuming you have language support here.

const CopyWrite = ({ lang = "en" }) => {
  const dict = DICT; // Accessing your dictionary for language support.

  return (
    <>
      <div className="flex flex-col md:flex-row bg-orange-400 text-white px-3 py-2">
        <div className="flex-1 text-left mb-2 md:mb-0">
          <span className="text-sm">{dict.copy_right[lang]}</span>
        </div>
        <div className="flex-1 text-right">
          <small className="text-xs">{dict.hosted_by[lang]}</small>
        </div>
      </div>

      {/* <footer className="h-12 w-full flex  justify-center bg-orange-400 text-white font-semibold font-roboto">
        <div className="md:w-12/12 w-9/12 xl:w-12/12 2xl:w-/12 flex flex-col  justify-center m-auto"> */}
      {/* Optional multi-language footer */}
      {/* {dict.last_footer[lang]} */}

      {/* Smaller text */}
      {/* </div>
      
      </footer> */}
    </>
  );
};

export default CopyWrite;
