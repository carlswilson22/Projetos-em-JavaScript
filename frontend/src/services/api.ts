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

// Interceptor de resposta para redirecionar em caso de token expirado (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('@FinanceApp:user');
            
            // Só redireciona se já não estiver na página de login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
