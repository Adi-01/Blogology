import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

export default axiosInstance;
//replace the base URL with your self created api 😇
