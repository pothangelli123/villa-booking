// Framer Motion
declare module 'framer-motion' {
  import * as React from 'react';

  export interface AnimationProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    style?: any;
    transformTemplate?: any;
    transformValues?: any;
    custom?: any;
    inherit?: boolean;
  }

  export interface MotionProps extends AnimationProps, React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
    onAnimationStart?: () => void;
    onAnimationComplete?: () => void;
    onUpdate?: (latest: any) => void;
    onHoverStart?: (e: MouseEvent) => void;
    onHoverEnd?: (e: MouseEvent) => void;
    onTap?: (e: MouseEvent) => void;
    onTapStart?: (e: MouseEvent) => void;
    onTapCancel?: (e: MouseEvent) => void;
    onDrag?: (e: MouseEvent, info: PanInfo) => void;
    onDragStart?: (e: MouseEvent, info: PanInfo) => void;
    onDragEnd?: (e: MouseEvent, info: PanInfo) => void;
    whileHover?: any;
    whileTap?: any;
    whileDrag?: any;
    whileFocus?: any;
    whileInView?: any;
  }

  export interface PanInfo {
    point: {
      x: number;
      y: number;
    };
    delta: {
      x: number;
      y: number;
    };
    offset: {
      x: number;
      y: number;
    };
    velocity: {
      x: number;
      y: number;
    };
  }

  export interface MotionValue<T = number> {
    get(): T;
    set(value: T): void;
    onChange(callback: (value: T) => void): () => void;
  }

  export function motion<
    P extends React.HTMLAttributes<HTMLElement> = React.HTMLAttributes<HTMLElement>
  >(
    component: React.ComponentType<P> | keyof JSX.IntrinsicElements
  ): React.ComponentType<MotionProps & P>;

  export const motion: {
    [K in keyof JSX.IntrinsicElements]: React.ComponentType<MotionProps & JSX.IntrinsicElements[K]>;
  };

  export function useScroll(): {
    scrollX: MotionValue<number>;
    scrollY: MotionValue<number>;
    scrollXProgress: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
  };

  export function useTransform<T>(
    value: MotionValue<number>,
    inputRange: number[],
    outputRange: T[],
    options?: { clamp?: boolean }
  ): MotionValue<T>;

  export function useInView(
    ref: React.RefObject<Element>,
    options?: {
      root?: Element | null;
      rootMargin?: string;
      threshold?: number | number[];
      once?: boolean;
    }
  ): boolean;
}

// GSAP
declare module 'gsap' {
  interface GSAPStatic {
    registerPlugin(...args: any[]): void;
    to(target: any, vars: any): any;
    timeline(vars?: any): any;
    getAll(): any[];
  }

  const gsap: GSAPStatic;
  export default gsap;
}

declare module 'gsap/dist/ScrollTrigger' {
  const ScrollTrigger: {
    create(vars: any): any;
    refresh(): void;
    kill(revert?: boolean): void;
    getAll(): any[];
  };
  
  export { ScrollTrigger };
}

// Swiper
declare module 'swiper/react' {
  import * as React from 'react';
  import { SwiperOptions } from 'swiper';

  interface SwiperProps extends SwiperOptions {
    children?: React.ReactNode;
    className?: string;
    onSwiper?: (swiper: any) => void;
    [key: string]: any;
  }

  export const Swiper: React.FC<SwiperProps>;
  export const SwiperSlide: React.FC<{ children?: React.ReactNode; className?: string; [key: string]: any }>;
}

declare module 'swiper' {
  interface SwiperOptions {
    [key: string]: any;
  }
  
  export default class Swiper {
    constructor(container: string | HTMLElement, options?: SwiperOptions);
    [key: string]: any;
  }
}

// PhotoSwipe Gallery
declare module 'react-photoswipe-gallery' {
  import * as React from 'react';

  export const Gallery: React.FC<{
    children: React.ReactNode;
    options?: any;
    onOpen?: () => void;
    onClose?: () => void;
  }>;

  export const Item: React.FC<{
    children: (props: any) => React.ReactNode;
    original: string;
    thumbnail?: string;
    width?: number;
    height?: number;
    alt?: string;
    id?: string | number;
    [key: string]: any;
  }>;
}

// Additional component props
export interface ImageCarouselProps {
  images: string[];
  autoplay?: boolean;
  autoplayDelay?: number;
  withLightbox?: boolean;
  withThumbnails?: boolean;
  className?: string;
  id?: string;
} 