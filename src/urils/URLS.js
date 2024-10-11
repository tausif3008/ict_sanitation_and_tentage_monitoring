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

  // vendor
  vendors: { path: "/users/?user_type_id=8", version: "5.43" },
  vendorUsers: { path: "/users/details?user_id=", version: "5.43" },

  // vendor Details
  vendorDetails: { path: "/vendor-details?user_id=", version: "5.43" },
  addVendorDetails: { path: "/vendor-details/entry", version: "5.43" },
  editVendorDetails: { path: "/vendor-details/edit", version: 5.43 },
  vendorAsset: { path: "/asset-types", version: 5.43 },
  assetMainTypePerPage: {
    path: "/asset-main-types?per_page=100",
    version: 5.43,
  },

  // questions
  questions: { path: "/questions", version: "5.43" },
  questionsEntry: { path: "/questions/entry", version: "5.43" },
  editQuestionsEntry: { path: "/questions/edit", version: 5.43 },

  // Assets
  assetQuestions: { path: "/questions?asset_type_id=", version: "5.43" },
  assetTypes: { path: "/asset-types", version: 5.43 },
  assetTypeEntry: { path: "/asset-types/entry", version: 5.43 },
  editAssetType: { path: "/asset-types/edit", version: 5.43 },

  // monitoring
  asset: { path: "/asset", version: 5.43 },
  monitoring: { path: "/monitoring", version: 5.43 },
  monitoringDetails: { path: "/monitoring?assets_id=", version: 5.43 },

  // asset
  assetList: { path: "/asset", version: 5.43 },

  // sectors
  sectors: { path: "/sector", version: 5.43 },
};

export default URLS;
