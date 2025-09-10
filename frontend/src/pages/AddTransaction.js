"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { transactionAPI } from "../services/api"
import { useToast } from "../components/Toast"
import { useAPICall } from "../hooks/useAPI"

const AddTransaction = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const { loading, error, execute } = useAPICall()

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Other",
  })
  const [validationErrors, setValidationErrors] = useState({})

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

  const validateForm = () => {
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    } else if (formData.title.length > 100) {
      errors.title = "Title cannot exceed 100 characters"
    }

    if (!formData.amount) {
      errors.amount = "Amount is required"
    } else if (Number.parseFloat(formData.amount) === 0) {
      errors.amount = "Amount cannot be zero"
    } else if (isNaN(Number.parseFloat(formData.amount))) {
      errors.amount = "Amount must be a valid number"
    }

    if (!formData.date) {
      errors.date = "Date is required"
    }

    if (!formData.category) {
      errors.category = "Category is required"
    }

    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      showError("Please fix the validation errors")
      return
    }

    try {
      const transactionData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
      }

      await execute(transactionAPI.create, transactionData)
      success("Transaction added successfully!")
      navigate("/")
    } catch (err) {
      // Handle server validation errors
      if (err.response?.data?.errors) {
        const serverErrors = {}
        err.response.data.errors.forEach((error) => {
          serverErrors[error.path || error.param] = error.msg
        })
        setValidationErrors(serverErrors)
      }

      showError(error || "Failed to add transaction")
      console.error("Error adding transaction:", err)
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: "24px" }}>Add New Transaction</h2>

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
            className={`form-input ${validationErrors.title ? "error-input" : ""}`}
            required
            placeholder="Enter transaction title"
          />
          {validationErrors.title && (
            <div style={{ color: "var(--destructive)", fontSize: "14px", marginTop: "4px" }}>
              {validationErrors.title}
            </div>
          )}
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
            className={`form-input ${validationErrors.amount ? "error-input" : ""}`}
            step="0.01"
            required
            placeholder="0.00"
          />
          {validationErrors.amount && (
            <div style={{ color: "var(--destructive)", fontSize: "14px", marginTop: "4px" }}>
              {validationErrors.amount}
            </div>
          )}
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
            className={`form-input ${validationErrors.date ? "error-input" : ""}`}
            required
          />
          {validationErrors.date && (
            <div style={{ color: "var(--destructive)", fontSize: "14px", marginTop: "4px" }}>
              {validationErrors.date}
            </div>
          )}
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
            className={`form-select ${validationErrors.category ? "error-input" : ""}`}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {validationErrors.category && (
            <div style={{ color: "var(--destructive)", fontSize: "14px", marginTop: "4px" }}>
              {validationErrors.category}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </button>
          <button type="button" onClick={() => navigate("/")} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTransaction
