import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  // BrowserRouter,
  Navigate,
  Route,
  Routes,
  // useLocation,
  useNavigate,
} from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login/Login";
import Layout from "./AppLayout/Layout";
import UserList from "./register/user/UsersList";
import AssetRegistrationForm from "./register/asset/AssetRegistrationForm";
import AssetsList from "./register/asset/AssetsList";
import AssetAllotment from "./register/asset/AssetAllotment";
import GisServices from "./gis/GisServices";
import GisList from "./gis/GisList";
import VendorRegistrationForm from "./register/vendor/VendorRegistrationForm";
import GPSFleetRegistration from "./gis/GPSFleetRegistration";
import ManPowerAssignmentForm from "./assignment/ManPowerAssignmentForm";
import AssigningMonitoringManPower from "./assignment/AssigningMonitoringManPower";
import SchedulingAndDeploymentForm from "./schedule/SchedulingAndDeploymentForm";
import WasteManagementSchedule from "./schedule/WasteManagementSchedule";
import CreateTentageSchedule from "./schedule/CreateTentageSchedule";
import CreateSanitationSchedule from "./schedule/CreateSanitationSchedule";
import MonthlyReport from "./schedule/MonthlyReport";
import Monitoring from "./complaince/Monitoring";
import MonitoringReport from "./complaince/MonitoringReport";
import NotificationAdd from "./notification/NotificationAdd";
import WastesDashboard from "./WasteDashboard/WastesDashboard";
import Dashboard from "./dashboardNew/Dashboard";
import SanitationDashboard from "./SanitationDashboard/SanitationDashboard";
import TentageDashboard from "./TentageDashboard/TentageDashboard";
import IncidentDashboard from "./IncidentDashborad/IncidentDashboard";
import AppError from "./AppError";
import DMSDashboard from "./DMSDashboard/DMSDashboard";
import SLADashboard from "./SLADashboard/SLADashboard";
import VendorDetails from "./register/vendor/VendorDetails/VendorDetails";
import UserRegistrationForm from "./register/user/UserRegistrationForm";
import VendorDetailsForm from "./register/vendor/VendorDetails/VendorDetailsForm";
import AddQuestionForm from "./register/questions/AddQuestionForm";
import QuestionList from "./register/questions/QuestionList";
import AssetTypeForm from "./register/AssetType/AssetTypeForm";
import AssetTypeList from "./register/AssetType/AssetType";
import VendorList from "./register/vendor/VendorList";
import VehicleList from "./register/vehicle/VehicleList";
import AddVehicleForm from "./register/vehicle/AddVehicleForm";
import UserProfile from "./Profile/UserProfile";
import SectorsListing from "./register/sectorListing/SectorListing";
import ParkingList from "./register/parking/ParkingList";
import SectorWiseReport from "./Reports/SectorWiseReport";
import CircleWiseReport from "./Reports/CircleWiseReport";
import Shift from "./shifts/shifts";
import ChangePassword from "./Login/ChangePassword";
import AddShiftForm from "./shifts/add form";
import VendorReports from "./Reports/VendorwiseReports";
import AddRouteForm from "./register/route/AddRouteForm";
import RouteList from "./register/route/RouteList";
import VendorDashboard from "./vendorDashboard/VendorDashboard";
import UserTypePermission from "./permission/UserTypePermission";
import UpdateUserTypePermisssion from "./permission/UserTypePermission/add-update-form";
import VendorSupervisorRegistration from "./vendor/VendorSupervisorRegistration";
import VendorSupervisorForm from "./vendor/VendorSupervisorRegistration/VendorSupervisorForm";
import VendorSectorAllocation from "./vendor-section-allocation/vendor-sector";
import VendorSectorForm from "./vendor-section-allocation/vendor-sector/vendorSectorForm";
import ConfigSetting from "./setting/ConfigSetting";
import ConfigSettingForm from "./setting/configSettingSlice/configForm";
import AssignRouteForm from "./register/route/AssignRouteForm";
import AssignedRouteList from "./register/route/AssignedRouteList";
import PrivacyPolicy from "./privacypolicy/privacypolicy";
import DeleteAccount from "./deleteaccount/deleteaccount";
import axiosInstance from "./Axios/commonAxios";
import IncidentReports from "./Reports/Incident-reports";
import ContactUsPage from "./contactus/contactus";
import InspectionReports from "./Reports/Inspection-reports";
import GsdRegistrationReport from "./Reports/GSDWiseRegistrationReport";
import VendorRegistrationReport from "./Reports/VendorWiseRegistrationReport";
import { revertAll } from "./Redux/action";
import TermsAndConditions from "./pages/term-and-conditions";
import AboutUs from "./pages/about-us";
import LoginSelectors from "./Login/slice/loginSelector";
import { logOutUser } from "./Login/slice/loginSlice";
import AddParkingForm from "./register/parking/AddParking";
import ProtectedRoute from "./protectiveRoutes";
import {
  circle_wise_reports,
  gsd_wise_regi_reports,
  incident_reports,
  incidentDash_param,
  inspections_reports,
  monitoring_reports,
  sanitationDash_param,
  sector_wise_reports,
  tentageDash_param,
  userAccess_param,
  vendor_wise_regi_reports,
  vendor_wise_reports,
  vendorDash_param,
  wasteDash_param,
} from "./constant/permission";
// import { Provider, useDispatch } from "react-redux";
// import store from "./Redux/store";
// import URLS from "./urils/URLS"
// import VendorWiseReport from "./Reports/VendorWiseReport";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sliceToken } = LoginSelectors();

  const link = `/login`;
  const loggedIn = localStorage.getItem("sessionToken");
  const token = localStorage.getItem("sessionToken") || sliceToken;
  const sessionData = localStorage.getItem("sessionData");
  const jsonObject = JSON.parse(sessionData);
  const tentageIdUser = jsonObject?.allocatedmaintype?.[0]?.asset_main_type_id;
  const userRoleId = localStorage.getItem("role_id");

  useEffect(() => {
    if (!token) {
      showLoginPage();
    }
  }, [token]);

  // useEffect(() => {
  //   if (loggedIn) {
  //     if (location.pathname.includes("login")) {
  //       const link = `/sanitation-dashboard`;
  //       navigate(link);
  //     } else {
  //       if (
  //         (location.pathname === "/sanitation-dashboard" ||
  //           location.pathname === "/") &&
  //         RoleId === "8"
  //       ) {
  //         const link = `/vendor-dashboard`;
  //         navigate(link);
  //       } else if (location.pathname === "/") {
  //         const link = `/sanitation-dashboard`;
  //         navigate(link);
  //       } else {
  //         const link = `${location.pathname}`;
  //         navigate(link);
  //       }
  //     }
  //   } else {
  //     const link = `/login`;
  //     navigate(link, { replace: true });
  //   }
  // }, [loggedIn, RoleId, location.pathname, navigate]);

  // login page call
  const showLoginPage = async () => {
    // const result = await dispatch(logOutUser())
    // if (result?.data?.success) {
    dispatch(revertAll());
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => {
      navigate(link, { replace: true });
      // navigate("/");
    }, 1000);
    // }
  };

  // pass the token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("sessionToken") || sliceToken;
      if (token) {
        config.headers["x-access-token"] = `${token}`;
      }
      return config; // Return the updated config
    },
    (error) => {
      return Promise.reject(error); // Handle request error
    }
  );

  // if invalid token
  axiosInstance.interceptors.response.use(
    (response) => {
      if (
        response.data.success === false &&
        response.data.message === "Invalid access token"
      ) {
        showLoginPage(); // show login page
      }

      return response;
    },
    (error) => {
      if (error.response && error.response.data) {
        if (
          error.response.data.success === false &&
          error.response.data.message === "Invalid access token"
        ) {
          showLoginPage(); // show login page
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    // <Provider store={store}>
    <Routes>
      <Route
        path="/"
        element={
          loggedIn ? (
            <>
              <Navigate to={"/sanitation-dashboard"}></Navigate>
            </>
          ) : (
            <Navigate to={"/login"} />
          )
        }
      ></Route>

      <Route path="/" element={<Layout></Layout>}>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>

        {/* dashboard */}
        {/* <Route
          path="/sanitation-dashboard"
          element={<SanitationDashboard></SanitationDashboard>}
        ></Route> */}
        <Route
          path="/sanitation-dashboard"
          element={
            <ProtectedRoute
              condition={sanitationDash_param?.includes(userRoleId)}
              component={SanitationDashboard}
            />
          }
        />
        {/* <Route
          path="/vendor-dashboard"
          element={<VendorDashboard></VendorDashboard>}
        ></Route> */}
        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute
              condition={
                vendorDash_param.includes(userRoleId) && tentageIdUser != "2"
              }
              component={VendorDashboard}
            />
          }
        />
        {/* <Route
          path="/tentage-dashboard"
          element={<TentageDashboard></TentageDashboard>}
        ></Route> */}
        <Route
          path="/tentage-dashboard"
          element={
            <ProtectedRoute
              condition={
                tentageDash_param?.includes(userRoleId) || tentageIdUser === "2"
              }
              component={TentageDashboard}
            />
          }
        />
        {/* <Route
            path="/waste-dashboard"
            element={<WastesDashboard></WastesDashboard>}
          ></Route> */}
        <Route
          path="/waste-dashboard"
          element={
            <ProtectedRoute
              condition={wasteDash_param?.includes(userRoleId)}
              component={WastesDashboard}
            />
          }
        />
        {/* <Route
            path="/incident-dashboard"
            element={<IncidentDashboard></IncidentDashboard>}
          ></Route> */}
        <Route
          path="/incident-dashboard"
          element={
            <ProtectedRoute
              condition={incidentDash_param?.includes(userRoleId)}
              component={IncidentDashboard}
            />
          }
        />
        <Route
          path="/DMS-dashboard"
          element={<DMSDashboard></DMSDashboard>}
        ></Route>
        <Route
          path="/SLA-dashboard"
          element={<SLADashboard></SLADashboard>}
        ></Route>
        {/* dashboard Close*/}

        <Route path="/home" element={<LandingPage></LandingPage>}></Route>

        {/* user access registration */}
        {/* <Route
          path="users/:page?/:per_page?"
          element={<UserList></UserList>}
        ></Route> */}
        {/* <Route
            path="user-registration"
            element={<UserRegistrationForm></UserRegistrationForm>}
          ></Route> */}
        {/* <Route
          path="vendor/:page?/:per_page?"
          element={<VendorList></VendorList>}
        ></Route> */}
        {/* <Route
          path="vendor-registration"
          element={<VendorRegistrationForm></VendorRegistrationForm>}
        ></Route> */}
        {/* <Route
          path="vendor/add-vendor-details/:id?/:page?/:per_page?"
          element={<VendorDetails></VendorDetails>}
        ></Route> */}
        {/* <Route
          path="vendor/add-vendor-details-form/:id"
          element={<VendorDetailsForm></VendorDetailsForm>}
        ></Route> */}
        {/* <Route
          path="asset-list/:page?/:per_page?"
          element={<AssetsList></AssetsList>}
        ></Route> */}
        {/* <Route
          path="/vendor-supervisor-registration/:page?/:per_page?"
          element={
            <VendorSupervisorRegistration></VendorSupervisorRegistration>
          }
        ></Route> */}
        {/* <Route
          path="/vendor-supervisor-form"
          element={<VendorSupervisorForm></VendorSupervisorForm>}
        ></Route> */}
        <Route
          path="users/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={UserList}
            />
          }
        />
        <Route
          path="user-registration"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={UserRegistrationForm}
            />
          }
        />
        <Route
          path="vendor/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={VendorList}
            />
          }
        />
        <Route
          path="vendor-registration"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={VendorRegistrationForm}
            />
          }
        />
        <Route
          path="vendor/add-vendor-details/:id?/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={VendorDetails}
            />
          }
        />
        <Route
          path="vendor/add-vendor-details-form/:id"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={VendorDetailsForm}
            />
          }
        />
        <Route
          path="asset-list/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={AssetsList}
            />
          }
        />
        <Route
          path="/vendor-supervisor-registration/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={VendorSupervisorRegistration}
            />
          }
        />
        <Route
          path="/vendor-supervisor-form"
          element={
            <ProtectedRoute
              condition={userAccess_param?.includes(userRoleId)}
              component={VendorSupervisorForm}
            />
          }
        />
        {/* user access registration end */}

        <Route
          path="asset-registration"
          element={<AssetRegistrationForm></AssetRegistrationForm>}
        ></Route>
        <Route
          path="gis-services"
          element={<GisServices></GisServices>}
        ></Route>
        <Route path="gis-list" element={<GisList></GisList>}></Route>
        <Route
          path="gps-fleet-registration"
          element={<GPSFleetRegistration></GPSFleetRegistration>}
        ></Route>

        {/* 
            <Route
              path="vendor-proposed-sectors/:page?/:per_page?"
              element={<VendorProposedSectors></VendorProposedSectors>}
            ></Route> */}

        <Route
          path="asset-type-registration"
          element={<AssetTypeForm></AssetTypeForm>}
        ></Route>

        <Route
          path="asset-type-list/:page?/:per_page?/:search?"
          element={<AssetTypeList />}
        />
        <Route
          path="add-question-form"
          element={<AddQuestionForm></AddQuestionForm>}
        ></Route>
        <Route path="questions/:page?/:per_page?" element={<QuestionList />} />
        <Route path="vendor-list" element={<VendorList></VendorList>}></Route>
        <Route
          path="vehicle-registration"
          element={<AddVehicleForm></AddVehicleForm>}
        ></Route>
        <Route
          path="vehicle/:page?/:per_page?"
          element={<VehicleList></VehicleList>}
        ></Route>
        <Route
          path="manpower-assignment"
          element={<ManPowerAssignmentForm></ManPowerAssignmentForm>}
        ></Route>
        <Route
          path="assigning-monitoring-manpower"
          element={<AssigningMonitoringManPower></AssigningMonitoringManPower>}
        ></Route>
        <Route
          path="asset-allotment"
          element={<AssetAllotment></AssetAllotment>}
        ></Route>
        <Route
          path="scheduling-and-deployment"
          element={<SchedulingAndDeploymentForm></SchedulingAndDeploymentForm>}
        ></Route>
        <Route
          path="waste-management-schedule"
          element={<WasteManagementSchedule></WasteManagementSchedule>}
        ></Route>
        <Route
          path="create-tentage-schedule"
          element={<CreateTentageSchedule></CreateTentageSchedule>}
        ></Route>
        <Route
          path="create-sanitation-schedule"
          element={<CreateSanitationSchedule></CreateSanitationSchedule>}
        ></Route>
        <Route
          path="monthly-report"
          element={<MonthlyReport></MonthlyReport>}
        ></Route>

        <Route
          path="asset-monitoring-report/:page?/:per_page?"
          element={<MonitoringReport></MonitoringReport>}
        ></Route>
        <Route
          path="notification"
          element={<NotificationAdd></NotificationAdd>}
        ></Route>
        <Route
          path="/user-profile"
          element={<UserProfile></UserProfile>}
        ></Route>
        <Route
          path="sectors-listing"
          element={<SectorsListing></SectorsListing>}
        ></Route>
        <Route path="parking" element={<ParkingList></ParkingList>}></Route>
        <Route
          path="add-parking-form"
          element={<AddParkingForm></AddParkingForm>}
        ></Route>

        <Route path="shift/:page?/:per_page?" element={<Shift></Shift>}></Route>
        <Route
          path="add-shift-form"
          element={<AddShiftForm></AddShiftForm>}
        ></Route>
        <Route
          path="change-password"
          element={<ChangePassword></ChangePassword>}
        ></Route>
        <Route path="route-list" element={<RouteList></RouteList>}></Route>
        <Route
          path="assigned-routelist"
          element={<AssignedRouteList></AssignedRouteList>}
        ></Route>
        <Route
          path="assign-route"
          element={<AssignRouteForm></AssignRouteForm>}
        ></Route>
        <Route path="add-route" element={<AddRouteForm></AddRouteForm>}></Route>
        <Route
          path="/user-type-permission/:page?/:per_page?"
          element={<UserTypePermission></UserTypePermission>}
        ></Route>
        <Route
          path="/user-permission-type-form"
          element={<UpdateUserTypePermisssion></UpdateUserTypePermisssion>}
        ></Route>

        <Route
          path="/sector-allocation/:page?/:per_page?"
          element={<VendorSectorAllocation></VendorSectorAllocation>}
        ></Route>
        <Route
          path="/sector-allocation-form"
          element={<VendorSectorForm></VendorSectorForm>}
        ></Route>
        <Route
          path="/config-setting"
          element={<ConfigSetting></ConfigSetting>}
        ></Route>
        <Route
          path="/config-setting-form"
          element={<ConfigSettingForm></ConfigSettingForm>}
        ></Route>
        <Route
          path="/privacypolicy"
          element={<PrivacyPolicy></PrivacyPolicy>}
        ></Route>
        <Route
          path="/deleteaccount"
          element={<DeleteAccount></DeleteAccount>}
        ></Route>
        <Route
          path="/contactus"
          element={<ContactUsPage></ContactUsPage>}
        ></Route>

        {/* report start */}
        {/* <Route
          path="monitoring/:page?/:per_page?"
          element={<Monitoring></Monitoring>}
        ></Route> */}
        {/* <Route
          path="monitoring-report/:id/:page?/:per_page?"
          element={<MonitoringReport></MonitoringReport>}
        ></Route> */}
        {/* <Route
          path="sector-wise-report"
          element={<SectorWiseReport></SectorWiseReport>}
        ></Route> */}
        {/* <Route
          path="circle-wise-report"
          element={<CircleWiseReport></CircleWiseReport>}
        ></Route> */}
        {/* <Route
          path="vendor-wise-report/:page?/:per_page?"
          element={<VendorReports></VendorReports>}
        ></Route> */}
        {/* <Route
          path="gsd-wise-registration-report/:page?/:per_page?"
          element={<GsdRegistrationReport></GsdRegistrationReport>}
        ></Route> */}
        {/* <Route
          path="/incident-report/:page?/:per_page?"
          element={<IncidentReports></IncidentReports>}
        ></Route> */}
        {/* <Route
          path="/inspection-report/:page?/:per_page?"
          element={<InspectionReports></InspectionReports>}
        ></Route> */}
        <Route
          path="monitoring/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={monitoring_reports?.includes(userRoleId)}
              component={Monitoring}
            />
          }
        />
        <Route
          path="monitoring-report/:id/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={monitoring_reports?.includes(userRoleId)}
              component={MonitoringReport}
            />
          }
        />
        <Route
          path="sector-wise-report"
          element={
            <ProtectedRoute
              condition={sector_wise_reports?.includes(userRoleId)}
              component={SectorWiseReport}
            />
          }
        />
        <Route
          path="circle-wise-report"
          element={
            <ProtectedRoute
              condition={circle_wise_reports?.includes(userRoleId)}
              component={CircleWiseReport}
            />
          }
        />
        <Route
          path="vendor-wise-report/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={vendor_wise_reports?.includes(userRoleId)}
              component={VendorReports}
            />
          }
        />
        <Route
          path="gsd-wise-registration-report/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={gsd_wise_regi_reports?.includes(userRoleId)}
              component={GsdRegistrationReport}
            />
          }
        />
        <Route
          path="vendor-wise-registration-report"
          element={
            <ProtectedRoute
              condition={vendor_wise_regi_reports?.includes(userRoleId)}
              component={VendorRegistrationReport}
            />
          }
        />
        <Route
          path="vendor-wise-registration-report"
          element={<VendorRegistrationReport></VendorRegistrationReport>}
        ></Route>

        <Route
          path="/incident-report/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={incident_reports?.includes(userRoleId)}
              component={IncidentReports}
            />
          }
        />
        <Route
          path="/inspection-report/:page?/:per_page?"
          element={
            <ProtectedRoute
              condition={inspections_reports?.includes(userRoleId)}
              component={InspectionReports}
            />
          }
        />
        {/* Report close */}

        {/* pages */}
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions></TermsAndConditions>}
        ></Route>
        <Route path="/about-us" element={<AboutUs></AboutUs>}></Route>
      </Route>
      <Route path="*" element={<AppError></AppError>}></Route>
      <Route path="login" element={<Login></Login>}></Route>
    </Routes>
    // </Provider>
  );
}

export default App;
