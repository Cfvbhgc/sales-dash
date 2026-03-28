import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration: number = 1500): number {
  const [count, setCount] = useState(0);
  const prevEnd = useRef(end);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const startVal = prevEnd.current !== end ? count : 0;
    prevEnd.current = end;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(startVal + (end - startVal) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration]);

  return count;
}
