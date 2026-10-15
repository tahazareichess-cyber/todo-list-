import axios from 'axios';

const api = axios.create({
    baseURL: "https://todoapp.ideallteam.com",
});

export default api;