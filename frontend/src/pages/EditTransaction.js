"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const EditTransaction = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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
      const response = await axios.get(`/api/transactions/${id}`)
      const transaction = response.data

      setFormData({
        title: transaction.title || "",
        amount: transaction.amount?.toString() || "",
        date: transaction.date ? new Date(transaction.date).toISOString().split("T")[0] : "",
        category: transaction.category || "Other",
      })
      setError("")
    } catch (err) {
      setError("Failed to fetch transaction. Please try again.")
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
      const transactionData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
      }

      await axios.put(`/api/transactions/${id}`, transactionData)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update transaction. Please try again.")
      console.error("Error updating transaction:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading transaction...</div>
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
