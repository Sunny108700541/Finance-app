const LoadingSpinner = ({ size = "medium", text = "" }) => {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  }

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
