import React from 'react';
import motion from '../utils/motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  loading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
  loading = false,
  href,
  target,
  rel,
}) => {
  // Base classes
  let baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 shadow-md hover:shadow-lg',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50',
    link: 'bg-transparent text-primary-600 hover:text-primary-800 hover:underline p-0 shadow-none',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled class
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`;
  
  // Motion variants
  const buttonVariants = {
    tap: { scale: disabled ? 1 : 0.97 },
    hover: { 
      scale: disabled ? 1 : 1.02,
      transition: { duration: 0.2 }
    }
  };
  
  // Loading spinner
  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  // Content with icon
  const Content = () => (
    <>
      {loading && <Spinner />}
      {icon && iconPosition === 'left' && !loading && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );
  
  // Handle link button
  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
        whileHover={!disabled ? buttonVariants.hover : undefined}
        whileTap={!disabled ? buttonVariants.tap : undefined}
        onClick={!disabled ? onClick : undefined}
      >
        <Content />
      </motion.a>
    );
  }
  
  // Return regular button
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? buttonVariants.hover : undefined}
      whileTap={!disabled ? buttonVariants.tap : undefined}
    >
      <Content />
    </motion.button>
  );
};

export default Button; 