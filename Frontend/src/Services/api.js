import axios from "axios";

// Create axios instance for API requests
const api = axios.create({
  baseURL: "http://localhost:4008/api", // Backend API URL
  withCredentials: true,  // Ensure cookies (like refresh tokens) are sent with every request
});

// Request interceptor to attach token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");  // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Attach token to headers for authorization
    }
    return config;
  },
  (error) => Promise.reject(error)  // Handle error in request
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,  // If response is successful, return it
  async (error) => {
    if (error.response && error.response.status === 401) {  // If token expired (401 Unauthorized)
      console.warn("🔄 Token Expired, Trying to Refresh...");

      try {
        // Attempt to refresh the token using the refresh token stored in cookies
        const refreshResponse = await axios.post(
          "http://localhost:4008/api/users/auth/refresh",
          {},
          { withCredentials: true } // Ensure cookies are sent with the request
        );

        if (refreshResponse.data.accessToken) {
          // If the refresh token was successful, update the token in localStorage
          localStorage.setItem("token", refreshResponse.data.accessToken);
          console.log("✅ Token Refreshed Successfully!");

          // Retry the original failed request with the new access token
          error.config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return axios(error.config);  // Retry the original request
        } else {
          throw new Error("Failed to refresh token.");
        }
      } catch (refreshError) {
        console.error("❌ Refresh Token Failed. Logging out...");
        localStorage.removeItem("token");  // Remove expired token from localStorage
        window.location.href = "/";  // Redirect to login page if refresh fails
      }
    }

    // If the error is not a token expiration error, reject the promise
    return Promise.reject(error);  // Return the error if it's not handled (401, 500, etc.)
  }
);

export default api;  // Export axios instance for use in other parts of the app
