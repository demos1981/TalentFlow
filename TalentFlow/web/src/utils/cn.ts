import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to combine CSS class names conditionally
 * Uses clsx for conditional classes without Tailwind dependencies
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
