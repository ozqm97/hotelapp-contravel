import axios from "axios";

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

    // Interceptor request: agregar token si existe
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor response: manejo global de errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        this.onError(error);
        return Promise.reject(error);
      }
    );
  }

  // Permite cambiar token dinámicamente en runtime (útil para login/logout)
  setTokenGetter(fn) {
    this.getToken = fn;
  }

  // Métodos HTTP genéricos:
  async get(url, config = {}) {
    return this.api.get(url, config).then((res) => res.data);
  }

  async post(url, data, config = {}) {
    console.log(url)
    console.log(data)
    return this.api.post(url, data, config).then((res) => res.data);
  }

  async put(url, data, config = {}) {
    return this.api.put(url, data, config).then((res) => res.data);
  }

  async delete(url, config = {}) {
    return this.api.delete(url, config).then((res) => res.data);
  }
}

// Instancia por defecto para exportar, configurada con env
const defaultApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },
  onError: (error) => {
    // Aquí puedes poner manejo global, logs o notificaciones
    console.error("API Error:", error.response?.data || error.message);
  },
});

export default defaultApiClient;
export { ApiClient };
