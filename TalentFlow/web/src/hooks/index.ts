// Custom hooks
export { useAuth } from '../contexts/AuthContext';
export { useTheme } from '../contexts/ThemeContext';

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

// Re-export React Router hooks
export {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  useOutlet,
  useOutletContext,
  useRoutes,
  useMatch,
  useResolvedPath,
  useHref,
  useFetcher,
  useFetchers,
  useRevalidator,
  useBeforeUnload,
  useBlocker,
  unstable_usePrompt as usePrompt,
  useActionData,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
  useSubmit,
  useFormAction,
  useLinkClickHandler,
  useSearchParams as useSearchParamsHook
} from 'react-router-dom';
