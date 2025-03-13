import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  images: string[];
  showThumbs?: boolean;
  autoplay?: boolean;
  enableLightbox?: boolean;
  className?: string;
  aspectRatio?: string;
  height?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  showThumbs = true,
  autoplay = true,
  enableLightbox = true,
  className = '',
  aspectRatio = 'aspect-[16/9]',
  height = 'h-[500px]',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  
  // Handle client-side only mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Set up autoplay if enabled
    let interval: NodeJS.Timeout;
    if (autoplay && isMounted) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, images.length, isMounted]);
  
  // If no images or empty array, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`${height} ${aspectRatio} bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden shadow-lg`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Display loading state or placeholder when not mounted (server-side)
  if (!isMounted) {
    return (
      <div className={`${height} ${aspectRatio} bg-gray-100 flex items-center justify-center ${className} rounded-xl overflow-hidden shadow-lg`}>
        <div className="flex flex-col items-center">
          <div className="animate-pulse w-20 h-20 rounded-full bg-gray-300 mb-4"></div>
          <p className="text-gray-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Go to next or previous image
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  // Handle thumbnail click
  const goToImage = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className={`${className} relative`}>
      {/* Main image with animation */}
      <div className={`${height} overflow-hidden rounded-xl relative`}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0"
          >
            <img 
              src={images[currentIndex]} 
              alt={`Villa image ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            
            {/* Image overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows with improved styling */}
        <button 
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-3 transition-all shadow-lg hover:shadow-xl z-10 hover:scale-110"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-3 transition-all shadow-lg hover:shadow-xl z-10 hover:scale-110"
          aria-label="Next image"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Indicator dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all transform ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Thumbnails with improved styling */}
      {showThumbs && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => goToImage(index)}
              className={`h-20 rounded-lg overflow-hidden transition-all duration-300 shadow-md ${
                index === currentIndex 
                  ? 'ring-2 ring-primary-500 shadow-lg transform scale-105' 
                  : 'opacity-70 hover:opacity-100 hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 border-2 border-white"></div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel; 