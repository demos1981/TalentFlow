import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<Element | null>(null);

  const updateEntry = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);

      // Якщо freezeOnceVisible включено і елемент став видимим, відключаємо observer
      if (freezeOnceVisible && entry.isIntersecting) {
        if (ref.current && observer.current) {
          observer.current.unobserve(ref.current);
        }
      }
    },
    [freezeOnceVisible]
  );

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Створюємо новий observer
    observer.current = new IntersectionObserver(updateEntry, {
      root,
      rootMargin,
      threshold,
    });

    // Спостерігаємо за елементом
    observer.current.observe(element);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [root, rootMargin, threshold, updateEntry]);

  return { ref, isIntersecting, entry };
}

// Хук для нескінченного скролу
export function useInfiniteScroll<T>(
  fetchNextPage: () => Promise<T[]>,
  hasNextPage: boolean,
  isLoading: boolean,
  options: UseIntersectionObserverOptions = {}
): React.RefObject<Element | null> {
  const { ref, isIntersecting } = useIntersectionObserver(options);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isLoading, fetchNextPage]);

  return ref;
}

// Хук для lazy loading зображень
export function useLazyImage(
  src: string,
  options: UseIntersectionObserverOptions = {}
): { ref: React.RefObject<HTMLImageElement | null>; isLoaded: boolean; isInView: boolean } {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver(options);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isIntersecting && imgRef.current) {
      const img = imgRef.current;
      
      if (img.src !== src) {
        img.src = src;
      }

      const handleLoad = () => setIsLoaded(true);
      const handleError = () => setIsLoaded(false);

      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }
  }, [isIntersecting, src]);

  return { ref: imgRef, isLoaded, isInView: isIntersecting };
}

// Хук для відстеження видимості елемента з callback
export function useVisibilityChange(
  callback: (isVisible: boolean, entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
): React.RefObject<Element | null> {
  const { ref, isIntersecting, entry } = useIntersectionObserver(options);

  useEffect(() => {
    if (entry) {
      callback(isIntersecting, entry);
    }
  }, [isIntersecting, entry, callback]);

  return ref;
}
