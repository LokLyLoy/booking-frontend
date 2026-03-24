import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:5000/api";

export const login = async (username, password) => {
    try {
        const res = await axios.post(`${API_URL}/login`, { username, password });
        const { access_token } = res.data;

        // Store token in cookie (expires in 7 days)
        Cookies.set("access_token", access_token, { expires: 7 });

        return true;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        return false;
    }
};

export const logout = () => {
    Cookies.remove("access_token");
};

export const getToken = () => {
    return Cookies.get("access_token");
};

// Optional: Axios instance with auth header
export const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

authAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});