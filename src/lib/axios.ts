import axios from "axios";

import { HIDDIFY_API_KEY } from "../config/server";

// Hiddify
export const axiosHiddify = axios.create({
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "Hiddify-API-Key": HIDDIFY_API_KEY,
  },
  timeout: 5000,
});

// Regular fetch
export const axiosFetch = axios.create({
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  timeout: 10000,
});
