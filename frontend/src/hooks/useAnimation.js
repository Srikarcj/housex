import { useState, useEffect, useRef } from 'react';

export const useAnimation = (options = {}) => {
  const {
    duration = 1000,
    delay = 0,
    easing = 'ease',
    onComplete,
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current - delay;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
  };

  const reset = () => {
    stop();
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    isAnimating,
    progress,
    start,
    stop,
    reset,
  };
};

export default useAnimation; 