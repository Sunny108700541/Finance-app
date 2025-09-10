"use client"

import { useState, useEffect } from "react"

let toastId = 0

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast, onRemove])

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        <div className="toast-message">{toast.message}</div>
        <button onClick={() => onRemove(toast.id)} className="toast-close" aria-label="Close notification">
          ×
        </button>
      </div>
    </div>
  )
}

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

export { ToastContainer }

// Toast hook for easy usage
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "info", duration = 5000) => {
    const id = ++toastId
    const toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    return id
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message, duration) => addToast(message, "success", duration)
  const error = (message, duration) => addToast(message, "error", duration)
  const info = (message, duration) => addToast(message, "info", duration)
  const warning = (message, duration) => addToast(message, "warning", duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}
