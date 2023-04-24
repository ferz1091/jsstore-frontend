import axios from 'axios';
import store from '../store';

export const BASE_URL = 'http://192.168.0.105:5000';

const instance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})
instance.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    try {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.config && !error.config._isRetry && localStorage.getItem('token')) {
            originalRequest._isRetry = true;
            const response = await axios.get(`${BASE_URL}/auth/refresh`, { withCredentials: true });
            const userData = await response.data;
            localStorage.setItem('token', userData.accessToken);
            return instance.request(originalRequest);
        }
        return Promise.reject(error);
    } catch (e) {
        if (localStorage.getItem('token')) {
            store.dispatch('logoutUser');
        }
    }
})

export default instance;
