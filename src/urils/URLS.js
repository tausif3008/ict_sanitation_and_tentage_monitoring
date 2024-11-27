const URLS = {
  baseUrl: "https://kumbhtsmonitoring.in/php-api",

  // user
  register: { path: "/users/entry", version: "5.43" },
  editUser: { path: "/users/edit", version: "5.43" },
  users: { path: "/users", version: "5.43" },
  country: { path: "/country", version: 5.43 },
  state: { path: "/state", version: 5.43 }, // ?country_id=1
  city: { path: "/city", version: 5.43 }, //?country_id=1&state_id=1
  userType: { path: "/user-types?per_page=100", version: 5.43 },
  userTypeLogin: { path: "/universal/user-types?per_page=100", version: 5.43 },
  allUserType: { path: "/user-types", version: 5.43 },
  moduleList: { path: "/module", version: 5.43 },
  TypeWiseUserList: { path: "/users?user_type_id=", version: "5.43" },

  // module permission
  allModulePermission: { path: "/module-permission", version: 5.43 },
  ModulePermissionEdit: { path: "/module-permission/edit", version: 5.43 },

  // vendor
  vendors: {
    path: "/users?page=1&per_page=100&user_type_id=8",
    version: "5.43",
  },
  vendorUsers: { path: "/users/details?user_id=", version: "5.43" },
  vendorwiseSupervisor: { path: "/users?vendor_id=", version: "5.43" },

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
  monitoringDetails: { path: "/monitoring/details?id=", version: 5.43 },

  // asset
  assetList: { path: "/asset", version: 5.43 },
  assetDetails: { path: "/asset/details?assets_id=", version: 5.43 },

  //reporting
  sectors: { path: "/sector", version: 5.43 },

  // circle wise report
  allCircleList: { path: "/circle", version: 5.43 },
  circle_wise_report: { path: "/reporting/circle", version: 5.43 },

  // parking
  parking: { path: "/parking", version: 5.43 },

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

  // inspection Report
  inspectionReport: { path: "/reporting/report-format-one", version: 5.43 },
};

export default URLS;
