"use client"

import { useState, useEffect, useCallback } from "react"

// Custom hook for API calls with loading, error, and data state management
export const useAPI = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall(...args)
      setData(response.data)
      return response.data
    } catch (err) {
      setError(err.userMessage || err.message || "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  const refetch = useCallback(() => execute(), [execute])

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  }
}

// Custom hook for manual API calls (doesn't auto-execute)
export const useAPICall = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall, ...args) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall(...args)
      return response.data
    } catch (err) {
      setError(err.userMessage || err.message || "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return {
    loading,
    error,
    execute,
    reset,
  }
}
