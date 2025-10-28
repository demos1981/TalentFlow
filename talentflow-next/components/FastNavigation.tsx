'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FastNavigationProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  prefetch?: boolean;
}

export const FastNavigation: React.FC<FastNavigationProps> = ({ 
  href, 
  className, 
  children, 
  prefetch = true 
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Використовуємо router.push для швидшої навігації
    router.push(href);
  };

  return (
    <Link 
      href={href} 
      className={className}
      prefetch={prefetch}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};
