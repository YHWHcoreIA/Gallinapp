
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white shadow-md rounded-xl overflow-hidden ${className}`}> {/* Reduced shadow from shadow-lg to shadow-md */}
      {(title || actions) && (
        <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center bg-pf-gray-ultralight"> {/* Added bg-pf-gray-ultralight */}
          {title && <h3 className="text-lg font-semibold text-pf-text">{title}</h3>}
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;