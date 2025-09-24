import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const http = axios.create({
	baseURL: API_BASE_URL,
});

http.interceptors.request.use((config) => {
	const token = localStorage.getItem('adminToken');
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			localStorage.removeItem('adminToken');
			try { window.location.assign('/log-in'); } catch (_) {}
		}
		return Promise.reject(error);
	}
);

export default http;



