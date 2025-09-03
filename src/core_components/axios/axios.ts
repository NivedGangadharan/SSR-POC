import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: "https://asos2.p.rapidapi.com"
});

AxiosInstance.interceptors.request.use(
    (config) => {
        if (config.headers) {
            config.headers['x-rapidapi-key'] = 'a561ccf13cmshf150c159d79fb3cp1a9bbejsne0e2cfb4eca4';
            config.headers['x-rapidapi-host'] = 'asos2.p.rapidapi.com';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);