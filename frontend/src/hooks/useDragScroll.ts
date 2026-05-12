import { useRef, useCallback } from 'react';

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.scrollBehavior = 'auto';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const el = ref.current;
    if (!el) return;
    e.preventDefault();
    const dx = e.clientX - startX.current;
    el.scrollLeft = scrollStart.current - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    if (ref.current) {
      ref.current.style.cursor = 'grab';
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    dragging.current = false;
    if (ref.current) {
      ref.current.style.cursor = 'grab';
    }
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = ref.current;
    if (!el) return;
    startX.current = e.touches[0].clientX;
    scrollStart.current = el.scrollLeft;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const el = ref.current;
    if (!el) return;
    const dx = e.touches[0].clientX - startX.current;
    el.scrollLeft = scrollStart.current - dx;
  }, []);

  return {
    ref,
    handlers: {
      onMouseDown, onMouseMove, onMouseUp, onMouseLeave,
      onTouchStart, onTouchMove,
    },
  };
}
