// Custom hooks
export { useAuthStore } from '../stores/authStore';
export { useLanguageStore } from '../stores/languageStore';
export { useThemeStore } from '../stores/themeStore';

// Utility hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebounceCallback, useDebounceEffect } from './useDebounce';
export { 
  useIntersectionObserver, 
  useInfiniteScroll, 
  useLazyImage, 
  useVisibilityChange 
} from './useIntersectionObserver';
export { 
  useMediaQuery, 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop, 
  useIsLargeDesktop,
  usePrefersDarkMode,
  usePrefersReducedMotion,
  usePrefersHighContrast,
  useIsPortrait,
  useIsLandscape,
  useScreenSize,
  useBreakpoint,
  useResponsiveValue,
  useMediaQueryCondition
} from './useMediaQuery';
export { 
  useClickOutside,
  useModalClickOutside,
  useDropdownClickOutside,
  usePopoverClickOutside,
  useTooltipClickOutside,
  useContextMenuClickOutside,
  useSidebarClickOutside,
  useDrawerClickOutside,
  useNotificationClickOutside,
  useSearchSuggestionsClickOutside,
  useAutocompleteClickOutside
} from './useClickOutside';
export { 
  useForm, 
  useSimpleForm 
} from './useForm';
export { 
  useAsync, 
  useAsyncState, 
  useAsyncWithCache, 
  useAsyncWithRetry 
} from './useAsync';

// Re-export React hooks for convenience
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId,
  useTransition,
  useDeferredValue,
  useSyncExternalStore,
  useInsertionEffect
} from 'react';

// Re-export React Query hooks
export {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQueries
} from '@tanstack/react-query';

// Re-export Next.js navigation hooks
export {
  useRouter,
  usePathname,
  useSearchParams,
  useParams
} from 'next/navigation';
