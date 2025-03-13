import React, { useEffect, useState } from 'react';
import motion, { Variants } from '../utils/motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  type?: 'words' | 'chars' | 'lines';
  animation?: 'fadeIn' | 'fadeInUp' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'typewriter' | 'wave';
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  once?: boolean;
  id?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  type = 'words',
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.04,
  tag = 'p',
  once = true,
  id,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Variants for the container
  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay * i,
      },
    }),
  };

  // Get animation variants based on selected animation type
  const getAnimationVariants = (): Variants => {
    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
            },
          },
        };
      case 'fadeInUp':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
            },
          },
        };
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
            },
          },
        };
      case 'slideDown':
        return {
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
            },
          },
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 20 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
            },
          },
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
            },
          },
        };
      case 'typewriter':
        return {
          hidden: { opacity: 0, width: 0 },
          visible: {
            opacity: 1,
            width: '100%',
            transition: {
              duration: duration * 2,
            },
          },
        };
      case 'wave':
        return {
          hidden: { opacity: 0, y: 0 },
          visible: (i: number) => ({
            opacity: 1,
            y: [0, -12, 0],
            transition: {
              delay: i * staggerChildren,
              duration: duration * 1.2,
            },
          }),
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
            },
          },
        };
    }
  };

  // Split text into chunks based on type
  const getTextChunks = () => {
    if (!mounted) return [text];
    
    if (type === 'chars') {
      return text.split('');
    }
    if (type === 'words') {
      return text.split(' ');
    }
    if (type === 'lines') {
      return text.split('\n');
    }
    return [text];
  };

  const textChunks = getTextChunks();
  const variants = getAnimationVariants();

  // Render the component with the appropriate tag
  const renderContent = () => {
    // Return just the text on server-side to avoid hydration issues
    if (!mounted) {
      return text;
    }

    if (type === 'chars') {
      return (
        <motion.span
          id={id}
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          className={`inline-block ${className}`}
          aria-label={text}
        >
          {textChunks.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              variants={variants}
              custom={index}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      );
    }

    if (type === 'words') {
      return (
        <motion.span
          id={id}
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          className={`inline-block ${className}`}
          aria-label={text}
        >
          {textChunks.map((word, index) => (
            <React.Fragment key={`${word}-${index}`}>
              <motion.span
                variants={variants}
                custom={index}
                className="inline-block"
              >
                {word}
              </motion.span>
              {index !== textChunks.length - 1 && '\u00A0'}
            </React.Fragment>
          ))}
        </motion.span>
      );
    }

    if (type === 'lines') {
      return (
        <motion.div
          id={id}
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          className={className}
          aria-label={text}
        >
          {textChunks.map((line, index) => (
            <motion.div key={`${line}-${index}`} variants={variants} custom={index}>
              {line}
            </motion.div>
          ))}
        </motion.div>
      );
    }

    // Default for single text animation
    return (
      <motion.span
        id={id}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={variants}
        className={className}
        aria-label={text}
      >
        {text}
      </motion.span>
    );
  };

  // Render with the specified HTML tag
  const Tag = tag as keyof JSX.IntrinsicElements;
  
  // Important change: if this is a 'p' tag and the type is 'lines', 
  // use a div instead to avoid invalid HTML nesting
  const SafeTag = (type === 'lines' && tag === 'p') ? 'div' as keyof JSX.IntrinsicElements : Tag;
  
  return <SafeTag className={className}>{renderContent()}</SafeTag>;
};

export default AnimatedText; 