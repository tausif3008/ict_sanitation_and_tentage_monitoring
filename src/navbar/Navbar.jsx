import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, message } from "antd";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import DropDown from "./DropDown";
import { DICT } from "../utils/dictionary";

import {
  DMS_param,
  gsd_wise_regi_reports,
  incident_reports,
  incidentDash_param,
  inspections_reports,
  masterData_param,
  monitoring_reports,
  reports_param,
  sanitationDash_param,
  sector_wise_reports,
  tentageDash_param,
  userAccess_param,
  vendor_wise_regi_reports,
  vendor_wise_reports,
  vendorDash_param,
  vehicleDash_param,
  gsd_wise_monitoring_reports,
  vehicle_reports,
  monitoring_dailyWeekly_reports,
  sector_wise_regi_reports,
  sector_type_wise_regi_reports,
} from "../constant/permission";
import { IMAGELIST } from "../assets/Images/exportImages";
import { logOutUser } from "../Login/slice/loginSlice";
import { revertAll } from "../Redux/action";
import { checkLoginAvailability } from "../constant/const";

const Navbar = ({ lang, setLang }) => {
  const dict = DICT;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedIn = localStorage.getItem("sessionToken");
  // const sessionData = localStorage.getItem("sessionData");
  // const jsonObject = JSON.parse(sessionData);
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;
  const tentageIdUser = sessionData?.allocatedmaintype?.[0]?.asset_main_type_id;
  const userRoleId = localStorage.getItem("role_id");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // click on name
  const handleButtonClick = () => {
    if (localStorage.getItem("sessionToken")) {
      checkLoginAvailability(sessionData, navigate);
    } else {
      navigate("/login"); // Navigate to login if session token doesn't exist
    }
  };

  // logout
  const handleLogOut = async () => {
    const result = await dispatch(logOutUser());
    if (result?.data?.success) {
      message.success("User logged out");
      dispatch(revertAll());
      localStorage.clear();
      sessionStorage.clear();
      // setTimeout(() => {
      navigate("/");
      // }, 1000);
    }
  };
  // Dashboard
  const dashboards = (lang, dict) => {
    return [
      sanitationDash_param?.includes(userRoleId) && {
        key: "2",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/sanitation-dashboard"
          >
            Sanitation Dashboard
          </Link>
        ),
      },
      (tentageDash_param?.includes(userRoleId) || tentageIdUser === "2") && {
        key: "3",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/tentage-dashboard"
          >
            Tentage Dashboard
          </Link>
        ),
      },
      vehicleDash_param?.includes(userRoleId) && {
        key: "4",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/vehicle-dashboard"
          >
            Vehicle Dashboard
          </Link>
        ),
      },
      // incidentDash_param?.includes(userRoleId) && {
      //   key: "5",
      //   label: (
      //     <Link
      //       className="text-black no-underline hover:text-green"
      //       to="/incident-dashboard"
      //     >
      //       Incident Dashboard
      //     </Link>
      //   ),
      // },
      vendorDash_param.includes(userRoleId) &&
        tentageIdUser != "2" && {
          key: "6",
          label: (
            <Link
              className="text-black no-underline hover:text-green"
              to="/vendor-dashboard"
            >
              Vendor Dashboard
            </Link>
          ),
        },
      /*
      SLADash_param?.includes(userRoleId) && {
        key: "7",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/SLA-dashboard"
          >
            SLA Dashboard
          </Link>
        ),
      },
      */
    ];
  };

  // User Access & Registration
  const register_items = (lang, dict) => {
    return [
      {
        key: "1",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/users"
          >
            User Registration
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link className="text-black no-underline" to="/vendor">
            Vendor Registration
          </Link>
        ),
      },
      {
        key: "3",
        label: (
          <Link className="text-black no-underline" to="/asset-list">
            Toilets & Tentage Registration
          </Link>
        ),
      },
      {
        key: "4",
        label: (
          <Link
            className="text-black no-underline"
            to="/vendor-supervisor-registration"
          >
            Vendor Supervisor Registration
          </Link>
        ),
      },
    ];
  };

  // Master data creation
  const master_items = (lang, dict) => {
    return [
      {
        key: "1",
        label: (
          <Link className="text-black no-underline" to="/asset-type-list">
            Toilets & Tentage Type List
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link className="text-black no-underline" to="/questions">
            Question List
          </Link>
        ),
      },
      {
        key: "3",
        label: (
          <Link className="text-black no-underline" to="/vehicle">
            Vehicle List
          </Link>
        ),
      },
      {
        key: "14",
        label: (
          <Link className="text-black no-underline" to="/pickup-point">
            Pickup Point
          </Link>
        ),
      },
      {
        key: "4",
        label: (
          <Link className="text-black no-underline" to="/route-list">
            GPS Routes List
          </Link>
        ),
      },
      {
        key: "4",
        label: (
          <Link className="text-black no-underline" to="/assigned-routelist">
            Assigned Route List
          </Link>
        ),
      },
      {
        key: "5",
        label: (
          <Link className="text-black no-underline" to="/gis-services">
            GIS Map Registration
          </Link>
        ),
      },
      {
        key: "6",
        label: (
          <Link className="text-black no-underline" to="/gis-services">
            SLA Parameters
          </Link>
        ),
      },
      {
        key: "7",
        label: (
          <Link className="text-black no-underline" to="/sectors-listing">
            Sectors List
          </Link>
        ),
      },
      {
        key: "8",
        label: (
          <Link className="text-black no-underline" to="/parking">
            Parking List
          </Link>
        ),
      },
      {
        key: "9",
        label: (
          <Link className="text-black no-underline" to="/manpower-assignment">
            Manpower Assignment
          </Link>
        ),
      },
      {
        key: "10",
        label: (
          <Link className="text-black no-underline" to="/shift">
            Shift
          </Link>
        ),
      },
      {
        key: "11",
        label: (
          <Link className="text-black no-underline" to="/user-type-permission">
            User Type Permission
          </Link>
        ),
      },
      {
        key: "12",
        label: (
          <Link className="text-black no-underline" to="/sector-allocation">
            Allocate Sector
          </Link>
        ),
      },
      {
        key: "13",
        label: (
          <Link className="text-black no-underline" to="/config-setting">
            Configuration Settings
          </Link>
        ),
      },
      {
        key: "14",
        label: (
          <Link className="text-black no-underline" to="/asset-allocation">
            Allocate Assets
          </Link>
        ),
      },
    ].sort((a, b) => {
      const labelA = a.label.props.children.toLowerCase();
      const labelB = b.label.props.children.toLowerCase();
      if (labelA < labelB) return -1;
      if (labelA > labelB) return 1;
      return 0;
    });
  };

  const dms_items = (lang, dict) => {
    return [
      {
        key: "1",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/DMS-dashboard"
          >
            DMS Dashboard
          </Link>
        ),
      },
    ];
  };

  const schedule_items = (lang, dict, navigate) => {
    return [
      // {
      //   key: "1",
      //   label: (
      //     <Link
      //       className="text-black no-underline hover:text-green"
      //       to="/scheduling-and-deployment"
      //     >
      //       Create
      //     </Link>
      //   ),
      // },
      {
        key: "1",
        label: (
          <Link
            className="text-black no-underline"
            to="/create-sanitation-schedule"
          >
            Sanitation Management Schedule
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link
            className="text-black no-underline"
            to="/create-tentage-schedule"
          >
            Tentage Management Schedule
          </Link>
        ),
      },
      {
        key: "3",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/waste-management-schedule"
          >
            Waste Management Schedule
          </Link>
        ),
      },
    ];
  };

  const complaince_items = (lang, dict) => {
    return [
      {
        key: "2",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/monitoring"
          >
            Monitoring
          </Link>
        ),
      },
      {
        key: "3",
        label: (
          <Link className="text-black no-underline" to="/notification">
            Notification
          </Link>
        ),
      },
    ];
  };

  const waste_items = (lang, dict) => {
    return [
      {
        key: "2",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/route"
          >
            Route
          </Link>
        ),
      },
    ];
  };

  // reports
  const reports_items = (lang, dict) => {
    return [
      monitoring_reports?.includes(userRoleId) && {
        key: "2",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/monitoring"
          >
            Monitoring Report
          </Link>
        ),
      },
      monitoring_dailyWeekly_reports?.includes(userRoleId) && {
        key: "10",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/monitoring-daily-report"
          >
            Daily Monitoring Report
          </Link>
        ),
      },
      monitoring_dailyWeekly_reports?.includes(userRoleId) && {
        key: "11",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/weekly-monitoring-report"
          >
            Weekly Monitoring Report
          </Link>
        ),
      },
      sector_wise_reports?.includes(userRoleId) && {
        key: "3",
        label: (
          <Link className="text-black no-underline" to="/sector-wise-report">
            Sector Wise Monitoring Report
          </Link>
        ),
      },
      // circle_wise_reports?.includes(userRoleId) && {
      //   key: "4",
      //   label: (
      //     <Link className="text-black no-underline" to="/circle-wise-report">
      //       Circle Wise Report
      //     </Link>
      //   ),
      // },
      vendor_wise_reports?.includes(userRoleId) && {
        key: "5",
        label: (
          <Link className="text-black no-underline" to="/vendor-wise-report">
            Vendor Wise Monitoring Report
          </Link>
        ),
      },
      incident_reports?.includes(userRoleId) && {
        key: "6",
        label: (
          <Link className="text-black no-underline" to="/incident-report">
            Incident Report
          </Link>
        ),
      },
      inspections_reports?.includes(userRoleId) && {
        key: "7",
        label: (
          <Link className="text-black no-underline" to="/inspection-report">
            Inspection Report
          </Link>
        ),
      },
      gsd_wise_regi_reports?.includes(userRoleId) && {
        key: "8",
        label: (
          <Link
            className="text-black no-underline"
            to="/gsd-wise-registration-report"
          >
            GSD Wise Registration Report
          </Link>
        ),
      },
      vendor_wise_regi_reports?.includes(userRoleId) && {
        key: "9",
        label: (
          <Link
            className="text-black no-underline"
            to="/vendor-wise-registration-report"
          >
            Vendor Wise Registration Report
          </Link>
        ),
      },
      sector_wise_regi_reports?.includes(userRoleId) && {
        key: "10",
        label: (
          <Link
            className="text-black no-underline"
            to="/sector-wise-registration-report"
          >
            Sector Wise Registration Report
          </Link>
        ),
      },
      sector_type_wise_regi_reports?.includes(userRoleId) && {
        key: "10",
        label: (
          <Link
            className="text-black no-underline"
            to="/sector-type-wise-registration-report"
          >
            Sector & Type Wise Registration Report
          </Link>
        ),
      },
      gsd_wise_monitoring_reports?.includes(userRoleId) && {
        key: "11",
        label: (
          <Link
            className="text-black no-underline"
            to="/gsd-wise-monitoring-report"
          >
            GSD Wise Monitoring Report
          </Link>
        ),
      },
      vehicle_reports?.includes(userRoleId) && {
        key: "12",
        label: (
          <Link className="text-black no-underline" to="/vehicle-report">
            Vehicle Report
          </Link>
        ),
      },
    ];
  };

  const setting_item = (dict, lang, navigate) => {
    const list = [
      {
        key: "1",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/user-profile"
          >
            Profile
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link
            className="text-black no-underline hover:text-green"
            to="/change-password"
          >
            Change Password
          </Link>
        ),
      },
    ];

    localStorage.getItem("sessionToken")
      ? list.push({
          key: "3",
          label: (
            <div
              className="text-black no-underline hover:text-green"
              onClick={() => {
                handleLogOut();
              }}
            >
              Logout
            </div>
          ),
        })
      : list.push({
          key: "4",
          label: (
            <div
              className="text-black no-underline hover:text-green"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </div>
          ),
        });

    return list;
  };

  // const [logName, setLogName] = useState(false);

  // useEffect(() => {
  //   if (loggedIn) {
  //     setLogName(true);
  //   }
  // }, []);

  // const handleLang = () => {
  //   if (lang === "hi") {
  //     setLang("en");
  //   } else {
  //     setLang("hi");
  //   }
  // };

  // useEffect(() => {
  //   const titleName = location.pathname.split("/").join("").split("-")[0];
  //   if (titleName === "dashboard") {
  //     setTitle("Sanitation");
  //   } else if (titleName === "home") {
  //     setTitle("");
  //   } else {
  //     setTitle(titleName);
  //   }
  // }, [location]);

  const isNavbarTransition =
    document.querySelector(".navbar-transition") == null;

  return (
    <div className="px-3 font-nutino bg-white p-1 shadow-md">
      <div className="flex w-full justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            // to={localStorage.getItem("sessionToken") ? "/dashboard" : "/home"}
            onClick={handleButtonClick}
            className="no-underline d-flex"
          >
            <img
              src={IMAGELIST?.govt_logo}
              className={`h-[30px] sm:h-[20px] md:h-[30px] lg:h-14 xl:${
                isNavbarTransition ? "h-10" : "h-14"
              }`}
              alt="UP Govt Logo"
            />

            <img
              src={IMAGELIST?.kumbhMela}
              className={`lg:mt-1 h-[28px] sm:h-[18px] md:h-[28px] lg:h-12 xl:${
                isNavbarTransition ? "h-8" : "h-12"
              }`}
              alt="Maha Kumbh 2025 Logo"
            />
          </button>

          <div
            className="z-50  flex items-center h-12 m-auto  justify-start font-bold text-lg"
            style={{ color: "#FF9500" }}
          >
            <span className="capitalize mr-1">{title} </span>
            <Button
              // onClick={() => {
              //   checkLoginAvailability(sessionData, navigate);
              // }}
              onClick={handleButtonClick}
              // to={
              //   localStorage.getItem("sessionToken") ? "/dashboard" : "/login"
              // }
              className="no-underline text-2xl md:text-lg lg:text-md xl:text-xl xxl:text-2xl mr-1 bg-transparent border-none hover:text-blue-700 text-blue-500  font-bold"
              // className="font-bold bg-transparent border text-black hover:text-blue-500 text-xs md:text-lg lg:text-md xl:text-md xxl:text-xl mr-1"
            >
              ICT Sanitation and Tentage Monitoring System
            </Button>
          </div>
        </div>

        <div className="flex">
          <div className="z-50  flex items-center h-12 justify-center ">
            <div className="hidden mt-0 xl:flex gap-1 justify-start items-center z-50 text-base font-semibold h-fit text-black lg:text-base">
              {!loggedIn && (
                <Link to={"/login"} className="no-underline text-black text-sm">
                  <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                    {dict.home[lang]}
                  </div>
                </Link>
              )}

              {/* <Link className="text-black no-underline " to="/dashboard">
                <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                  Dashboard
                </div>
              </Link> */}

              {loggedIn && (
                <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded ">
                  <DropDown
                    text="black"
                    items={dashboards(lang, dict)}
                    name={"Dashboard"}
                  ></DropDown>
                </div>
              )}
              {userAccess_param.includes(userRoleId) && (
                <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                  <DropDown
                    text="black"
                    items={register_items(lang, dict)}
                    // name={dict.register[lang]}
                    name="User Access & Registration"
                  ></DropDown>
                </div>
              )}

              {masterData_param.includes(userRoleId) && (
                <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                  <DropDown
                    text="black"
                    items={master_items(lang, dict)}
                    // name={dict.register[lang]}
                    name="Master Data Creation"
                  ></DropDown>
                </div>
              )}

              {/* <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                <DropDown
                  text="black"
                  items={schedule_items(lang, dict, navigate)}
                  name="Schedule"
                ></DropDown>
              </div>

              <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                <DropDown
                  text="black"
                  items={complaince_items(lang, dict)}
                  name="Complaince"
                ></DropDown>
              </div> */}

              {/* {DMS_param.includes(userRoleId) && (
                <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded ">
                  <DropDown
                    text="black"
                    items={dms_items(lang, dict)}
                    name={"DMS"}
                  ></DropDown>
                </div>
              )} */}
              {reports_param.includes(userRoleId) && (
                <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                  <DropDown
                    text="black"
                    items={reports_items(lang, dict)}
                    name="Reports"
                  ></DropDown>
                </div>
              )}

              {/* <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                <DropDown
                  text="black"
                  items={waste_items(lang, dict)}
                  name="Waste Management"
                ></DropDown>
              </div> */}

              <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                  <DropDown
                    text="black"
                    items={setting_item(dict, lang, navigate)}
                    name={dict.setting[lang]}
                  ></DropDown>
                </div>
              </div>

              {/* {!logName ? (
                <button onClick={() => handleNavigation("/login")}>
                  <div className="h-9 flex  items-center hover:bg-lime-300 px-2">
                    Login
                  </div>
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      handleNavigation("/login");
                    }}
                  >
                    <div className="h-9 flex  items-center hover:bg-lime-300 px-2">
                      Logout
                    </div>
                  </button>
                </div>
              )} */}
            </div>

            <div className="flex w-11/12 m-auto justify-between xl:hidden">
              <span className="flex items-center">
                <Button
                  className="flex xl:hidden bg-transparent border-none text-black"
                  onClick={showDrawer}
                >
                  <MenuOutlined></MenuOutlined>
                </Button>
              </span>
            </div>

            <Drawer
              onClose={onClose}
              open={open}
              title={
                <div className="text-violet-950 text-lg font-semibold">
                  ICT Sanitation and Tentage Monitoring System
                </div>
              }
            >
              <div className="text-base">
                {loggedIn && (
                  <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                    <DropDown
                      text="black"
                      items={dashboards(lang, dict)}
                      name={"Dashboard"}
                    ></DropDown>
                  </div>
                )}

                {!loggedIn && (
                  <Link to={"/home"} className="no-underline text-black">
                    <div className="h-10 text-black font- border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                      {dict.home[lang]}
                    </div>
                  </Link>
                )}
                {userAccess_param.includes(userRoleId) && (
                  <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                    <DropDown
                      text="black"
                      items={register_items(lang, dict)}
                      name={dict.register[lang]}
                    ></DropDown>
                  </div>
                )}

                {masterData_param.includes(userRoleId) && (
                  <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                    <DropDown
                      text="black"
                      items={master_items(lang, dict)}
                      // name={dict.register[lang]}
                      name="Master Data Creation"
                    ></DropDown>
                  </div>
                )}

                {DMS_param.includes(userRoleId) && (
                  <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                    <DropDown
                      text="black"
                      items={dms_items(lang, dict)}
                      name={"DMS"}
                    ></DropDown>
                  </div>
                )}

                {/* <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                  <DropDown
                    text="black"
                    items={schedule_items(lang, dict, navigate)}
                    name="Schedule"
                  ></DropDown>
                </div> */}

                {/* <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                  <DropDown
                    text="black"
                    items={complaince_items(lang, dict)}
                    name="Complaince"
                  ></DropDown>
                </div> */}
                {reports_param.includes(userRoleId) && (
                  <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                    <DropDown
                      text="black"
                      items={reports_items(lang, dict)}
                      name="Reports"
                    ></DropDown>
                  </div>
                )}

                <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300  hover:text-black px-3 ">
                  <DropDown
                    text="black"
                    items={setting_item(dict, lang, navigate)}
                    name={dict.setting[lang]}
                  ></DropDown>
                </div>

                {/* <div className="h-9 flex  items-center hover:bg-lime-300 px-2 rounded">
                  <DropDown
                    text="black"
                    items={waste_items(lang, dict)}
                    name="Waste Management"
                  ></DropDown>
                </div>

                <div className="h-10  text-black font-semibold border-b flex items-center hover:bg-lime-300 px-3 bg-04">
                  <DropDown
                    text="black"
                    items={setting_item(dict, lang)}
                    name={dict.setting[lang]}
                  ></DropDown>
                </div>

                <div className="h-10  text-black font-semibold border-b flex items-center hover:bg-lime-300 px-3 bg-04">
                  {dict.help[lang]}
                </div> */}

                {/* <button
                  onClick={handleLang}
                  className="h-10 w-full  text-black font-semibold border-b flex items-center hover:bg-lime-300 px-3 bg-04"
                >
                  A / अ
                </button> */}

                {/* {!logName ? (
                  <button onClick={() => handleNavigation("/login")}>
                    <div className="h-9 flex items-center hover:bg-lime-300 px-2 text-black font-semibold  ">
                      {dict.login[lang]}
                    </div>
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        handleNavigation("/login");
                      }}
                    >
                      <div className="h-9 flex text-black font-semibold  items-center hover:b2-lime-300 px-3">
                        {dict.logout[lang]}
                      </div>
                    </button>
                  </div>
                )} */}
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
