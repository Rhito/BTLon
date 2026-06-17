import { useAuth } from "@/contexts/AuthProvider";

export default function RequirePermission({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}
