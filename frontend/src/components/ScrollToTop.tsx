import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ excludedRoutes = [] }: { excludedRoutes?: string[] }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if the current URL is in the excluded list
    const isExcluded = excludedRoutes.some((route) => pathname === route);

    if (!isExcluded) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname, excludedRoutes]);

  return null;
}
