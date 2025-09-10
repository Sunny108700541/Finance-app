"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { transactionAPI } from "../services/api"
import { useToast } from "../components/Toast"
import LoadingSpinner from "../components/LoadingSpinner"

const EditTransaction = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    category: "Other",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Education",
    "Income",
    "Investment",
    "Other",
  ]

  useEffect(() => {
    fetchTransaction()
  }, [id])

  const fetchTransaction = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await transactionAPI.getById(id)
      const transaction = response.data

      if (!transaction) {
        throw new Error("Transaction not found")
      }

      setFormData({
        title: transaction.title || "",
        amount: transaction.amount !== undefined && transaction.amount !== null ? transaction.amount.toString() : "",
        date: transaction.date ? new Date(transaction.date).toISOString().split("T")[0] : "",
        category: transaction.category || "Other",
      })
    } catch (err) {
      const errorMessage = err.userMessage || "Failed to fetch transaction. Please try again."
      setError(errorMessage)
      showError(errorMessage)
      console.error("Error fetching transaction:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!formData.amount || isNaN(Number.parseFloat(formData.amount))) {
        throw new Error("Valid amount is required")
      }
      if (!formData.date) {
        throw new Error("Date is required")
      }

      const transactionData = {
        ...formData,
        title: formData.title.trim(),
        amount: Number.parseFloat(formData.amount),
      }

      await transactionAPI.update(id, transactionData)
      success("Transaction updated successfully!")
      navigate("/")
    } catch (err) {
      const errorMessage = err.userMessage || err.message || "Failed to update transaction. Please try again."
      setError(errorMessage)
      showError(errorMessage)
      console.error("Error updating transaction:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="large" text="Loading transaction..." />
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: "24px" }}>Edit Transaction</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Enter transaction title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount (Use negative for expenses, positive for income)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            step="0.01"
            required
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => navigate("/")} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTransaction
