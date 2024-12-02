import { message } from "antd";
import axios from "axios";
import { Navigate } from "react-router";

const baseUrl = "https://kumbhtsmonitoring.in/php-api";

const loginFetch = async (data, setCanProceed) => {
  const url = baseUrl + "/login";

  const headers = {
    "Content-Type": "multipart/form-data",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.data.success) {
      const sessionData = response.data.data.sessionData[0];
      localStorage.setItem("sessionToken", response.data.sessionToken);
      localStorage.setItem("role", sessionData?.user_type); // Role
      localStorage.setItem("role_id", sessionData?.user_type_id); // User type id
      localStorage.setItem(
        "sessionData",
        JSON.stringify(response.data.data.sessionData[0])
      );
      localStorage.setItem("userId", sessionData.id);
      localStorage.setItem("ImageUrl", sessionData?.s3path);
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

const logoutFetch = async () => {
  try {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      const response = await axios.delete(baseUrl + "/logout", {
        headers: {
          "x-api-key": "YunHu873jHds83hRujGJKd873",
          "x-api-version": "1.0.1",
          "x-platform": "Web",
          "x-access-token": sessionToken,
        },
      });
      if (response.status === 200) {
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("sessionData");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

const postData = async (formData, urlLast = "", extraHeaders) => {
  const url = baseUrl + urlLast;

  const headers = {
    "Content-Type": "multipart/form-data",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "5.43",
    "x-platform": "Android",
    "x-access-token": localStorage.getItem("sessionToken") || "",
    ...extraHeaders,
  };

  const response = await axios
    .post(url, formData, { headers })
    .then((res) => {
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
      return res;
    })
    .catch((error) => {
      message.error("Something went wrong!");
      return null;
    });
  return response;
};

const putData = async (formData, urlLast = "", extraHeaders) => {
  const url = baseUrl + urlLast;

  const headers = {
    "Content-Type": "multipart/form-data",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "5.43",
    "x-platform": "Android",
    "x-access-token": localStorage.getItem("sessionToken") || "",
    ...extraHeaders,
  };

  const response = await axios
    .put(url, formData, { headers })
    .then((res) => {
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
      return res;
    })
    .catch((error) => {
      message.error("Something went wrong!");
      return null;
    });
  return response;
};

const getData = async (urlLast, extraHeaders, params = "") => {
  const url = baseUrl + urlLast + params;

  const headers = {
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
    ...extraHeaders,
  };

  const res = await axios
    .get(url, { headers })
    .then((response) => {
      response = response.data;
      if (response.success) {
        return response;
      } else {
        message.info(response.message);
      }
    })
    .catch((error) => {
      message.info("Something went wrong!");
      return null;
    });

  return res;
};

export { loginFetch, logoutFetch, postData, getData, putData };
