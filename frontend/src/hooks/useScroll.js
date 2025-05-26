import { useState, useEffect } from 'react';

export const useScroll = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  });

  const [scrollDirection, setScrollDirection] = useState({
    up: false,
    down: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      setScrollPosition({
        x: currentScrollX,
        y: currentScrollY,
      });

      setScrollDirection({
        up: currentScrollY < lastScrollY,
        down: currentScrollY > lastScrollY,
      });

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    scrollPosition,
    scrollDirection,
  };
};

export default useScroll; 