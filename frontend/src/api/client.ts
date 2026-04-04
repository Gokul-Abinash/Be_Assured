import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

console.log("Base URL [2]: ", BASE_URL);

const client = axios.create({
  baseURL: (() => {
    const url = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
    console.log("Base URL [3]: ", url);
    return url;
  })(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export { BASE_URL };
export default client;
