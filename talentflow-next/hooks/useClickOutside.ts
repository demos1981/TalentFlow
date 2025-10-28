import { useEffect, useRef, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options: {
    enabled?: boolean;
    eventType?: 'mousedown' | 'mouseup' | 'click';
  } = {}
): void {
  const { enabled = true, eventType = 'mousedown' } = options;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Перевіряємо, чи клік був поза елементом
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      handler(event);
    };

    // Додаємо слухач подій
    document.addEventListener(eventType, listener);
    
    // Додаємо touchstart для мобільних пристроїв
    if (eventType === 'mousedown') {
      document.addEventListener('touchstart', listener);
    }

    return () => {
      document.removeEventListener(eventType, listener);
      if (eventType === 'mousedown') {
        document.removeEventListener('touchstart', listener);
      }
    };
  }, [ref, handler, enabled, eventType]);
}

// Хук для закриття модального вікна при кліку поза ним
export function useModalClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття dropdown при кліку поза ним
export function useDropdownClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття popover при кліку поза ним
export function usePopoverClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття tooltip при кліку поза ним
export function useTooltipClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття context menu при кліку поза ним
export function useContextMenuClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття sidebar при кліку поза ним
export function useSidebarClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття drawer при кліку поза ним
export function useDrawerClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття notification при кліку поза ним
export function useNotificationClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття search suggestions при кліку поза ними
export function useSearchSuggestionsClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}

// Хук для закриття autocomplete при кліку поза ним
export function useAutocompleteClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  enabled: boolean = true
): void {
  useClickOutside(ref, onClose, { enabled, eventType: 'mousedown' });
}
