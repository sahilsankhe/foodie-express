import axios from 'axios';

// Render var deploy kelela live backend URL
const API_BASE_URL = "https://foodie-express-385k.onrender.com";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;