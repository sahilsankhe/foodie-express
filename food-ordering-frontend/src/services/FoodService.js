import axios from 'axios';

// Direct Render Backend URL
const API_BASE_URL = "https://foodie-express-385k.onrender.com/api";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;