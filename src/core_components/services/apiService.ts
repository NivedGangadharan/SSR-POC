import type { AxiosRequestConfig } from "axios";
import { AxiosInstance } from "@/core_components/axios/axios";

export async function apiGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await AxiosInstance.get<T>(url, config);
    return response.data;
}

export async function apiPost<T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await AxiosInstance.post<T>(url, body, config);
    return response.data;
}

export async function apiRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const response = await AxiosInstance.request<T>(config);
    return response.data;
}

export async function apiPut<T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await AxiosInstance.put<T>(url, body, config);
    return response.data;
}

export async function apiDelete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await AxiosInstance.delete<T>(url, config);
    return response.data;
}

const api = {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete,
    request: apiRequest,
};

export default api;
