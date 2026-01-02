import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else if (user?.role === "seller") {
        return <Navigate to="/seller/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Allow unauthenticated access to shopping pages (except account/checkout)
  const publicShoppingPaths = ["/shop/home", "/shop/listing", "/shop/search", "/shop/paypal-return", "/shop/payment-success"];
  const isPublicShoppingPath = publicShoppingPaths.some(path => location.pathname === path || location.pathname.startsWith(path));
  
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      isPublicShoppingPath
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "seller") {
      return <Navigate to="/seller/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Restrict admin routes to admin only
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Restrict seller routes to seller only (but not /admin/sellers)
  if (
    isAuthenticated &&
    user?.role !== "seller" &&
    location.pathname.startsWith("/seller")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Redirect admins from shop routes and /seller routes (but not /admin/sellers)
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    (location.pathname.includes("/shop") || location.pathname.startsWith("/seller"))
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Redirect sellers from shop/admin routes
  if (
    isAuthenticated &&
    user?.role === "seller" &&
    (location.pathname.includes("/shop") || location.pathname.includes("/admin"))
  ) {
    return <Navigate to="/seller/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
