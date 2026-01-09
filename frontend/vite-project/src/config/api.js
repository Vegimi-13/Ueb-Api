import axios from "axios";

const AUTH_SERVICE_URL = "http://localhost:4001";
const JOB_SERVICE_URL = "http://localhost:4002";
const APP_SERVICE_URL = "http://localhost:4003";

// Function to create API instance with auth interceptors
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// Create separate instances for each service
const api = createApiInstance(AUTH_SERVICE_URL);
const jobApi = createApiInstance(JOB_SERVICE_URL);
const appApi = createApiInstance(APP_SERVICE_URL);

// Add response interceptor for token refresh (shared logic)
const addRefreshInterceptor = (instance, baseURL) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const response = await axios.post(`${AUTH_SERVICE_URL}/auth/refresh`, {
              refreshToken,
            });
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

addRefreshInterceptor(api, AUTH_SERVICE_URL);
addRefreshInterceptor(jobApi, JOB_SERVICE_URL);
addRefreshInterceptor(appApi, APP_SERVICE_URL);

// Default export for backward compatibility
const API_BASE_URL = AUTH_SERVICE_URL;

export default api;
export { jobApi, appApi, API_BASE_URL };
