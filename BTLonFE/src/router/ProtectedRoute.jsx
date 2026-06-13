import { Navigate, useLocation } from "react-router";
import { FullscreenLoader } from "@/components/common/Loadingoverlay";
import { useAuth } from "@/hooks/useAuth";

export default function Protectedroute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isChecking } = useAuth();

  if (isChecking)
    return <FullscreenLoader message="Verification in progress..." />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
