/* eslint-disable no-sequences */
/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';

function getRect(element) {
  if (!element) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    };
  }

  return element.getBoundingClientRect();
}

export const useRect = (ref) => {
  const [rect, setRect] = useState(getRect(ref ? ref.current : null));

  const handleResize = useCallback(() => {
    if (!ref.current) {
      return;
    }

    // Update client rect
    setRect(getRect(ref.current));
  }, [ref]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    handleResize();

    if (typeof ResizeObserver === 'function') {
      let resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(element);

      return () => {
        if (!resizeObserver) {
          return;
        }

        resizeObserver.disconnect();
        resizeObserver = null;
      };
    }
    // Browser support, remove freely
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref.current]);

  return rect;
};

export  function useMeasure() {
  const ref = useRef();
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));
  useEffect(() => (ro.observe(ref.current), ro.disconnect), []);
  return [{ ref }, bounds];
}

export  function useMedia(queries, values, defaultValue) {
  const match = () => values[queries.findIndex(q => matchMedia(q).matches)] || defaultValue;
  const [value, set] = useState(match);
  useEffect(() => {
    const handler = () => set(match);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener(handler);
  }, []);
  return value;
}

export default {};
