import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class Api {
    public baseURL: string;
    private axiosInstance: AxiosInstance;
    private commonHeaders: Record<string, string> = {};

    constructor() {
        this.baseURL = typeof window !== 'undefined' 
            ? 'http://localhost:8000/api/v1'
            : 'https://ux-feedback-server-production.up.railway.app'; // Replace with prod API base url

        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add a request interceptor if needed
        this.axiosInstance.interceptors.request.use((config: any) => {
            // You can modify config here before the request is sent, add tokens etc.
            config.headers = { ...config.headers, ...this.commonHeaders };
            return config;
        }, error => {
            // Do something with request error
            return Promise.reject(error);
        });

        // Add a response interceptor
        this.axiosInstance.interceptors.response.use(response => {
            // Any status code within the range of 2xx cause this function to trigger
            return response;
        }, error => {
            // Any status codes outside the range of 2xx cause this function to trigger
            return Promise.reject(error);
        });
    }

    public getInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    public setHeader(key: string, value: string): void {
        this.commonHeaders[key] = value;
    }

    public removeHeader(key: string): void {
        delete this.commonHeaders[key];
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    public post<T, R>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
        return this.axiosInstance.post<R>(url, data, config);
    }

    public put<T, R>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
        return this.axiosInstance.put<R>(url, data, config);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }
}

const api = new Api();
export default api;