import axios from "axios";

const API = axios.create({
  baseURL: "https://tiny-url-k401.onrender.com", 
});

export default API;
