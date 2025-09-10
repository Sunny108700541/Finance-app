"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import ConfirmDialog from "../components/ConfirmDialog"
import LoadingSpinner from "../components/LoadingSpinner"

const DeleteTransaction = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    fetchTransaction()
  }, [id])

  const fetchTransaction = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/transactions/${id}`)
      setTransaction(response.data)
      setError("")
      setShowConfirmDialog(true)
    } catch (err) {
      setError("Failed to fetch transaction. Please try again.")
      console.error("Error fetching transaction:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    await axios.delete(`/api/transactions/${id}`)
    navigate("/")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return <LoadingSpinner size="large" text="Loading transaction..." />
  }

  if (!transaction) {
    return (
      <div className="card">
        <div className="error">Transaction not found.</div>
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: "24px", color: "var(--destructive)" }}>Delete Transaction</h2>

      {error && <div className="error">{error}</div>}

      <div
        style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "var(--radius)",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "var(--radius)" }}>
          <h3 style={{ marginBottom: "12px" }}>{transaction.title}</h3>
          <p>
            <strong>Amount:</strong>
            <span
              className={transaction.amount >= 0 ? "amount positive" : "amount negative"}
              style={{ marginLeft: "8px" }}
            >
              {transaction.amount >= 0 ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
          </p>
          <p>
            <strong>Date:</strong> {formatDate(transaction.date)}
          </p>
          <p>
            <strong>Category:</strong> {transaction.category}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={() => setShowConfirmDialog(true)} className="btn btn-destructive">
          Delete Transaction
        </button>
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false)
          navigate("/")
        }}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transaction.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="destructive"
      />
    </div>
  )
}

export default DeleteTransaction
