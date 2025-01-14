// api.js
import axios from "axios";

// export const basicUrl = "http://13.233.221.142/php-api/index.php"; //ip address production
export const basicUrl = "https://kumbhtsmonitoring.in/php-api/index.php"; // domain production

// headers: {
//   "Content-Type": "multipart/form-data",
// },

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: basicUrl,
  //   timeout: 10000, // Timeout for requests
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  },
});

export const loginAxiosInstance = axios.create({
  baseURL: basicUrl,
  //   timeout: 10000, // Timeout for requests
  headers: {
    "Content-Type": "application/json",
    "x-platform": "Web",
  },
});

export default axiosInstance;
