import React from 'react';

/**
 * Reusable form input component with consistent styling and behavior
 * 
 * @param {Object} props - Component properties
 * @param {string} props.id - Input id attribute
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.label - Label text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether input is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.autoFocus - Whether input should be auto-focused
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.error - Error message to display
 */
const FormInput = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  autoFocus = false,
  className = '',
  error = '',
  ...rest
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-gray-700 font-medium mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        {...rest}
      />
      
      {error && (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
