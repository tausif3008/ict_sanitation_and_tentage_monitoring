import React from "react";
import { useDispatch } from "react-redux";
import { Badge, Select } from "antd";
import notificationIcon from "../assets/Dashboard/notification.png";
import calenderIcon from "../assets/Dashboard/calendarIcon.png";
import loginIcon from "../assets/Dashboard/logInIcon.png";
import { Link, useNavigate } from "react-router-dom";
import logOutIcon from "../assets/Dashboard/logOutIcon.png";
// import img1 from "../assets/Images/UPGovLatestLogo.png";
// import img2 from "../assets/Images/MahaKumbhLogo_optimized.png";
import { langingPage } from "../utils/dictionary";
import { logOutUser } from "../Login/slice/loginSlice";
import { revertAll } from "../Redux/action";

const NavHead = ({ lang, setLang }) => {
  const myDate = new Date();
  const dict = langingPage;
  const dispatch = useDispatch()

  // Format the date
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const handleLang = () => {
    if (lang === "en") {
      localStorage.setItem("lang", "hi");
      setLang("hi");
    } else {
      localStorage.setItem("lang", "en");
      setLang("en");
    }
  };

  const navigate = useNavigate();
  const formattedDate = myDate.toLocaleDateString("en-GB", options);
  let token = localStorage.getItem("sessionToken");

  // logout 
  const handleLogOut = async () => {
    const result = await dispatch(logOutUser())
    if (result?.data?.success) {
      dispatch(revertAll());
      localStorage.clear();
      sessionStorage.clear();
      // setTimeout(() => {
      navigate("/");
      // }, 1000);
    }
  }

  return (
    <div className="relative top-0 px-3 bg-orange-400 font-nutino">
      <div className="font-merriweather flex justify-around w-full m-auto p-2 px-1 md:px-3">
        <div className="text-center font-semibold text-xl w-full col-span-2 flex m-auto justify-between items-center">
          <div className="hidden text-sm bg-white h-8 font-thin p-1 px-2 md:flex gap-1 justify-center items-center rounded">
            <img src={calenderIcon} alt="" />
            <span className="text-xs font-nutino flex justify-center items-center ">
              {formattedDate}
            </span>
          </div>
          <Link
            to={
              localStorage.getItem("sessionToken")
                ? "/sanitation-dashboard"
                : "/login"
            }
            className="no-underline flex items-center space-x-4"
          >
            {/* <img src={img2} className="h-20" alt="MahaKumbh 2025 Logo" /> */}
            <div className="text-white font-nutino text-sm xs:text-[8px] md:text-base lg:text-lg leading-tight">
              <span>Maha Kumbh Mela 2025, Prayagraj Mela Authority.</span>
            </div>

            {/* <img src={img1} className="h-20" alt="UP Police Logo" /> */}
          </Link>
          <div className="flex gap-2 items-center">
            <div className="h-full items-center flex">
              <a
                className="text-sm text-white no-underline"
                href="#"
                onClick={handleLang}
              >
                ENG | हिंदी{" "}
              </a>{" "}
            </div>

            {/* <div>
              <div
                className="text-black cursor-pointer bg-white rounded p-1 w-full h-full text-start no-underline"
                onClick={handleLang}
                style={{ width: "70px" }}
              >
                ENG/हिंदी{" "}
              </div>
            </div> */}

            <div className=" bg-white flex justify-center items-center rounded w-8 h-8 cursor-pointer">
              <div className="flex justify-center items-center ">
                <Badge size="small" status="success" offset={[7, 0]} count={5}>
                  <img
                    className="h-5"
                    src={notificationIcon}
                    alt="searchIcon"
                  ></img>
                </Badge>
              </div>
            </div>
            <div
              onClick={() => {
                if (token) {
                  handleLogOut();
                } else {
                  navigate("/login");
                }
              }}
              className="text-sm font-thin p-1  flex gap-1 justify-center items-center rounded h-8 w-8 bg-white cursor-pointer ml-1"
            >
              {token ? (
                <img className="h-5" src={logOutIcon} alt="Log Out" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  className="h-5"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavHead;
