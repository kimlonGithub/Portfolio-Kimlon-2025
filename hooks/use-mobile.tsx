"use client";

import { useState, useEffect } from "react";

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window === "undefined") return;

    // Initial check
    setIsMobile(window.innerWidth < breakpoint);

    // Handler for window resize
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
