'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface InstantTransitionProps {
  children: React.ReactNode;
}

export const InstantTransition: React.FC<InstantTransitionProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Показуємо індикатор переходу на дуже короткий час
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 50); // Дуже короткий час для миттєвого відгуку

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`instant-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
      {isTransitioning && (
        <div className="transition-indicator">
          <div className="transition-spinner"></div>
        </div>
      )}
    </div>
  );
};
