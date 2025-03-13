import { createElement } from 'react';
import { motion as m, Variants as FramerVariants, MotionProps } from 'framer-motion';

export type Variants = FramerVariants;

// Create a typed wrapper for motion components
const createMotionComponent = (element: string) => {
  return (props: any) => createElement(m(element), props);
};

// Define commonly used motion components
export const motion = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  p: createMotionComponent('p'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
  h5: createMotionComponent('h5'),
  h6: createMotionComponent('h6'),
  button: createMotionComponent('button'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
  a: createMotionComponent('a'),
};

export default motion; 