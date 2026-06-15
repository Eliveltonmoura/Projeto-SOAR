import axios from 'axios';

export const TOKEN_KEY = 'soar_token';

// Em produção (ex: Vercel), o frontend é estático e não tem o proxy do Vite,
// então a URL completa do backend precisa vir de VITE_API_URL.
// Em desenvolvimento, '/api/v1' é redirecionado pelo proxy do vite.config.ts.
const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

// Instância única — se a URL mudar, muda só aqui
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Anexa o token JWT (quando existir) em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de erro global
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Erro inesperado. Tente novamente.';
    const texto = Array.isArray(msg)
      ? msg.join(', ')
      : typeof msg === 'string'
        ? msg
        : 'Erro inesperado. Tente novamente.';
    return Promise.reject(new Error(texto));
  },
);

export default api;
