"use client";

import axios from "axios";
import { eventBus } from "@/lib/auth";
import { obtenerToken } from "../auth";

class ApiClient {
  constructor({
    baseURL = "",
    timeout = 10000,
    getToken = () => null,
    onError = (error) => {
      throw error;
    },
  } = {}) {
    this.api = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.getToken = getToken;
    this.onError = onError;

    // Interceptor de requests: agrega token y emite evento
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          eventBus.emit("token-changed", token); // Evento de token cambiado
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de responses: maneja errores globales
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        this.onError(error);
        eventBus.emit("api-error", error); // Evento de error
        if (error.response?.status === 401) {
          eventBus.emit("logout"); // Evento de logout si token inválido
        }
        return Promise.reject(error);
      }
    );
  }

  setTokenGetter(fn) {
    this.getToken = fn;
    eventBus.emit("token-updated"); // Emitir cuando cambia el getter del token
  }

  async get(url, config = {}) {
    return this.api.get(url, config).then((res) => res.data);
  }

  async post(url, data, config = {}) {
    return this.api.post(url, data, config).then((res) => res.data);
  }

  async put(url, data, config = {}) {
    return this.api.put(url, data, config).then((res) => res.data);
  }

  async delete(url, config = {}) {
    return this.api.delete(url, config).then((res) => res.data);
  }
}

const defaultApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  getToken: () => {
    if (typeof window !== "undefined") {
      return obtenerToken();
    }
    return null;
  },
  onError: (error) => {
    console.error("API Error:", error.response?.data || error.message);
  },
});

export default defaultApiClient;
export { ApiClient };
