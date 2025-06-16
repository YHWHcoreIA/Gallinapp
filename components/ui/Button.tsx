
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  leftIcon,
  rightIcon,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 ease-in-out inline-flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-pf-green hover:bg-pf-green-dark text-white focus:ring-pf-green-dark',
    secondary: 'bg-pf-brown hover:bg-pf-brown-dark text-white focus:ring-pf-brown-dark',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-pf-text focus:ring-pf-green border border-gray-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
