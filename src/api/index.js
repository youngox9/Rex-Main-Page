import axios  from 'axios';

const baseURL = 'http://rextest-c731.restdb.io/rest';
const API_TOKEN = 'ba9932b9b1892808871b6bcc5da9d6357953d';

const instance = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'x-apikey': API_TOKEN,
  }
});

export const getGalleryData = () => instance.get('/data');

export default {};
