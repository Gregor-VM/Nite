import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

interface ShortcutsProps {
    key: string
    callback: () => void
}

function useShortcut({key, callback}: ShortcutsProps) {

  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleKeyPressed = useCallback((event: KeyboardEvent) => {
    if(event.key === key && event.ctrlKey){
      callbackRef.current();
    }
  }, [callback])

  useEffect(() => {

    window.addEventListener('keydown', handleKeyPressed);

    return () => {
        window.removeEventListener('keydown', handleKeyPressed);
    }

  }, []);

}

export default useShortcut