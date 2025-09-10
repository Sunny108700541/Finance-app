const express = require("express")
const { body, validationResult } = require("express-validator")
const Transaction = require("../models/Transaction")

const router = express.Router()

const validateTransaction = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => {
      if (value === 0) {
        throw new Error("Amount cannot be zero")
      }
      return true
    }),
  body("date").isISO8601().withMessage("Date must be a valid date"),
  body("category")
    .isIn([
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
    ])
    .withMessage("Invalid category"),
]

router.get("/", async (req, res) => {
  try {
    const {
      category,
      type,
      sortBy = "date",
      order = "desc",
      search,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 50,
    } = req.query

    const filter = {}
    if (category) filter.category = category
    if (type) filter.type = type

    if (search) {
      filter.title = { $regex: search, $options: "i" }
    }

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      filter.amount = {}
      if (minAmount !== undefined) filter.amount.$gte = Number.parseFloat(minAmount)
      if (maxAmount !== undefined) filter.amount.$lte = Number.parseFloat(maxAmount)
    }

    const sortOrder = order === "asc" ? 1 : -1
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder

    const pageNum = Math.max(1, Number.parseInt(page))
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
      Transaction.countDocuments(filter),
    ])

    const allMatchingTransactions = await Transaction.find(filter)
    const totalIncome = allMatchingTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = allMatchingTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const balance = totalIncome - totalExpenses

    res.json({
      transactions,
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        count: totalCount,
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message })
  }
})


router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }
    res.json(transaction)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid transaction ID" })
    }
    res.status(500).json({ message: "Error fetching transaction", error: error.message })
  }
})


router.post("/", validateTransaction, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation errors", errors: errors.array() })
    }

    const transaction = new Transaction(req.body)
    const savedTransaction = await transaction.save()
    res.status(201).json(savedTransaction)
  } catch (error) {
    res.status(400).json({ message: "Error creating transaction", error: error.message })
  }
})


router.put("/:id", validateTransaction, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation errors", errors: errors.array() })
    }

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.json(transaction)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid transaction ID" })
    }
    res.status(400).json({ message: "Error updating transaction", error: error.message })
  }
})

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id)
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }
    res.json({ message: "Transaction deleted successfully", transaction })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid transaction ID" })
    }
    res.status(500).json({ message: "Error deleting transaction", error: error.message })
  }
})

module.exports = router
