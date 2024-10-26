import React from "react";
import { DICT } from "../urils/dictionary"; // Assuming you have language support here.

const CopyWrite = ({ lang = "en" }) => {
  const dict = DICT; // Accessing your dictionary for language support.

  return (
    <footer className="h-12 w-full flex items-center text-center justify-center bg-orange-400 text-white font-semibold font-roboto">
      <div className="md:w-10/12 w-9/12 xl:w-10/12 2xl:w-9/12 flex flex-col items-center justify-center m-auto">
        {/* Optional multi-language footer */}
        {/* {dict.last_footer[lang]} */}
        <span>Copyright © Prayagraj Mela Authority 2025</span>
        <small className="text-xs mt-1"></small> {/* Smaller text */}
      </div>
    </footer>
  );
};

export default CopyWrite;
