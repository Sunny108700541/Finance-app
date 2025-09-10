"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { transactionAPI } from "../services/api"
import { useToast } from "../components/Toast"
import LoadingSpinner from "../components/LoadingSpinner"

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    count: 0,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasPrevPage: false,
    hasNextPage: false,
  })
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { success, error: showError } = useToast()

  useEffect(() => {
    fetchTransactions()
  }, [pagination.currentPage, filters])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError("")

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      }

      const response = await transactionAPI.getAll(params)
      setTransactions(response.data.transactions)
      setSummary(response.data.summary)
      setPagination((prev) => ({
        ...prev,
        ...response.data.pagination,
      }))
    } catch (err) {
      const errorMessage = err.userMessage || "Failed to fetch transactions. Please try again."
      setError(errorMessage)
      showError(errorMessage)
      console.error("Error fetching transactions:", err)
    } finally {
      setLoading(false)
    }
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
      month: "short",
      day: "numeric",
    })
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      type: "",
      startDate: "",
      endDate: "",
    })
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
    success("Filters cleared")
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }))
  }

  if (loading) {
    return <LoadingSpinner size="large" text="Loading transactions..." />
  }

  return (
    <div>
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Income</h3>
          <div className="amount positive">{formatCurrency(summary.totalIncome)}</div>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <div className="amount negative">{formatCurrency(summary.totalExpenses)}</div>
        </div>
        <div className="summary-card">
          <h3>Balance</h3>
          <div className={`amount ${summary.balance >= 0 ? "positive" : "negative"}`}>
            {formatCurrency(summary.balance)}
          </div>
        </div>
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <div className="amount neutral">{summary.count}</div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Recent Transactions</h2>
          <Link to="/add" className="btn btn-primary">
            Add Transaction
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
            padding: "20px",
            backgroundColor: "var(--muted)",
            borderRadius: "var(--radius)",
          }}
        >
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Income">Income</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="form-select"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="form-label">From Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">To Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: "flex", alignItems: "end" }}>
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "40px" }}>
            {Object.values(filters).some((v) => v) ? "No transactions match your filters." : "No transactions found."}
            <Link to="/add"> Add your first transaction</Link>
          </p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.title}</td>
                    <td>{transaction.category}</td>
                    <td>
                      <span className={transaction.amount >= 0 ? "amount positive" : "amount negative"}>
                        {transaction.amount >= 0 ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td>
                      <div className="transaction-actions">
                        <Link to={`/${transaction._id}/edit`} className="btn btn-secondary">
                          Edit
                        </Link>
                        <Link to={`/${transaction._id}/delete`} className="btn btn-destructive">
                          Delete
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "24px",
                  padding: "16px 0",
                }}
              >
                <div style={{ color: "var(--muted-foreground)" }}>
                  Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                  {pagination.totalItems} transactions
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="btn btn-secondary"
                    style={{
                      opacity: pagination.hasPrevPage ? 1 : 0.5,
                      cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
                    }}
                  >
                    Previous
                  </button>

                  <span
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "var(--muted)",
                      borderRadius: "var(--radius)",
                      color: "var(--foreground)",
                    }}
                  >
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn btn-secondary"
                    style={{
                      opacity: pagination.hasNextPage ? 1 : 0.5,
                      cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
