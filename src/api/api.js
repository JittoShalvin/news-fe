import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shinebe.onrender.com/api', // change if your backend runs on a different port or host
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
