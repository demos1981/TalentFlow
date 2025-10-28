import { useState, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
  resetOnExecute?: boolean;
}

export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    onFinally,
    resetOnExecute = false,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      // Скидаємо стан, якщо потрібно
      if (resetOnExecute) {
        setState({
          data: null,
          loading: true,
          error: null,
        });
      } else {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      // Скасовуємо попередню операцію, якщо вона виконується
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Створюємо новий AbortController
      abortControllerRef.current = new AbortController();

      try {
        const result = await asyncFunction(...args);
        
        setState({
          data: result,
          loading: false,
          error: null,
        });

        onSuccess?.(result);
        return result;
      } catch (error) {
        // Перевіряємо, чи не була операція скасована
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }

        const errorObj = error instanceof Error ? error : new Error(String(error));
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorObj,
        }));

        onError?.(errorObj);
        throw errorObj;
      } finally {
        onFinally?.();
        abortControllerRef.current = null;
      }
    },
    [asyncFunction, resetOnExecute, onSuccess, onError, onFinally]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
    
    // Скасовуємо поточну операцію
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  // Виконуємо функцію одразу, якщо immediate = true
  const executeRef = useRef(execute);
  executeRef.current = execute;

  useState(() => {
    if (immediate) {
      executeRef.current();
    }
  });

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    setLoading,
  };
}

// Хук для простого асинхронного стану
export function useAsyncState<T = any>(): [
  AsyncState<T>,
  {
    setData: (data: T) => void;
    setError: (error: Error) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
  }
] {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return [
    state,
    {
      setData,
      setError,
      setLoading,
      reset,
    },
  ];
}

// Хук для асинхронного завантаження даних з кешем
export function useAsyncWithCache<T = any>(
  key: string,
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> & {
    cacheTime?: number;
    staleTime?: number;
  } = {}
): UseAsyncReturn<T> & {
  isStale: boolean;
  refetch: () => Promise<T>;
} {
  const {
    cacheTime = 5 * 60 * 1000, // 5 хвилин
    staleTime = 1 * 60 * 1000, // 1 хвилина
    ...otherOptions
  } = options;

  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const [isStale, setIsStale] = useState(false);

  const execute = useCallback(async (): Promise<T> => {
    const cached = cacheRef.current.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < cacheTime) {
      // Дані в кеші і не застаріли
      setIsStale(now - cached.timestamp > staleTime);
      return cached.data;
    }

    // Завантажуємо нові дані
    const result = await asyncFunction();
    
    // Зберігаємо в кеш
    cacheRef.current.set(key, { data: result, timestamp: now });
    setIsStale(false);
    
    return result;
  }, [key, asyncFunction, cacheTime, staleTime]);

  const refetch = useCallback(async (): Promise<T> => {
    // Видаляємо з кешу для примусового оновлення
    cacheRef.current.delete(key);
    return execute();
  }, [key, execute]);

  const asyncHook = useAsync(execute, otherOptions);

  return {
    ...asyncHook,
    isStale,
    refetch,
  };
}

// Хук для асинхронного завантаження з retry логікою
export function useAsyncWithRetry<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> & {
    retryCount?: number;
    retryDelay?: number;
    retryCondition?: (error: Error) => boolean;
  } = {}
): UseAsyncReturn<T> & {
  retryCount: number;
  retry: () => Promise<T>;
} {
  const {
    retryCount: maxRetries = 3,
    retryDelay = 1000,
    retryCondition = () => true,
    ...otherOptions
  } = options;

  const [currentRetryCount, setCurrentRetryCount] = useState(0);

  const executeWithRetry = useCallback(
    async (...args: any[]): Promise<T> => {
      let lastError: Error;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          setCurrentRetryCount(attempt);
          return await asyncFunction(...args);
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          // Перевіряємо, чи потрібно повторювати
          if (attempt === maxRetries || !retryCondition(lastError)) {
            throw lastError;
          }

          // Затримка перед повторною спробою
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          }
        }
      }

      throw lastError!;
    },
    [asyncFunction, maxRetries, retryDelay, retryCondition]
  );

  const retry = useCallback(async (): Promise<T> => {
    return executeWithRetry();
  }, [executeWithRetry]);

  const asyncHook = useAsync(executeWithRetry, otherOptions);

  return {
    ...asyncHook,
    retryCount: currentRetryCount,
    retry,
  };
}
