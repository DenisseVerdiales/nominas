import axios from 'axios';
import { URL_CONEXION, URL_API } from './constantes';

const axiosConfig = axios.create({
  baseURL: URL_CONEXION + URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosConfig;
