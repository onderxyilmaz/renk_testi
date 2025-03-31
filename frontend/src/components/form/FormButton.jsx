import React from 'react';

/**
 * Reusable button component for forms with consistent styling
 * 
 * @param {Object} props - Component properties
 * @param {string} props.type - Button type (submit, button, reset)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {string} props.variant - Button style variant (primary, secondary, success, danger)
 * @param {function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS classes
 * @param {ReactNode} props.children - Button content
 */
const FormButton = ({
  type = 'submit',
  disabled = false,
  fullWidth = false,
  variant = 'primary',
  onClick,
  className = '',
  children,
  ...rest
}) => {
  // Define variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        text-white py-2 px-4 rounded
        focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default FormButton;
