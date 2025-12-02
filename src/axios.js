import axios from "axios";  
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
    baseURL: `https://${import.meta.env.VITE_DOMAIN}/api`,
});

// Tambahkan Interceptor untuk Request
api.interceptors.request.use(
    (config) => {
    config.headers["X-Original-Target"] = window.location.pathname;
    return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.data && error.response.data.location) {
            const authStore = useAuthStore(); // ⬅ Panggil DI SINI saja, bukan di atas file
            authStore.logout();
            window.location = error.response.data.location;
        } else {
        return Promise.reject(error);
        }
    },
);

export default api;