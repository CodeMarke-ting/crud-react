import axios from "axios";

export const BASE_URL = "https://northwind.vercel.app/api/suppliers";

export const instance = axios.create({
  baseURL: BASE_URL,
});
