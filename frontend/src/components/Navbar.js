import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-nav">
          <Link to="/" className="navbar-brand">
            Personal Finance Tracker
          </Link>
          <Link to="/" className={`navbar-link ${isActive("/")}`}>
            Dashboard
          </Link>
          <Link to="/add" className={`navbar-link ${isActive("/add")}`}>
            Add Transaction
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
