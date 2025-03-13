import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  blurStrength?: string;
  bgOpacity?: string;
  borderColor?: string;
  shadowSize?: 'sm' | 'md' | 'lg' | 'none';
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'zoomOut' | 'none';
  delay?: number;
  onClick?: () => void;
  id?: string;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  blurStrength = 'backdrop-blur-lg',
  bgOpacity = 'bg-white/30',
  borderColor = 'border border-white/20',
  shadowSize = 'md',
  animation = 'none',
  delay = 0,
  onClick,
  id,
}) => {
  // Define shadow class based on size
  const getShadowClass = () => {
    switch (shadowSize) {
      case 'sm':
        return 'shadow-glass-sm';
      case 'md':
        return 'shadow-glass';
      case 'lg':
        return 'shadow-xl';
      case 'none':
        return '';
      default:
        return 'shadow-glass';
    }
  };

  // Define animation variants
  const getVariants = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration: 0.5, delay } 
          }
        };
      case 'fadeInUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, delay } 
          }
        };
      case 'fadeInDown':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, delay } 
          }
        };
      case 'fadeInLeft':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5, delay } 
          }
        };
      case 'fadeInRight':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5, delay } 
          }
        };
      case 'zoomIn':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5, delay } 
          }
        };
      case 'zoomOut':
        return {
          hidden: { opacity: 0, scale: 1.2 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5, delay } 
          }
        };
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 }
        };
    }
  };

  // Define hover effects
  const hoverClass = hoverEffect 
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/40' 
    : '';

  return (
    <motion.div
      id={id}
      className={`rounded-xl ${blurStrength} ${bgOpacity} ${borderColor} ${getShadowClass()} ${hoverClass} ${className}`}
      variants={getVariants()}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      whileHover={hoverEffect ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default GlassmorphicCard; 