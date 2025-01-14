import { message } from "antd";
import axios from "axios";
import axiosInstance, {
  basicUrl,
  loginAxiosInstance,
} from "../Axios/commonAxios";
import { sessionToken } from "../constant/const";

// const loginFetch = async (data, setCanProceed) => {
//   const url = basicUrl + "/login";

//   const headers = {
//     "Content-Type": "multipart/form-data",
//     "x-api-key": "YunHu873jHds83hRujGJKd873",
//     "x-api-version": "1.0.1",
//     "x-platform": "Web",
//   };

//   try {
//     const response = await axios.post(url, data, { headers });
//     if (response.data.success) {
//       const sessionData = response.data.data.sessionData[0];
//       localStorage.setItem("sessionToken", response.data.sessionToken);
//       localStorage.setItem("role", sessionData?.user_type); // Role
//       localStorage.setItem("name", sessionData?.name); // Role
//       localStorage.setItem("role_id", sessionData?.user_type_id); // User type id
//       localStorage.setItem(
//         "sessionData",
//         JSON.stringify(response.data.data.sessionData[0])
//       );
//       localStorage.setItem("userId", sessionData.id);
//       localStorage.setItem("ImageUrl", sessionData?.s3path);
//       setCanProceed(true);

//       return response.data;
//     } else {
//       message.info(response.data.message);
//       return "error";
//     }
//   } catch (error) {
//     message.error("Something went wrong!");
//     return "error";
//   }
// };

const loginFetch = async (data, setCanProceed) => {
  const url = basicUrl + "/login";

  try {
    const response = await loginAxiosInstance.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      const sessionData = response.data.data.sessionData[0];
      localStorage.setItem("sessionToken", response.data.sessionToken);
      localStorage.setItem("role", sessionData?.user_type); // Role
      localStorage.setItem("name", sessionData?.name); // User name
      localStorage.setItem("role_id", sessionData?.user_type_id); // User type id
      localStorage.setItem(
        "sessionData",
        JSON.stringify(response.data.data.sessionData[0])
      );
      localStorage.setItem("userId", sessionData.id);
      localStorage.setItem("ImageUrl", sessionData?.s3path);
      localStorage.setItem(
        "category_mainType_id",
        sessionData?.allocatedmaintype?.[0]?.asset_main_type_id
      );
      setCanProceed(true);

      return response.data;
    } else {
      message.info(response.data.message);
      return "error";
    }
  } catch (error) {
    message.error("Something went wrong!");
    return "error";
  }
};

// const logoutFetch = async () => {
//   try {
//     const sessionToken = localStorage.getItem("sessionToken");
//     if (sessionToken) {
//       const response = await axios.delete(basicUrl + "/logout", {
//         headers: {
//           "x-api-key": "YunHu873jHds83hRujGJKd873",
//           "x-api-version": "1.0.1",
//           "x-platform": "Web",
//           "x-access-token": sessionToken,
//         },
//       });
//       if (response.status === 200) {
//         localStorage.removeItem("sessionToken");
//         localStorage.removeItem("sessionData");
//         return true;
//       }
//     }
//     return false;
//   } catch (error) {
//     console.error("Logout failed:", error);
//     return false;
//   }
// };

// const logoutFetch = async () => {
//   try {
//     if (sessionToken) {
//       const response = await axiosInstance.delete("/logout");
//       if (response.status === 200) {
//         localStorage.removeItem("sessionToken");
//         localStorage.removeItem("sessionData");
//         return true;
//       }
//     }
//     return false;
//   } catch (error) {
//     console.error("Logout failed:", error);
//     return false;
//   }
// };

// const postData = async (formData, urlLast = "", extraHeaders) => {
//   const url = basicUrl + urlLast;

//   const headers = {
//     "Content-Type": "multipart/form-data",
//     "x-api-key": "YunHu873jHds83hRujGJKd873",
//     "x-api-version": "5.43",
//     "x-platform": "Android",
//     "x-access-token": localStorage.getItem("sessionToken") || "",
//     ...extraHeaders,
//   };

//   const response = await axios
//     .post(url, formData, { headers })
//     .then((res) => {
//       if (res.data.success) {
//         message.success(res.data.message);
//       } else {
//         message.error(res.data.message);
//       }
//       return res;
//     })
//     .catch((error) => {
//       message.error("Something went wrong!");
//       return null;
//     });
//   return response;
// };

const postData = async (formData, urlLast = "", extraHeaders = {}) => {
  const url = basicUrl + urlLast;
  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        ...extraHeaders,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
    return response;
  } catch (error) {
    message.error("Something went wrong!");
    return null;
  }
};

// const putData = async (formData, urlLast = "", extraHeaders) => {
//   const url = basicUrl + urlLast;

//   const headers = {
//     "Content-Type": "multipart/form-data",
//     "x-api-key": "YunHu873jHds83hRujGJKd873",
//     "x-api-version": "5.43",
//     "x-platform": "Android",
//     "x-access-token": localStorage.getItem("sessionToken") || "",
//     ...extraHeaders,
//   };

//   const response = await axios
//     .put(url, formData, { headers })
//     .then((res) => {
//       if (res.data.success) {
//         message.success(res.data.message);
//       } else {
//         message.error(res.data.message);
//       }
//       return res;
//     })
//     .catch((error) => {
//       message.error("Something went wrong!");
//       return null;
//     });
//   return response;
// };

const putData = async (formData, urlLast = "", extraHeaders = {}) => {
  const url = basicUrl + urlLast;
  try {
    const response = await axiosInstance.put(url, formData, {
      headers: {
        ...extraHeaders,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
    return response;
  } catch (error) {
    message.error("Something went wrong!");
    return null;
  }
};

// const getData = async (urlLast, extraHeaders, params = "") => {
//   const url = basicUrl + urlLast + params;

//   const headers = {
//     "x-api-key": "YunHu873jHds83hRujGJKd873",
//     "x-api-version": "1.0.1",
//     "x-platform": "Web",
//     "x-access-token": localStorage.getItem("sessionToken") || "",
//     ...extraHeaders,
//   };

//   const res = await axios
//     .get(url, { headers })
//     .then((response) => {
//       response = response.data;
//       if (response.success) {
//         return response;
//       } else {
//         message.info(response.message);
//       }
//     })
//     .catch((error) => {
//       message.info("Something went wrong!");
//       return null;
//     });

//   return res;
// };

const getData = async (urlLast, extraHeaders = {}, params = "") => {
  const url = basicUrl + urlLast + params;
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        ...extraHeaders,
      },
    });
    const data = response.data;
    if (data.success) {
      return data;
    } else {
      message.info(data.message);
    }
  } catch (error) {
    message.info("Something went wrong!");
    return null;
  }
};

export { loginFetch, postData, getData, putData };
// export { loginFetch, logoutFetch, postData, getData, putData };
