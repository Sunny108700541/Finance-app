"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import AddTransaction from "./pages/AddTransaction"
import EditTransaction from "./pages/EditTransaction"
import DeleteTransaction from "./pages/DeleteTransaction"
import { useToast, ToastContainer } from "./components/Toast"

function App() {
  const { toasts, removeToast } = useToast()

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/:id/edit" element={<EditTransaction />} />
            <Route path="/:id/delete" element={<DeleteTransaction />} />
          </Routes>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </Router>
  )
}

export default App
