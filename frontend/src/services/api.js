import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://finance-app-09nf.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding common headers and logging
api.interceptors.request.use(
  (config) => {
    // Add timestamp to requests for debugging
    config.metadata = { startTime: new Date() }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor for handling common responses and errors
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime

    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`)
    }

    return response
  },
  (error) => {
    // Calculate request duration for failed requests
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(`❌ API Error: ${error.response?.status || "Network"} ${error.config?.url} (${duration}ms)`)
    }

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 400:
          error.userMessage = data.message || "Invalid request. Please check your input."
          break
        case 401:
          error.userMessage = "Authentication required. Please log in."
          break
        case 403:
          error.userMessage = "Access denied. You don't have permission for this action."
          break
        case 404:
          error.userMessage = "The requested resource was not found."
          break
        case 422:
          error.userMessage = "Validation failed. Please check your input."
          break
        case 500:
          error.userMessage = "Server error. Please try again later."
          break
        default:
          error.userMessage = data.message || "An unexpected error occurred."
      }
    } else if (error.request) {
      // Network error
      error.userMessage = "Network error. Please check your connection and try again."
    } else {
      // Other error
      error.userMessage = "An unexpected error occurred. Please try again."
    }

    return Promise.reject(error)
  },
)

// API service methods
export const transactionAPI = {
  // Get all transactions with optional filters
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value)
      }
    })

    const queryString = queryParams.toString()
    const url = `/api/transactions${queryString ? `?${queryString}` : ""}`

    return api.get(url)
  },

  // Get single transaction by ID
  getById: (id) => {
    return api.get(`/api/transactions/${id}`)
  },

  // Create new transaction
  create: (data) => {
    return api.post("/api/transactions", data)
  },

  // Update existing transaction
  update: (id, data) => {
    return api.put(`/api/transactions/${id}`, data)
  },

  // Delete transaction
  delete: (id) => {
    return api.delete(`/api/transactions/${id}`)
  },
}

// Health check endpoint
export const healthAPI = {
  check: () => api.get("/api/health"),
}

// Export the configured axios instance for custom requests
export default api
