import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode | (() => ReactNode);
  fallback?: ReactNode;
}

/**
 * ClientOnly component that renders its children only on the client side
 * This avoids hydration issues with components that use browser APIs
 */
const ClientOnly: React.FC<ClientOnlyProps> = ({ 
  children, 
  fallback = null 
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{typeof children === 'function' ? children() : children}</>;
};

export default ClientOnly; 