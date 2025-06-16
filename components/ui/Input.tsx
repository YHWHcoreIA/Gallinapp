import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea';
  rows?: number; // Explicitly allow rows prop for textarea
}

const Input: React.FC<InputProps> = ({ label, id, error, className, as = 'input', ...props }) => {
  const commonClasses = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pf-green focus:border-pf-green ${error ? 'border-red-500' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-pf-text-secondary mb-1">{label}</label>}
      {as === 'textarea' ? (
        <textarea
          id={id}
          className={commonClasses}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} // Type assertion for textarea props
        />
      ) : (
        <input
          id={id}
          className={commonClasses}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)} // Type assertion for input props
        />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;