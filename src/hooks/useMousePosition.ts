import { useEffect, useRef } from "react";

export interface MousePosition {
  x: number;
  y: number;
  scrollY: number;
}

export function useMousePosition() {
  const ref = useRef<MousePosition>({ x: 0, y: 0, scrollY: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      ref.current.scrollY = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return ref;
}
