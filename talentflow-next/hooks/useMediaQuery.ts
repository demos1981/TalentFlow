import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Встановлюємо початкове значення
    setMatches(mediaQuery.matches);

    // Функція для оновлення стану
    const updateMatches = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Додаємо слухач подій
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches);
    } else {
      // Fallback для старих браузерів
      mediaQuery.addListener(updateMatches);
    }

    // Очищаємо слухач
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMatches);
      } else {
        // Fallback для старих браузерів
        mediaQuery.removeListener(updateMatches);
      }
    };
  }, [query]);

  return matches;
}

// Попередньо визначені медіа-запити
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)');

// Хук для темної теми
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

// Хук для зменшеного руху
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

// Хук для високого контрасту
export const usePrefersHighContrast = () => useMediaQuery('(prefers-contrast: high)');

// Хук для орієнтації екрану
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');
export const useIsLandscape = () => useMediaQuery('(orientation: landscape)');

// Хук для розміру екрану
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Хук для breakpoint'ів
export const useBreakpoint = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isLargeDesktop = useIsLargeDesktop();

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isLargeDesktop) return 'large-desktop';
  return 'desktop';
};

// Хук для responsive значень
export function useResponsiveValue<T>(
  mobile: T,
  tablet: T,
  desktop: T,
  largeDesktop?: T
): T {
  const breakpoint = useBreakpoint();

  switch (breakpoint) {
    case 'mobile':
      return mobile;
    case 'tablet':
      return tablet;
    case 'large-desktop':
      return largeDesktop || desktop;
    default:
      return desktop;
  }
}

// Хук для умовного рендерингу на основі медіа-запитів
export function useMediaQueryCondition(
  query: string,
  trueComponent: React.ReactNode,
  falseComponent: React.ReactNode
): React.ReactNode {
  const matches = useMediaQuery(query);
  return matches ? trueComponent : falseComponent;
}
