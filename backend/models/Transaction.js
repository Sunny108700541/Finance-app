const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      validate: {
        validator: (v) => v !== 0,
        message: "Amount cannot be zero",
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
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
        ],
        message: "Category must be one of the predefined options",
      },
    },
    type: {
      type: String,
      enum: ["income", "expense"],
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for transaction type based on amount
transactionSchema.pre("save", function (next) {
  this.type = this.amount > 0 ? "income" : "expense"
  next()
})

module.exports = mongoose.model("Transaction", transactionSchema)
