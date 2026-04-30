"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

// Configure NProgress
NProgress.configure({
  minimum: 0.15,
  easing: "ease",
  speed: 400,
  showSpinner: false,
  trickleSpeed: 200,
});

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept all <a> link clicks to start the bar
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, hash-only links, and target="_blank"
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank"
      )
        return;

      // Only start if navigating to a different path
      const currentPath = window.location.pathname;
      const nextPath = href.split("?")[0].split("#")[0];
      if (currentPath !== nextPath) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
  <style>{`
    #nprogress {
      pointer-events: none;
    }

    #nprogress .bar {
      background: #000;
      position: fixed;
      z-index: 99999;
      top: 0;
      left: 0;

      width: 100%;
      height: 1.5px; /* thinner = modern */

      border-radius: 0 0 3px 3px;

      /* very soft shadow (not aggressive) */
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    }

    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0;
      width: 60px;
      height: 100%;
      opacity: 0.6;

      /* subtle trailing glow */
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);

      transform: rotate(2deg) translateY(-1px);
    }
  `}</style>
);
}
