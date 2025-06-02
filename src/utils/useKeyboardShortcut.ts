import { useEffect } from 'react';

type KeyCombination = {
  key: string;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
};

export const useKeyboardShortcut = (
  keyCombination: KeyCombination,
  callback: () => void,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === keyCombination.key.toLowerCase();
      const matchesShift = keyCombination.shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = keyCombination.alt ? event.altKey : !event.altKey;
      const matchesCtrl = keyCombination.ctrl ? event.ctrlKey : !event.ctrlKey;
      const matchesMeta = keyCombination.meta ? event.metaKey : !event.metaKey;
      
      if (matchesKey && matchesShift && matchesAlt && matchesCtrl && matchesMeta) {
        event.preventDefault();
        callback();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyCombination, callback, ...dependencies]);
};