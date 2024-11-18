import React, { useEffect, useState } from "react";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router";
import MainNavbar from "../navbar/MainNavbar";
import CopyWrite from "../footer/Copywrite";
import { DICT } from "../utils/dictionary";
import footerBg from "../assets/Dashboard/footerBg.png";
import { Dropdown, Select } from "antd";

const Layout = () => {
  const localLang = localStorage.getItem("lang");

  const [lang, setLang] = useState(localLang || "en");

  useEffect(() => {
    if (lang) {
      localStorage.setItem("lang", lang);
    }
  }, [lang]);

  const props = { dict: DICT, lang: lang };
  const [pageWidthFull, setPageWidthFull] = useState(false);
  const [classWidth, setClassWidth] = useState();

  const location = useLocation();
  useEffect(() => {
    if (location.pathname) {
      const wFullCondition =
        location.pathname.split("/").includes("dashboard") ||
        location.pathname.split("-").includes("dashboard");
      if (!wFullCondition) {
        setClassWidth(
          "md:w-10/12 w-11/12 xs:w-9/12 xl:w-10/12 2xl:w-9/12 flex flex-col m-auto"
        );
      } else {
        setClassWidth("w-full flex flex-col m-auto");
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-roboto">
      <div>
        <MainNavbar {...props} setLang={setLang}></MainNavbar>
        <div className={`${classWidth}`}>
          <Outlet context={[props.dict, props.lang, setPageWidthFull]}></Outlet>
        </div>
      </div>
      <div className="h-10"></div>
      <div className="w-full mt-auto">
        <div style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 3)" }}>
          <div
            className="relative flex overflow-hidden"
            style={{ background: "#ebf9fc" }}
          >
            <div className="md:w-10/12 w-11/12 xl:w-10/12 2xl:w-9/12  flex flex-col m-auto z-30 p-2">
              <Footer {...props}></Footer>
            </div>
            <img
              className="absolute bottom-0 w-full  m-auto flex z-0"
              src={footerBg}
              alt=""
            />
          </div>
        </div>

        <div>
          <CopyWrite {...props}></CopyWrite>
        </div>
      </div>
    </div>
  );
};

export default Layout;
