import React, { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import motion, { Variants } from '../utils/motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'zoomOut';
  threshold?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  staggerChildren?: number;
  id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  threshold = 0.1,
  delay = 0,
  duration = 0.5,
  once = true,
  staggerChildren = 0.1,
  id,
}) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  });

  // Define animation variants
  const getVariants = (): Variants => {
    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
      case 'fadeInUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
      case 'fadeInDown':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
      case 'fadeInLeft':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
      case 'fadeInRight':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
      case 'zoomIn':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
      case 'zoomOut':
        return {
          hidden: { opacity: 0, scale: 1.2 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              duration, 
              delay, 
              staggerChildren 
            }
          }
        };
    }
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      variants={getVariants()}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection; 