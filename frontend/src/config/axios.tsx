import { environment } from "@/config";
import axios from "axios";

export const api = axios.create({
  baseURL: environment.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
