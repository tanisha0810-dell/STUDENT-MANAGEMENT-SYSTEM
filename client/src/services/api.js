// client/src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// helper to set token for all requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("sms_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("sms_token");
  }
};

// if token exists in localStorage on app start, set it
const saved = localStorage.getItem("sms_token");
if (saved) setAuthToken(saved);

export default api;
