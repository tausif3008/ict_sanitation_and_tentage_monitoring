import React from "react";
import { DICT } from "../urils/dictionary"; // Assuming you have language support here.

const CopyWrite = ({ lang = "en" }) => {
  const dict = DICT; // Accessing your dictionary for language support.

  return (
    <>
      <div class="flex bg-orange-400 text-white px-3 py-2">
        <div class="flex-1 text-left">
          <span>{dict.copy_right[lang]}</span>
        </div>
        <div class="flex-1 text-right">
          {" "}
          <small className="text-xs mt-1">{dict.hosted_by[lang]}</small>{" "}
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
