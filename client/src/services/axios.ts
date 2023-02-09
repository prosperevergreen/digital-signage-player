import axios from 'axios';
import { SERVER_URL } from '../common/contants';

const appAxios = axios.create({ baseURL: SERVER_URL });

export default appAxios;
