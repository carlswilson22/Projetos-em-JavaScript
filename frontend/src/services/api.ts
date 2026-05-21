import axios from 'axios';

const api = axios.create({
    // Aqui ele puxa automaticamente a URL que colocamos no .env
    baseURL: import.meta.env.VITE_API_URL, 
});

// Este "Intermediário" pega o Token do navegador e anexa em TODAS as requisições automaticamente!
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
