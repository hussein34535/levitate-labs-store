import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the window scroll position on every route change.
 *
 * Without this, an SPA keeps the previous page's scroll offset. The cart is
 * normally opened near the bottom of a product page, so /checkout used to open
 * already scrolled to the bottom.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let cancelled = false;
    let userInteracted = false;
    let frame = 0;
    const timers: number[] = [];

    const markInteraction = () => {
      userInteracted = true;
    };

    // Let the user take over if they start scrolling right after navigating.
    window.addEventListener("wheel", markInteraction, { passive: true });
    window.addEventListener("touchstart", markInteraction, { passive: true });
    window.addEventListener("pointerdown", markInteraction, { passive: true });
    window.addEventListener("keydown", markInteraction);

    const jumpToTop = () => {
      if (cancelled || userInteracted) return;
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    };

    const hashTarget = hash ? document.getElementById(hash.slice(1)) : null;

    if (hashTarget) {
      hashTarget.scrollIntoView({ block: "start" });
    } else {
      jumpToTop();
      frame = window.requestAnimationFrame(jumpToTop);
      // The Radix cart drawer locks body scroll and releases it after its exit
      // animation, so retry briefly to make sure the new page really lands at
      // the top.
      [80, 240, 420].forEach((ms) => {
        timers.push(window.setTimeout(jumpToTop, ms));
      });
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("wheel", markInteraction);
      window.removeEventListener("touchstart", markInteraction);
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
