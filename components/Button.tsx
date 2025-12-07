
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  themeColor?: string; // e.g., 'bg-nb-amber'
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  themeColor = 'bg-nb-white',
  ...props 
}) => {
  
  // Refined style: border-2, rounded-md
  // Use border-nb-black which now maps to var(--color-border) which is light in dark mode
  const baseClasses = "font-sans font-bold border-2 border-nb-black rounded-md transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-nb-active disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary usually uses the theme color (light accent). Text on light accent should be black (inverse).
    primary: `${themeColor} text-nb-inverse shadow-nb hover:-translate-y-0.5 hover:translate-x-0.5`,
    // Secondary uses card bg (dark). Text should be main text (light).
    secondary: "bg-nb-white text-nb-text shadow-nb hover:brightness-110",
    danger: "bg-nb-rose text-nb-inverse shadow-nb hover:bg-red-400",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-white/10 text-nb-text"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
