import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: string;
  speed?: number;
  className?: string;
  textClassName?: string;
  reverse?: boolean;
  fadeIn?: boolean;
  id?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  backgroundImage,
  backgroundOverlay = true,
  overlayColor = 'black',
  overlayOpacity = 0.3,
  height = 'min-h-[600px]',
  speed = 0.5,
  className = '',
  textClassName = 'text-white relative z-20',
  reverse = false,
  fadeIn = true,
  id,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Check if we're running on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only enable scroll effects on client-side
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Apply parallax effect to background
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, reverse ? 200 * speed : -200 * speed]
  );

  // Apply opacity effect
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    fadeIn ? [0, 1, 1, 0] : [1, 1, 1, 1]
  );

  // Handle overlapping for multiple parallax sections
  useEffect(() => {
    if (isMounted && sectionRef.current) {
      sectionRef.current.style.position = 'relative';
      sectionRef.current.style.zIndex = '1';
    }
  }, [isMounted]);

  return (
    <div
      id={id}
      ref={sectionRef}
      className={`relative overflow-hidden ${height} ${className}`}
    >
      {/* Parallax Background */}
      {backgroundImage && (
        <motion.div
          style={isMounted ? { y, backgroundImage: `url(${backgroundImage})` } : { backgroundImage: `url(${backgroundImage})` }}
          className="absolute inset-0 bg-cover bg-center w-full h-[120%] -z-10"
        />
      )}

      {/* Background Overlay */}
      {backgroundOverlay && (
        <div 
          className={`absolute inset-0 bg-${overlayColor}`}
          style={{ opacity: overlayOpacity, zIndex: -5 }}
        />
      )}

      {/* Content with fade effect */}
      <motion.div 
        style={isMounted ? { opacity } : undefined}
        className={`w-full h-full flex flex-col items-center justify-center p-8 ${textClassName}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection; 