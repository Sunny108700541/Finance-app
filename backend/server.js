const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const transactionRoutes = require("./routes/transactions")

const app = express()
const PORT = process.env.PORT || 5000


const corsOptions = {
  origin: ["https://finance-app-alpha-coral.vercel.app","http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  optionsSuccessStatus: 200
};



app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`${timestamp} - ${req.method} ${req.path}`)
  next()
})


mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/personal-finance-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))


app.use("/api/transactions", transactionRoutes)


app.get("/api/health", (req, res) => {
  res.json({
    message: "API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

app.use((err, req, res, next) => {
  console.error(`Error ${req.method} ${req.path}:`, err.stack)

  
  const message = process.env.NODE_ENV === "production" ? "Something went wrong!" : err.message

  res.status(err.status || 500).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  })
})


app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})
