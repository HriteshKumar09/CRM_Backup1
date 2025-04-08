import axios from "axios";

// Create axios instance for API requests
const api = axios.create({
  baseURL: "http://localhost:4008/api", // Backend API URL
  withCredentials: true,  // Ensure cookies (like refresh tokens) are sent with every request
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to attach token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is not 401 or it's already been retried, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If token refresh is in progress, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.warn("🔄 Token Expired, Trying to Refresh...");
      const refreshResponse = await axios.post(
        "http://localhost:4008/api/users/auth/refresh",
        {},
        { withCredentials: true }
      );

      const { accessToken } = refreshResponse.data;
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log("✅ Token Refreshed Successfully!");
        
        processQueue(null, accessToken);
        return axios(originalRequest);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      console.error("❌ Refresh Token Failed. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
