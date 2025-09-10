"use client"

import { useState } from "react"

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
}) => {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Confirmation action failed:", error)
    } finally {
      setIsConfirming(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3 className={`dialog-title ${type === "destructive" ? "destructive" : ""}`}>{title}</h3>
        </div>

        <div className="dialog-body">
          <p>{message}</p>
        </div>

        <div className="dialog-footer">
          <button onClick={onClose} className="btn btn-secondary" disabled={isConfirming}>
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`btn ${type === "destructive" ? "btn-destructive" : "btn-primary"}`}
            disabled={isConfirming}
          >
            {isConfirming ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
