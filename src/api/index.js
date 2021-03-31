import axios  from 'axios';

const DATABASE_URL = 'https://mainpage-1c62.restdb.io/rest/data';
const API_TOKEN = '005e404c56a25d2edc1adbd3aa32c248a09a5';

export const getGalleryData = axios({
  url: DATABASE_URL,
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    'x-apikey': API_TOKEN,
  }
});

export default {};
