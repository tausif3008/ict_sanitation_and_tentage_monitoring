// api.js
import axios from "axios";

<<<<<<< HEAD
// export const basicUrl = "https://13.201.196.2/php-api/index.php";
export const basicUrl = "https://kumbhtsmonitoring.in/php-api/index.php";
=======
export const basicUrl = "https://13.201.196.2/php-api/index.php";
// export const basicUrl = "https://kumbhtsmonitoring.in/php-api/index.php"; // testing
>>>>>>> 64b1175990ff4b65e399f7f024a6eca6242d1e6d

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

export default axiosInstance;
