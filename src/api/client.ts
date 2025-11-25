import axios from "axios";
import { BACKEND_URL } from "../config";

export const client = axios.create({
  baseURL: BACKEND_URL,
});
