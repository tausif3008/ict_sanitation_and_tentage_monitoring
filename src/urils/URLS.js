import { basicUrl } from "../Axios/commonAxios";

const URLS = {
  baseUrl: basicUrl,

  // user
  register: { path: "/users/entry", version: "5.43" },
  editUser: { path: "/users/edit", version: "5.43" },
  users: { path: "/users", version: "5.43" },
  country: { path: "/country", version: 5.43 },
  out: { path: "/logout", version: 5.43 },
  state: { path: "/state", version: 5.43 }, // ?country_id=1
  city: { path: "/city", version: 5.43 }, //?country_id=1&state_id=1
  // userType: { path: "/user-types?per_page=100", version: 5.43 },
  userTypeLogin: { path: "/universal/user-types?per_page=100", version: 5.43 },
  allUserType: { path: "/user-types?page=1&per_page=100", version: 5.43 },
  moduleList: { path: "/module", version: 5.43 },
  TypeWiseUserList: {
    path: "/users?page=1&per_page=100&user_type_id=",
    version: "5.43",
  },

  // module permission
  allModulePermission: { path: "/module-permission", version: 5.43 },
  ModulePermissionEdit: { path: "/module-permission/edit", version: 5.43 },

  // vendor
  vendors: {
    path: "/users?page=1&per_page=200&user_type_id=8",
    version: "5.43",
  },
  AssetTypeWiseVendors: {
    path: "/vendor-details?page=1&per_page=100&asset_type_id=",
    version: "5.43",
  },
  // vendorUsers: { path: "/users/details?user_id=", version: "5.43" },
  vendorwiseSupervisor: {
    path: "/users?page=1&per_page=100&vendor_id=",
    version: "5.43",
  },

  // vendor Details
  vendorDetails: { path: "/vendor-details?user_id=", version: "5.43" },
  addVendorDetails: { path: "/vendor-details/entry", version: "5.43" },
  editVendorDetails: { path: "/vendor-details/edit", version: 5.43 },
  deleteVendorDetails: { path: "/vendor-details/delete/", version: 5.43 },
  vendorAsset: { path: "/asset-types", version: 5.43 },
  assetMainTypePerPage: {
    path: "/asset-main-types?per_page=100",
    version: 5.43,
  },
  vendorDetailsAssetType: {
    path: "/vendor-details?asset_type_id=",
    version: "5.43",
  }, // asset type wise vendor list / details
  vendorDetailsCategoryType: {
    path: "/vendor-details?page=1&per_page=200&asset_main_type_id=",
    version: "5.43",
  }, // asset type wise vendor list / details

  vendorTypeCategoryDrop: {
    path: "/vendor-details/get-vendor-by-types",
    // path: "/vendor-details/get-vendor-by-types?asset_main_type_id=1&asset_type_id=1",
    version: "5.43",
  }, // vendor dropdown asset main type and asset type

  // questions
  questions: { path: "/questions", version: "5.43" },
  questionsEntry: { path: "/questions/entry", version: "5.43" },
  editQuestionsEntry: { path: "/questions/edit", version: 5.43 },

  // Assets
  assetQuestions: { path: "/questions?asset_type_id=", version: "5.43" },
  assetTypes: { path: "/asset-types", version: 5.43 },
  assetTypeEntry: { path: "/asset-types/entry", version: 5.43 },
  editAssetType: { path: "/asset-types/edit", version: 5.43 },
  assetType: {
    path: "/asset-types?asset_main_type_id=",
    version: 5.43,
  },

  // monitoring
  asset: { path: "/asset", version: 5.43 },
  monitoringAgent: {
    path: "/users?page=1&per_page=100&user_type_id=6",
    version: "5.43",
  },
  monitoring: { path: "/monitoring", version: 5.43 },
  monitoringDailyReport: {
    // path: "/reporting/daily-asset-email-vendor",
    path: "/reporting/daily-monitoring-email-vendor",
    version: 5.43,
  },
  monitoringDetails: { path: "/monitoring/details?id=", version: 5.43 },

  // asset
  assetList: { path: "/asset", version: 5.43 },
  addAssetList: { path: "/asset/entry", version: 5.43 },
  edtAssetList: { path: "/asset/edit", version: 5.43 },
  deleteAssetList: { path: "/asset/delete", version: 5.43 },
  assetDetails: { path: "/asset/details?assets_id=", version: 5.43 },

  //reporting
  sectors: { path: "/sector", version: 5.43 },

  // circle wise report
  allCircleList: { path: "/circle", version: 5.43 },
  circle_wise_report: { path: "/reporting/circle", version: 5.43 },

  // sector wise report
  sector_wise_report: { path: "/reporting/sector", version: 5.43 },

  // sector wise registration report
  sector_wise_reg_report: { path: "/reporting/sector-tagging", version: 5.43 },

  // parking
  parking: { path: "/parking", version: 5.43 },
  addParking: { path: "/parking/entry", version: 5.43 },

  // proposed sectors
  vendorProposedSectors: {
    path: "/vendor-proposed-sectors",
    version: "5.43",
  },
  vehicles: {
    path: "/vehicles",
    version: 5.43,
  },
  addVehicle: {
    path: "/vehicles/entry",
    version: 5.43,
  },
  editVehicle: {
    path: "/vehicles/edit",
    version: 5.43,
  },

  //permissions
  permission: {
    path: "/user-permission/views?user_id=3",
    version: "5.43",
  },

  // shift
  shift: { path: "/shifts", version: 5.43 },
  shiftAdd: { path: "/shifts/entry", version: 5.43 },
  shiftEdit: { path: "/shifts/edit", version: 5.43 },

  // shift
  vendorReporting: { path: "/reporting/vendor", version: 5.43 },
  vendorReportingAdd: { path: "/reporting/vendor/entry", version: 5.43 },
  vendorReportingEdit: { path: "/reporting/vendor/edit", version: 5.43 },

  // allocation-supervisor
  getAllocate_Supervisor: { path: "/allocation-supervisor", version: 5.43 },
  addAllocate_Supervisor: {
    path: "/allocation-supervisor/entry",
    version: 5.43,
  },
  editAllocate_Supervisor: {
    path: "/allocation-supervisor/edit",
    version: 5.43,
  },

  // allocation sector
  getAllocate_Sector: { path: "/allocation-sector", version: 5.43 },
  addAllocate_Sector: {
    path: "/allocation-sector/entry",
    version: 5.43,
  },
  editAllocate_Sector: {
    path: "/allocation-sector/edit",
    version: 5.43,
  },
  deleteAllocate_Sector: {
    path: "/allocation-sector/delete",
    version: 5.43,
  },

  // allocation asset
  getAllocate_Asset: { path: "/allocation", version: 5.43 },
  // addAllocate_Asset: {
  //   path: "/allocation-asset/entry",
  //   version: 5.43,
  // },
  reAllocate_Asset: {
    path: "/allocation/re",
    version: 5.43,
  },
  deleteAllocate_Asset: {
    path: "/allocation/delete",
    version: 5.43,
  },

  // sla types
  slaTypes: { path: "/sla-types", version: 5.43 },

  // config settings
  getSettings: { path: "/settings/get", version: 5.43 },
  editSettings: { path: "/settings/edit", version: 5.43 },

  // config settings
  getSettings: { path: "/settings/get", version: 5.43 },
  editSettings: { path: "/settings/edit", version: 5.43 },

  // sanitation dashboard
  sanitationDash: { path: "/dashboard/sanitation", version: 5.43 },

  // dashboard
  dashboardApi: { path: "/dashboard", version: 5.43 },

  // incidences Report
  incidencesReport: { path: "/incidences", version: 5.43 },

  // incidences Report
  gsdRegistrationReport: { path: "/reporting/agent-tagging", version: 5.43 },
  vendorRegistrationReport: {
    path: "/reporting/vendor-tagging",
    version: 5.43,
  },

  // inspection Report
  inspectionReport: { path: "/reporting/report-format-one", version: 5.43 },

  // gsd monitoring Report
  getGsdMonitoringData: { path: "/reporting/gsd", version: 5.43 },

  // tentage dashboard
  tentageDash: { path: "/dashboard/tentage", version: 5.43 },

  // waste dashboard
  wasteDash: {
    path: "/vehicle-tracking?page=1&per_page=200&date_format=Today",
    version: 5.43,
  },

  // pick up point
  getPickUpPoint: {
    // path: `pickup-point/details?pickup_point_id=${1}`,
    path: "/pickup-point",
    version: 5.43,
  },
  getPickUpPointDrop: {
    path: "/pickup-point?page=1&per_page=300",
    version: 5.43,
  },
  addPickUpPoint: {
    path: "/pickup-point/entry",
    version: 5.43,
  },
  editPickUpPoint: {
    path: "/pickup-point/edit",
    version: 5.43,
  },

  // Route list
  getPickUpRoute: {
    path: "/pickup-route",
    version: 5.43,
  },
  addPickUpRoute: {
    path: "/pickup-route/entry",
    version: 5.43,
  },
  editPickUpRoute: {
    path: "/pickup-route/edit",
    version: 5.43,
  },
};

export default URLS;
