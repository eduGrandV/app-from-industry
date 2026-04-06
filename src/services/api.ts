import axios from 'axios';


export const api = axios.create({
  baseURL: 'http://192.168.250.235:3333/api', 
});