"use client"

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  options = [],
  ...props
}) => {
  const inputId = `field-${name}`

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-select ${error ? "error-input" : ""}`}
            required={required}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case "textarea":
        return (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-textarea ${error ? "error-input" : ""}`}
            placeholder={placeholder}
            required={required}
            rows={4}
            {...props}
          />
        )
      default:
        return (
          <input
            type={type}
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-input ${error ? "error-input" : ""}`}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        )
    }
  }

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      {renderInput()}
      {error && <div className="form-error">{error}</div>}
    </div>
  )
}

export default FormField
