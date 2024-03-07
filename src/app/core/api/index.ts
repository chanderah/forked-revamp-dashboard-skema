import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.skema.co.id/api',
  timeout: 1000,
});

export default instance;
