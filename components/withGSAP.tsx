import React, { useEffect, ReactNode } from 'react';

interface WithGSAPProps {
  children: ReactNode;
}

const WithGSAP: React.FC<WithGSAPProps> = ({ children }) => {
  useEffect(() => {
    // Import GSAP only on client-side
    const importGSAP = async () => {
      const gsapModule = await import('gsap');
      const ScrollTriggerModule = await import('gsap/dist/ScrollTrigger');
      
      const gsap = gsapModule.default;
      const { ScrollTrigger } = ScrollTriggerModule;
      
      gsap.registerPlugin(ScrollTrigger);
      
      // Initialize GSAP animations here
      // ...
    };
    
    importGSAP();
  }, []);
  
  return <>{children}</>;
};

export default WithGSAP; 