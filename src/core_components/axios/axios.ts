import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: "https://asos2.p.rapidapi.com"
});

AxiosInstance.interceptors.request.use(
    (config) => {
        if (config.headers) {
            config.headers['x-rapidapi-key'] = 'd97628bf7bmshd794cb3a2bdd1d0p107c8bjsn39a8f1bfc2f2';
            config.headers['x-rapidapi-host'] = 'asos2.p.rapidapi.com';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);