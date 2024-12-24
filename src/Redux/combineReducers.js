// slices/index.js
import { combineReducers } from "@reduxjs/toolkit";
import assetTypeSlice from "./../register/AssetType/AssetTypeSlice";
import vendorDetailsSlice from "./../register/vendor/VendorDetails/vendorDetailsSlice";
import userSlice from "./../register/user/userSlice";
import questionSlice from "./../register/questions/questionSlice";
import monitoringSlice from "./../complaince/monitoringSlice";
import assetsSlice from "./../register/asset/AssetsSlice";
import parkingSlice from "./../register/parking/parkingSlice";
import shiftSlice from "../shifts/shifts/shiftSlice";
import vendorWiseSlice from "../Reports/VendorwiseReports/vendorslice";
import userTypeSlice from "../permission/UserTypePermission/userTypeSlice";
import vendorSupervisorSlice from "../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import vendorSectorSlice from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import configSlice from "../setting/configSettingSlice/configSlice";
import circleWiseSlice from "../Reports/CircleSlice/circleSlices";
import sanitationDashboard from "../SanitationDashboard/Slice/sanitationDashboard";
import IncidentReportSlice from "../Reports/Incident-reports/Slice/IncidentReportSlice";
import InspectionReportSlice from "../Reports/Inspection-reports/Slice/InspectionReportSlice";
import routeSlice from "../register/route/routeSlice";
import SectorReportSlice from "../Reports/SectorSlice/sectorSlice";
import tentageSlice from "../TentageDashboard/Slice/tentageSlice";
import wasteDashboardSlice from "../WasteDashboard/Slice/wasteDashboardSlice";
import GsdWiseRegistrationReport from "../Reports/GSDWiseRegistrationReport/Slice/gsdWiseRegistrationReport";
import loginSlice from "../Login/slice/loginSlice";

const rootReducer = combineReducers({
  assetTypeUpdateEl: assetTypeSlice,
  vendorDetailsSlice: vendorDetailsSlice,
  userSlice: userSlice,
  questionSlice: questionSlice,
  monitoringSlice: monitoringSlice,
  assetsSlice: assetsSlice,
  parkingSlice: parkingSlice,
  shiftSlice: shiftSlice,
  vendorWiseSlice: vendorWiseSlice,
  userTypeSlice: userTypeSlice,
  vendorSupervisorSlice: vendorSupervisorSlice,
  vendorSectorSlice: vendorSectorSlice,
  configSlice: configSlice,
  circleWiseSlice: circleWiseSlice,
  loginSlice: loginSlice,

  // dashboard
  sanitationDashboard: sanitationDashboard,
  tentageSlice: tentageSlice,
  wasteDashboardSlice: wasteDashboardSlice,

  // Reports
  IncidentReportSlice: IncidentReportSlice,
  InspectionReportSlice: InspectionReportSlice,
  SectorReportSlice: SectorReportSlice,
  GsdWiseRegistrationReport: GsdWiseRegistrationReport,

  // route
  routeSlice: routeSlice,
});

export default rootReducer;
